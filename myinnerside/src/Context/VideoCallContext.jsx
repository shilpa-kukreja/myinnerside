// src/contexts/VideoCallContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import PropTypes from 'prop-types';

const VideoCallContext = createContext();

export const VideoCallProvider = ({ children }) => {
  const [callStatus, setCallStatus] = useState('idle'); // 'idle', 'connecting', 'active', 'ended'
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [appointmentId, setAppointmentId] = useState(null);
  const [otherParticipant, setOtherParticipant] = useState(null);
  
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const initializeSocket = (token) => {
    socketRef.current = io('http://localhost:5000', {
      auth: { token },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to signaling server');
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
      setCallStatus('error');
    });
  };

  const startCall = async (appointmentId, token) => {
    setAppointmentId(appointmentId);
    setCallStatus('connecting');
    
    if (!socketRef.current) {
      initializeSocket(token);
    }

   try {
  const stream = await navigator.mediaDevices.getUserMedia({ 
    video: true, 
    audio: true 
  });
  setLocalStream(stream);
  if (localVideoRef.current) {
    localVideoRef.current.srcObject = stream;
  }

  setupPeerConnection(stream); // ✅ pass directly

  socketRef.current.emit('join-call', { appointmentId });

} catch (error) {
  console.error('Error accessing media devices:', error);
  setCallStatus('error');
}

  };

  const joinCall = async (appointmentId, token) => {
    setAppointmentId(appointmentId);
    setCallStatus('connecting');
    
    if (!socketRef.current) {
      initializeSocket(token);
    }

   try {
  const stream = await navigator.mediaDevices.getUserMedia({ 
    video: true, 
    audio: true 
  });
  setLocalStream(stream);
  if (localVideoRef.current) {
    localVideoRef.current.srcObject = stream;
  }

  setupPeerConnection(stream); // ✅ pass directly

  socketRef.current.emit('join-call', { appointmentId });

} catch (error) {
  console.error('Error accessing media devices:', error);
  setCallStatus('error');
}

  };

  const setupPeerConnection = (stream) => {
  const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  peerConnectionRef.current = new RTCPeerConnection(configuration);

  stream.getTracks().forEach(track => {
    peerConnectionRef.current.addTrack(track, stream);
  });

    // Set up event handlers
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', {
          appointmentId,
          candidate: event.candidate
        });
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      const remoteStream = new MediaStream();
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
      setRemoteStream(remoteStream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      setCallStatus('active');
    };

    peerConnectionRef.current.onconnectionstatechange = () => {
      if (peerConnectionRef.current.connectionState === 'disconnected' ||
          peerConnectionRef.current.connectionState === 'failed') {
        endCall();
      }
    };

    // Socket event listeners
    socketRef.current.on('offer', async ({ offer, sender }) => {
      if (!peerConnectionRef.current) return;
      
      setOtherParticipant(sender);
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      
      socketRef.current.emit('answer', {
        appointmentId,
        answer
      });
    });

    socketRef.current.on('answer', async ({ answer }) => {
      if (!peerConnectionRef.current) return;
      
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socketRef.current.on('ice-candidate', async ({ candidate, sender }) => {
      if (!peerConnectionRef.current) return;
      
      try {
        await peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    });

    socketRef.current.on('user-joined', ({ userId }) => {
      setOtherParticipant(userId);
      if (peerConnectionRef.current.signalingState === 'stable') {
        createOffer();
      }
    });

    socketRef.current.on('user-left', ({ userId }) => {
      console.log(`User left: ${userId}`);
      endCall();
    });

    socketRef.current.on('call-ended', () => {
      endCall();
    });
  };

  const createOffer = async () => {
    if (!peerConnectionRef.current) return;
    
    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      
      socketRef.current.emit('offer', {
        appointmentId,
        offer
      });
    } catch (error) {
      console.error('Error creating offer:', error);
      setCallStatus('error');
    }
  };

  const toggleMic = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicMuted(!isMicMuted);
    }
  };

  const toggleSpeaker = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = !remoteVideoRef.current.muted;
      setIsSpeakerOn(!isSpeakerOn);
    }
  };

  const endCall = () => {
    setCallStatus('ended');
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }
    
    if (socketRef.current) {
      socketRef.current.emit('end-call', { appointmentId });
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    setTimeout(() => {
      setCallStatus('idle');
      setAppointmentId(null);
      setOtherParticipant(null);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (callStatus === 'active' || callStatus === 'connecting') {
        endCall();
      }
    };
  }, []);

  return (
    <VideoCallContext.Provider
      value={{
        callStatus,
        localStream,
        remoteStream,
        isMicMuted,
        isSpeakerOn,
        appointmentId,
        otherParticipant,
        localVideoRef,
        remoteVideoRef,
        startCall,
        joinCall,
        toggleMic,
        toggleSpeaker,
        endCall,
      }}
    >
      {children}
    </VideoCallContext.Provider>
  );
};

VideoCallProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useVideoCall = () => {
  const context = useContext(VideoCallContext);
  if (!context) {
    throw new Error('useVideoCall must be used within a VideoCallProvider');
  }
  return context;
};