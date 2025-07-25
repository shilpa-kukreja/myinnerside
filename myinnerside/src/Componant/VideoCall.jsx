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
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    // const handleStartCall = (appointmentId) => {
    //     startCall(appointmentId, token);
    //     setShowCall(true);
    // };


    const handleStartCall = (appointmentId) => {
        // Save state to survive refresh
        localStorage.setItem("activeCall", JSON.stringify({
            id: appointmentId,
            token: token
        }));

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
            // Rebind the stream to fix the blurred/local video not showing issue
            localVideoRef.current.srcObject = null; // Force reset
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream, isVideoOn]);


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

    // const handleEndCall = () => {
    //     endCall();
    //     setShowCall(false);
    //     setCallDuration(0);
    // };

    //     const handleEndCall = () => {
    //     endCall();                  
    //     setShowCall(false);         
    //     setCallDuration(0);         
    //     navigate('/');              
    // };


    const handleEndCall = () => {
        endCall();
        localStorage.removeItem("activeCall"); // Clear call session
        setShowCall(false);
        setCallDuration(0);
        navigate('/');
    };


    const toggleVideo = () => {
        if (!localStream) return;

        const videoTracks = localStream.getVideoTracks();
        if (videoTracks.length === 0) return;

        const videoTrack = videoTracks[0];

        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
    };


    // useEffect(() => {
    //   const activeCall = JSON.parse(localStorage.getItem("activeCall"));

    //   if (activeCall && activeCall.id) {
    //     // Auto-start the call if it was active before refresh
    //     startCall(activeCall.id, activeCall.token);
    //     setShowCall(true);
    //   }
    // }, []);


    useEffect(() => {
        const activeCall = JSON.parse(localStorage.getItem("activeCall"));

        if (activeCall && activeCall.id) {
            const confirmResume = window.confirm("Do you want to resume your previous call?");
            if (confirmResume) {
                startCall(activeCall.id, activeCall.token);
                setShowCall(true);
            } else {
                localStorage.removeItem("activeCall");
                navigate('/');
            }
        }
    }, []);




    // useEffect(() => {
    //     handleStartCall(id);
    // }, [id]);

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
                {/* <button
                    className="start-call-button join-call-button"
                    onClick={() => handleStartCall(id)}
                    aria-label="End call"
                >
                    <MdOutlineCallEnd className='icon' />
                </button> */}
                <button
                    className={`start-call-button join-call-button ${callStatus === 'active' ? 'disabled' : ''}`}
                    onClick={() => callStatus !== 'active' && handleStartCall(id)}
                    disabled={callStatus === 'active'}
                    aria-label={callStatus === 'active' ? "Call in progress" : "Start call"}
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
