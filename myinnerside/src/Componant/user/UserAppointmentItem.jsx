// src/components/user/UserAppointmentItem.jsx
import { useState } from 'react';
import { useVideoCall } from '../../contexts/VideoCallContext';
import VideoCalls from '../VideoCalls';
import '../../src/styles/video-call.css';


const UserAppointmentItem = ({ appointment, token }) => {
  const [showCall, setShowCall] = useState(false);
  const { startCall, callStatus } = useVideoCall();

  const handleStartCall = () => {
    startCall(appointment.id, token);
    setShowCall(true);
  };
 
  return (
    <div className="appointment-item">
      <h3>Appointment with {appointment.teamMember.name}</h3>
      <p>Scheduled for: {new Date(appointment.time).toLocaleString()}</p>
      <p>Status: {appointment.status}</p>
      
      {appointment.status === 'confirmed' && (
        <button 
          onClick={handleStartCall} 
          disabled={callStatus !== 'idle'}
          className="start-call-button"
        >
          Start Video Call
        </button>
      )}

      {showCall && <VideoCalls />}
    </div>
  );
};

export default UserAppointmentItem;