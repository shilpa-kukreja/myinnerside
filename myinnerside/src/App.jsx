


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
 import { useLocation } from 'react-router-dom'
 import Signup from './Componant/Signup'
 import MyProfile from './Componant/MyProfile'
 import { ToastContainer } from 'react-toastify'
 import CancellationPolicy from './Componant/CancellationPolicy'
import LifeCoach from './Componant/LifeCoach'
import VideoCall from './Componant/VideoCall'


const App = () => {
  
   
 
   
    

    const { showAppointmentForm } = useContext(Context);
    const location = useLocation();
    const hideHeaderFooter =   location.pathname === '/login' 
    const hideInSignUp =   location.pathname === '/sign-up' 
    const removeheader = location.pathname === '/video-call' 

    const hidePopUp =location.pathname === '/login'
    const hidePopOnMyProfile =location.pathname === '/my-profile'
    const hidePopOnVideo =location.pathname === '/video-call'
     



  return (
    <div>

     <ToastContainer />
      <ScrollToTop />
     
      { !hideHeaderFooter  && !hideInSignUp && !removeheader &&  <Header /> }

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
        <Route  path="/contact-us" element={<Contact/>} />
        <Route path='/about-us' element={<About/>} />
        <Route path='/term-condition' element={<TermCondition/>} />
        <Route path='/login' element={    <Login/>} />
        <Route path='/sign-up' element={<Signup/>} />
        <Route path='/my-profile' element={<MyProfile/>} />
        <Route  path ='/cancellation-policy' element={<CancellationPolicy />} />
        <Route  path='/life-coach' element={<LifeCoach />} />
        <Route  path='/video-call/:id' element={<VideoCall />} />
        
      </Routes>



    {showAppointmentForm && <BookAppoinment />}
   { !hidePopUp && !hidePopOnMyProfile && !hidePopOnVideo &&   < PopUp />}
 

{!hideHeaderFooter && !hideInSignUp && !removeheader && <Footer/> }


    




    </div>
  )
}

export default App