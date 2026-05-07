const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true, default: 2 },
  floor: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);
