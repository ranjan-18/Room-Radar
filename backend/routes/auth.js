const express = require('express');
const { initAdmin, login, registerStudent, logoutUser } = require('../controllers/authController');
const router = express.Router();

router.post('/init', initAdmin);
router.post('/login', login);
router.post('/register', registerStudent);
router.post('/logout', logoutUser);

module.exports = router;
