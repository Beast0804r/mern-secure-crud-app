const express = require('express');


const router = express.Router();

const { getUser, createUser, deleteUser, updateUser, uniqueCheck } = require('../controllers/userController');

const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require("../middlewares/uploadMiddleware");
// Public route
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/list', authMiddleware, getUser);
router.post('/store', authMiddleware,upload.single('file'), createUser);
router.put('/delete/:id', authMiddleware, deleteUser);
router.put('/update/:id', authMiddleware,upload.single('file'), updateUser);
router.post('/emailUnique', authMiddleware, uniqueCheck);

module.exports = router;