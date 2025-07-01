// components/UserVideoCall.js
import { useContext } from 'react';
import { Context } from '../Context/CreateContext';
import VideoCall from './VideoCall';


const UserVideoCall = () => {
    const { token } = useContext(Context);
    return <VideoCall isTeamMember={false} />;
};

export default UserVideoCall;