import '../assets/Css/VideoCall.css';
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { IoMicOutline, IoMicOffOutline } from "react-icons/io5";
import { MdOutlineCallEnd } from "react-icons/md";
import { CgArrowsExpandRight } from "react-icons/cg";
import { GoDotFill } from "react-icons/go";
import { useContext, useState, useEffect, useRef } from 'react';
import { useVideoCall } from '../Context/VideoCallContext';
import VideoCalls from './VideoCalls';
import { useParams } from 'react-router-dom';
import { Context } from '../Context/CreateContext';
import { IoVolumeHigh, IoVolumeOff } from "react-icons/io5";

const VideoCall = () => {
    const { id } = useParams();
    const { token } = useContext(Context);
    const {
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
        startCall,
        callStatus
    } = useVideoCall();

    const [isSwapped, setIsSwapped] = useState(false);
    const [isVideoHidden, setIsVideoHidden] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [callDuration, setCallDuration] = useState(0);
    const [showCall, setShowCall] = useState(false);
    const timerRef = useRef(null);

    const handleStartCall = (appointmentId) => {
        startCall(appointmentId, token);
        setShowCall(true);
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    };

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

    useEffect(() => {
        if (showCall) {
            timerRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [showCall]);

    const handleEndCall = () => {
        endCall();
        setShowCall(false);
        setCallDuration(0);
    };

  const toggleVideo = async () => {
    if (!localStream) {
        
        handleStartCall(id);
        return;
    };

    const videoTracks = localStream.getVideoTracks();
    const videoTrack = videoTracks[0];

    if (videoTrack.enabled) {
        // 🔇 Turn video OFF
        videoTrack.enabled = false;
        setIsVideoOn(false);
    } else {
        try {
            // ✅ Replace with a new video track (turning ON)
            const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
            const newVideoTrack = newStream.getVideoTracks()[0];

            // Remove the old track and add the new one to the existing stream
            localStream.removeTrack(videoTrack);
            localStream.addTrack(newVideoTrack);

            // Stop the old video track
            videoTrack.stop();

            // Update the video element
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = null;
                localVideoRef.current.srcObject = localStream;
            }

            setIsVideoOn(true);
        } catch (err) {
            console.error("Error restarting video:", err);
        }
    }
};


    useEffect(() => {
        // handleStartCall(id);
    }, [id]);

    return (
        <div className="video-call-container">
            <div className="video-call-header">
                <div className='call-info'>
                    <div className='video-icon'>
                        <FaVideo className='icon' />
                    </div>
                    <div className="call-details">
                        <h2>My Inner Site Creative Video Call</h2>
                        <p>Appointment ID: {id}</p>
                    </div>
                </div>
                <div className="call-timer">
                    <button className="live-indicator">
                        <GoDotFill className="live-dot" size={15} />
                        Live {formatTime(callDuration)}
                    </button>
                </div>
            </div>


            <div className={`video-content ${isSwapped ? 'swapped' : ''}`}>
                {/* Remote Participant Video */}
                <div className={`remote-video-container ${isSwapped ? 'swapped-remote' : ''}`}>
                    {remoteStream ? (
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            muted={!isSpeakerOn}
                            className="remote-video"
                        />
                    ) : (
                        <div className="no-video-placeholder">
                            <div className="participant-initials">
                                {otherParticipant?.name?.split(' ').map(n => n[0]).join('') || 'NA'}
                            </div>
                            <h4>{otherParticipant?.name || 'Connecting...'}</h4>
                        </div>
                    )}
                </div>

                {/* Local Participant Video */}
                <div className={`local-video-container ${isSwapped ? 'swapped-local' : ''}`}>
                    {isVideoOn && localStream ? (
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="local-video"
                        />
                    ) : (
                        <div className="no-video-placeholder">
                            <div className="participant-initials">ME</div>
                        </div>
                    )}
                    <div className="local-video-controls">
                        <button
                            className="swap-button"
                            onClick={() => setIsSwapped(prev => !prev)}
                        >
                            <CgArrowsExpandRight className='icon' />
                        </button>
                    </div>
                </div>
            </div>

            <div className="video-controls">
                <button
                    className={`control-button ${isMicMuted ? 'muted' : ''}`}
                    onClick={toggleMic}
                    aria-label={isMicMuted ? "Unmute microphone" : "Mute microphone"}
                >
                    {isMicMuted ? (
                        <IoMicOffOutline className="icon" />
                    ) : (
                        <IoMicOutline className="icon" />
                    )}
                </button>

                {/* Add new speaker button */}
                <button
                    className={`control-button ${!isSpeakerOn ? 'disabled' : ''}`}
                    onClick={toggleSpeaker}
                    aria-label={isSpeakerOn ? "Mute speaker" : "Unmute speaker"}
                >
                    {isSpeakerOn ? (
                        <IoVolumeHigh className="icon" />
                    ) : (
                        <IoVolumeOff className="icon" />
                    )}
                </button>

                <button
                    className={`control-button ${!isVideoOn ? 'disabled' : ''}`}
                    onClick={toggleVideo}
                    aria-label={isVideoOn ? "Hide video" : "Show video"}
                >
                    {isVideoOn ? (
                        <FaVideo className='icon' />
                    ) : (
                        <FaVideoSlash className='icon' />
                    )}
                </button>

                <button
                    className="control-button end-call"
                    onClick={handleEndCall}
                    aria-label="End call"
                >
                    <MdOutlineCallEnd className='icon' />
                </button>
                <button
                    className="start-call-button join-call-button"
                    onClick={() => handleStartCall(id)}
                    aria-label="End call"
                >
                    <MdOutlineCallEnd className='icon' />
                </button>
            </div>

            {/* {showCall && <VideoCalls />} */}
        </div>
    );
};

export default VideoCall;




// components/VideoCall.js
