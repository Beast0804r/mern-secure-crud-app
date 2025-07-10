const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    file: {
        type: String
    },
    status: {
        type: Number,
        default: 1
    },
    trash: {
        type: String,
        default: "NO"

    },
});


module.exports = mongoose.model('User', userSchema);