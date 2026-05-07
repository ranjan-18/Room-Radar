const Room = require('../models/Room');
const asyncHandler = require('../middleware/asyncHandler');

const getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

const createRoom = asyncHandler(async (req, res) => {
  const { roomNumber, capacity, floor } = req.body;
  const room = await Room.create({ roomNumber, capacity, floor });
  res.status(201).json(room);
});

const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(room);
});

const deleteRoom = asyncHandler(async (req, res) => {
  await Room.findByIdAndDelete(req.params.id);
  res.json({ message: 'Room removed' });
});

module.exports = { getRooms, createRoom, updateRoom, deleteRoom };
