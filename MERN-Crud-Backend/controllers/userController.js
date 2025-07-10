const User = require('../models/User');

const getUser = async (req, res) => {

    const page = parseInt(req.query.page) || 1; // default: page 1
    const limit = 5;
    const skip = (page - 1) * limit;
    const searchQuery = req.query.search || "";
    
    const searchCondition = {
        status: 1,
        trash: "NO",
        $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { email: { $regex: searchQuery, $options: 'i' } }
        ]
    };

    const user = await User.find(searchCondition).skip(skip).limit(limit);
    const total = await User.countDocuments(searchCondition);


    res.json({
        data: user,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalRecords: total
    });

};


const createUser = async (req, res) => {
    const { name, email } = req.body;

    const file = req.file ? req.file.filename : null;

    if (!name || !email) {
        return res.status(400).json({ message: "Name and Email Rquired !" });
    }

    const emailExist = await User.findOne({ email });

    if (emailExist) {
        return res.status(400).json({ message: "Email already Exist !" });
    }

    const newUser = new User({ name, email, file });
    await newUser.save();

    return res.status(200).json(newUser);
};

// const deleteUser = async (req , res) => {
//     const user = await User.findOneAndDelete(req.params.id);
//     res.json({ message:"user deleted Successfully"});

// };


const deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id },
            { status: 0, trash: "YES" },
            { new: true }
        );

        res.json({ message: "User deleted successfully", data: user });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ message: "Failed to delete user" });
    }
};


const updateUser = async (req, res) => {
    try {

        const file = req.file ? req.file.filename : null;

        const user = await User.findOneAndUpdate({ _id: req.params.id }, { name: req.body.name, email: req.body.email, file: file }, { new: true });

        res.json({ message: "User Updated successfully", data: user });
    } catch (err) {
        console.error("Updaet error:", err);
        res.status(500).json({ message: "Failed to update user", err });
    }
};

const uniqueCheck = async (req, res) => {
    try {

        const user = await User.findOne({ email: req.body.email, status: 1, trash: "NO" });
        res.json({ exists: !!user });
    } catch {
        console.error("Unique check error:", err);
        res.status(500).json({ message: "Failed to check email" });
    }

};


module.exports = { getUser, createUser, deleteUser, updateUser, uniqueCheck };