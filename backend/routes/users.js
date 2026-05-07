const express = require('express');
const { createStudent, getStudents, updateMyRoom } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .post(protect, admin, createStudent)
  .get(protect, getStudents);

router.put('/me/room', protect, updateMyRoom);

module.exports = router;
