const bcrypt = require('bcryptjs');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

const createStudent = asyncHandler(async (req, res) => {
  const { name, email, password, room } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    name, email, password: hashedPassword, role: 'student', room: room || null
  });
  res.status(201).json(user);
});

const getStudents = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'student' }).populate('room').select('-password');
  res.json(users);
});

const updateMyRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  user.room = roomId || null;
  await user.save();
  
  const updatedUser = await User.findById(req.user._id).populate('room').select('-password');
  res.json(updatedUser);
});

module.exports = { createStudent, getStudents, updateMyRoom };
