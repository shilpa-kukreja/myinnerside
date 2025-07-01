// src/components/VideoCall.jsx
import { useEffect } from 'react';
import { useVideoCall } from '../../context/VideoCallContext';

const VideoCalls = () => {
  const {
    callStatus,
    localStream,
    remoteStream,
    isMicMuted,
    isSpeakerOn,
    otherParticipant,
    localVideoRef,
    remoteVideoRef,
    toggleMic,
    toggleSpeaker,
    endCall,
  } = useVideoCall();

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, localVideoRef]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, remoteVideoRef]);

  return (
    <div className="video-call-container">
      <div className="video-call-status">
        {callStatus === 'connecting' && <p>Connecting to call...</p>}
        {callStatus === 'active' && (
          <p>In call with {otherParticipant || 'the other participant'}</p>
        )}
        {callStatus === 'ended' && <p>Call ended</p>}
      </div>

      <div className="video-streams">
        <div className="remote-video-container">
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            muted={!isSpeakerOn}
            className="remote-video"
          />
        </div>
        <div className="local-video-container">
          <video 
            ref={localVideoRef} 
            autoPlay 
            playsInline 
            muted 
            className="local-video"
          />
        </div>
      </div>

      <div className="call-controls">
        <button 
          onClick={toggleMic} 
          className={`control-button ${isMicMuted ? 'muted' : ''}`}
        >
          {isMicMuted ? 'Unmute' : 'Mute'}
        </button>
        <button 
          onClick={toggleSpeaker} 
          className={`control-button ${!isSpeakerOn ? 'speaker-off' : ''}`}
        >
          {isSpeakerOn ? 'Speaker Off' : 'Speaker On'}
        </button>
        <button 
          onClick={endCall} 
          className="control-button end-call"
        >
          End Call
        </button>
      </div>
    </div>
  );
};

export default VideoCalls;