const express = require('express');
const { getRooms, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .get(protect, getRooms)
  .post(protect, admin, createRoom);

router.route('/:id')
  .put(protect, admin, updateRoom)
  .delete(protect, admin, deleteRoom);

module.exports = router;
