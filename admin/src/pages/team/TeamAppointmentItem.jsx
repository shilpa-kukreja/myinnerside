// src/components/team/TeamAppointmentItem.jsx
import { useState } from 'react';
import { useVideoCall } from '../../contexts/VideoCallContext';
import VideoCall from '../VideoCall';
import '../../styles/video-call.css';


const TeamAppointmentItem = ({ appointment, token }) => {
  const [showCall, setShowCall] = useState(false);
  const { joinCall, callStatus } = useVideoCall();

  const handleJoinCall = () => {
    joinCall(appointment.id, token);
    setShowCall(true);
  };

  return (
    <div className="appointment-item">
      <h3>Appointment with {appointment.user.name}</h3>
      <p>Scheduled for: {new Date(appointment.time).toLocaleString()}</p>
      <p>Status: {appointment.status}</p>
      
      {appointment.status === 'in-progress' && (
        <button 
          onClick={handleJoinCall} 
          disabled={callStatus !== 'idle'}
          className="join-call-button"
        >
          Join Video Call
        </button>
      )}

      {showCall && <VideoCall />}
    </div>
  );
};

export default TeamAppointmentItem;