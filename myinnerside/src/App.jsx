


import { Routes, Route } from 'react-router-dom'
import Header from './Componant/Header'
import Home from './Componant/Home'
import PrivacyPolicy from './Componant/PrivacyPolicy'
import BookAppoinment from './Componant/BookAppoinment'
import Footer from './Componant/Footer'
import Contact from './Componant/Contact'
import ScrollToTop from './Componant/ScrollToTop'
import PopUp from './Componant/PopUp'
import About from './Componant/About'
import TermCondition from './Componant/TermCondition'
import { useContext } from 'react';
import { Context } from './Context/CreateContext';
import Login from './Componant/Login'
 import { useLocation, matchPath } from 'react-router-dom'
 import Signup from './Componant/Signup'
 import MyProfile from './Componant/MyProfile'
 import { ToastContainer } from 'react-toastify'
 import CancellationPolicy from './Componant/CancellationPolicy'
import LifeCoach from './Componant/LifeCoach'
import VideoCall from './Componant/VideoCall'
import ResetPassword from './Componant/ResetPassword'
import Error404 from './Componant/Error404'


const App = () => {
  
   
 
   
    

    const { showAppointmentForm } = useContext(Context);
    const location = useLocation();
    const isVideoCallRoute = matchPath('/video-call/:id', location.pathname);
    const hideHeaderFooter =   location.pathname === '/login' 
    const hideInSignUp =   location.pathname === '/sign-up' 
    const removeHeader = isVideoCallRoute;
    const removeFooter = isVideoCallRoute;
    const hidePopUp =location.pathname === '/login'
    const hidePopOnMyProfile =location.pathname === '/my-profile'
    const hidePopOnVideo = isVideoCallRoute;
     



  return (
    <div>

     <ToastContainer />
      <ScrollToTop />
     
      { !hideHeaderFooter  && !hideInSignUp && !removeHeader  &&  <Header /> }

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
        <Route  path="/contact-us" element={<Contact/>} />
        <Route path='/about-us' element={<About/>} />
        <Route path='/term-condition' element={<TermCondition/>} />
        <Route path='/login' element={    <Login/>} />
        <Route path='/sign-up' element={<Signup/>} />
        <Route path="/reset-password/:token" element={<ResetPassword/>} />
        <Route path='/my-profile' element={<MyProfile/>} />
        <Route  path ='/cancellation-policy' element={<CancellationPolicy />} />
        <Route  path='/life-coach' element={<LifeCoach />} />
        <Route  path='/video-call/:id' element={ <VideoCall />} />
         <Route path="*" element={<Error404/>} />
        
      </Routes>



    {showAppointmentForm && <BookAppoinment />}
   { !hidePopUp && !hidePopOnMyProfile && !hidePopOnVideo &&    < PopUp />}
 

{!hideHeaderFooter && !hideInSignUp && !removeHeader && !removeFooter && <Footer/> }


    




    </div>
  )
}

export default App