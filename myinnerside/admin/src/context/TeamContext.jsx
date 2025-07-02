import { createContext,useState } from "react";

export const TeamContext = createContext();


const TeamContextProvider = ( props ) => {
    const [tToken, setTToken] = useState(localStorage.getItem('tToken') ? localStorage.getItem('tToken') : '');
     const backendUrl= import.meta.env.VITE_BACKEND_URL

    const value = {
        tToken,setTToken,backendUrl
    }

    return (
        <TeamContext.Provider value={value}>
            {props.children}
        </TeamContext.Provider>
    );
}
export default TeamContextProvider;