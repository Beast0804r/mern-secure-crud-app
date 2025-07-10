const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'test';

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existEmail = await User.findOne({email, status: 1, trash: "NO" });
        if (existEmail) return res.status(400).json({ message: "Mail already exists !" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword });

        user.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        console.error("Register error:", err);

        res.status(500).json({ message: err });

    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {

        const existUser = await User.findOne({email, status: 1, trash: "NO" });
        if (!existUser) return res.status(400).json({ message: "Invalid credentials !" });

        if(existUser.password){
            const isMatch = await bcrypt.compare(password, existUser.password);
            if (!isMatch) return res.status(400).json({ message: "Invalid credentials !" });
        }

        const token = jwt.sign({ userId: existUser._id }, JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: { id: existUser._id, name: existUser.name, email: existUser.email, file: existUser.file }
        });
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }

};