import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trash2, Edit2, Users, Home, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('rooms');

  // Modal states
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [activeQrRoom, setActiveQrRoom] = useState(null);
  
  // Forms
  const [roomForm, setRoomForm] = useState({ roomNumber: '', capacity: 2, floor: '' });
  const [studentForm, setStudentForm] = useState({ name: '', email: '', password: '', room: '' });
  const [editingRoomId, setEditingRoomId] = useState(null);

  useEffect(() => {
    fetchRooms();
    fetchStudents();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/rooms');
      setRooms(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setStudents(res.data);
    } catch (err) { console.error(err); }
  };

  const handleOpenRoomModal = (room = null) => {
    if (room) {
      setEditingRoomId(room._id);
      setRoomForm({ roomNumber: room.roomNumber, capacity: room.capacity, floor: room.floor });
    } else {
      setEditingRoomId(null);
      setRoomForm({ roomNumber: '', capacity: 2, floor: '' });
    }
    setIsRoomModalOpen(true);
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    try {
      if (editingRoomId) {
        await axios.put(`http://localhost:5000/api/rooms/${editingRoomId}`, roomForm);
      } else {
        await axios.post('http://localhost:5000/api/rooms', roomForm);
      }
      setIsRoomModalOpen(false);
      setEditingRoomId(null);
      setRoomForm({ roomNumber: '', capacity: 2, floor: '' });
      fetchRooms();
      toast.success(editingRoomId ? 'Room updated' : 'Room created');
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving room'); }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm('Delete this room?')) {
      try {
        await axios.delete(`http://localhost:5000/api/rooms/${id}`);
        fetchRooms();
        toast.success('Room deleted');
      } catch (err) { toast.error('Error deleting room'); }
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users', studentForm);
      setIsStudentModalOpen(false);
      setStudentForm({ name: '', email: '', password: '', room: '' });
      fetchStudents();
      toast.success('Student added successfully');
    } catch (err) { toast.error(err.response?.data?.message || 'Error adding student'); }
  };

  const openQrModal = (room) => {
    setActiveQrRoom(room);
    setIsQrModalOpen(true);
  };

  return (
    <div className="container animate-fadeIn">
      <div className="flex gap-4 mb-4 mt-4" style={{ flexWrap: 'wrap' }}>
        <button 
          className={activeTab === 'rooms' ? 'btn-primary flex items-center justify-center gap-2' : 'btn-secondary flex items-center justify-center gap-2'} 
          onClick={() => setActiveTab('rooms')}
        >
          <Home size={18} /> Manage Rooms
        </button>
        <button 
          className={activeTab === 'students' ? 'btn-primary flex items-center justify-center gap-2' : 'btn-secondary flex items-center justify-center gap-2'} 
          onClick={() => setActiveTab('students')}
        >
          <Users size={18} /> Manage Students
        </button>
      </div>

      {activeTab === 'rooms' && (
        <div className="card">
          <div className="flex justify-between items-center mb-4 gap-2" style={{ flexWrap: 'wrap' }}>
            <h2>Rooms Directory</h2>
            <button className="btn-primary flex items-center justify-center gap-2" onClick={() => handleOpenRoomModal()}>
              <Plus size={18} /> Add Room
            </button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Room Number</th>
                  <th>Floor</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map(room => (
                  <tr key={room._id}>
                    <td>{room.roomNumber}</td>
                    <td>{room.floor}</td>
                    <td>{room.capacity}</td>
                    <td>
                      <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                        <button className="btn-secondary flex items-center gap-2 justify-center" onClick={() => openQrModal(room)}>
                          <QrCode size={16} /> QR
                        </button>
                        <button className="btn-secondary flex items-center gap-2 justify-center" onClick={() => handleOpenRoomModal(room)}>
                          <Edit2 size={16} /> Edit
                        </button>
                        <button className="btn-danger flex items-center gap-2 justify-center" onClick={() => handleDeleteRoom(room._id)}>
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="card">
          <div className="flex justify-between items-center mb-4 gap-2" style={{ flexWrap: 'wrap' }}>
            <h2>Student Directory</h2>
            <button className="btn-primary flex items-center justify-center gap-2" onClick={() => setIsStudentModalOpen(true)}>
              <Plus size={18} /> Add Student
            </button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Assigned Room</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.room ? student.room.roomNumber : <span className="status-badge status-inactive">Unassigned</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Room Modal */}
      {isRoomModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingRoomId ? 'Edit Room' : 'Add New Room'}</h3>
              <button className="close-btn" onClick={() => setIsRoomModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveRoom}>
              <input type="text" placeholder="Room Number" value={roomForm.roomNumber} onChange={e => setRoomForm({...roomForm, roomNumber: e.target.value})} required />
              <input type="text" placeholder="Floor" value={roomForm.floor} onChange={e => setRoomForm({...roomForm, floor: e.target.value})} required />
              <input type="number" placeholder="Capacity" value={roomForm.capacity} onChange={e => setRoomForm({...roomForm, capacity: Number(e.target.value)})} required min="1" />
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Save Room</button>
            </form>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {isQrModalOpen && activeQrRoom && (
        <div className="modal-overlay">
          <div className="modal" style={{ textAlign: 'center' }}>
            <div className="modal-header">
              <h3>QR Code - {activeQrRoom.roomNumber}</h3>
              <button className="close-btn" onClick={() => setIsQrModalOpen(false)}>&times;</button>
            </div>
            <div style={{ background: 'white', padding: '16px', display: 'inline-block', borderRadius: '8px' }}>
              <QRCodeSVG value={activeQrRoom._id} size={200} />
            </div>
            <p className="mt-4" style={{ color: 'var(--text-muted)' }}>Scan this code to instantly check into {activeQrRoom.roomNumber}.</p>
          </div>
        </div>
      )}

      {/* Student Modal */}
      {isStudentModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Student</h3>
              <button className="close-btn" onClick={() => setIsStudentModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddStudent}>
              <input type="text" placeholder="Full Name" value={studentForm.name} onChange={e => setStudentForm({...studentForm, name: e.target.value})} required />
              <input type="email" placeholder="Email" value={studentForm.email} onChange={e => setStudentForm({...studentForm, email: e.target.value})} required />
              <input type="password" placeholder="Password" value={studentForm.password} onChange={e => setStudentForm({...studentForm, password: e.target.value})} required />
              <select value={studentForm.room} onChange={e => setStudentForm({...studentForm, room: e.target.value})}>
                <option value="">-- Assign Room (Optional) --</option>
                {rooms.map(room => (
                  <option key={room._id} value={room._id}>{room.roomNumber} (Floor {room.floor})</option>
                ))}
              </select>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Save Student</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
