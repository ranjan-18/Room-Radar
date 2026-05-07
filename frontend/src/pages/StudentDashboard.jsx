import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { RefreshCw, MapPin, QrCode } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (user?.room) {
      setSelectedRoom(user.room._id || user.room);
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const roomRes = await axios.get('http://localhost:5000/api/rooms');
      setRooms(roomRes.data);
      const studentRes = await axios.get('http://localhost:5000/api/users');
      setStudents(studentRes.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchData();
    // Poll every 10 seconds for real-time presence updates
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateRoom = async (roomId = selectedRoom) => {
    try {
      const res = await axios.put('http://localhost:5000/api/users/me/room', { roomId });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success('Room updated successfully');
      fetchData(); // refresh immediate
    } catch (err) { toast.error('Error updating room'); }
  };

  useEffect(() => {
    if (isScannerOpen) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
      scannerRef.current.render(onScanSuccess, onScanFailure);
    } else {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => console.error("Failed to clear scanner", error));
      }
    }
    
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => console.error("Failed to clear scanner", error));
      }
    };
  }, [isScannerOpen]);

  const onScanSuccess = (decodedText) => {
    if (scannerRef.current) {
      scannerRef.current.clear().then(() => {
        setIsScannerOpen(false);
        setSelectedRoom(decodedText);
        handleUpdateRoom(decodedText);
      }).catch(err => console.error(err));
    }
  };

  const onScanFailure = (error) => {
    // handle scan failure, usually better to ignore and keep scanning
  };

  return (
    <div className="container animate-fadeIn">
      <div className="grid-2 mb-4">
        <div className="card">
          <h2 className="mb-4">My Profile</h2>
          <p className="mb-2"><strong>Name:</strong> {user.name}</p>
          <p className="mb-4"><strong>Email:</strong> {user.email}</p>
          
          <div className="flex gap-2 items-center mb-4">
            <MapPin size={18} />
            <strong>Current Room:</strong>
            {user.room ? <span className="status-badge status-active">{user.room.roomNumber}</span> : <span className="status-badge status-inactive">Not set</span>}
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <div>
              <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Manual Check-in:</label>
              <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                <select value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)} style={{ marginBottom: 0, flex: '1 1 200px' }}>
                  <option value="">-- Clear Room --</option>
                  {rooms.map(room => (
                    <option key={room._id} value={room._id}>{room.roomNumber} (Floor {room.floor})</option>
                  ))}
                </select>
                <button className="btn-primary" onClick={() => handleUpdateRoom(selectedRoom)} style={{ flex: '1 1 auto' }}>Update</button>
              </div>
            </div>
            
              <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                <span style={{ margin: '0 1rem', color: 'var(--text-muted)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              </div>
              <button className="btn-secondary flex items-center justify-center gap-2" onClick={() => setIsScannerOpen(true)} style={{ width: '100%', padding: '1rem', border: '1px dashed rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.03)' }}>
                <QrCode size={18} /> <span style={{ fontWeight: 500 }}>Scan Room QR Code</span>
              </button>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4 gap-2" style={{ flexWrap: 'wrap' }}>
            <h2>Student Presence</h2>
            <button className="btn-secondary flex items-center gap-2" onClick={fetchData} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
          <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Current Room</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: student.room ? 'var(--success)' : 'var(--danger)' }}></div>
                        {student.name} {student._id === user._id && <span style={{color: 'var(--primary)', fontSize: '0.8rem'}}>(You)</span>}
                      </div>
                    </td>
                    <td>
                      {student.room ? student.room.roomNumber : <span className="status-badge status-inactive">Unknown</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {isScannerOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Scan Room QR Code</h3>
              <button className="close-btn" onClick={() => setIsScannerOpen(false)}>&times;</button>
            </div>
            <div id="reader" width="100%"></div>
            <p className="mt-4 text-center" style={{ color: 'var(--text-muted)' }}>
              Point your camera at the room's QR code to check in automatically.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;
