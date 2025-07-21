import React, { useContext } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext'
import { TeamContext } from './context/TeamContext'

import Login from './pages/Login';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import { Route, Routes } from 'react-router-dom';
import AddTeam from './pages/admin/AddTeam';
import ListTeam from './pages/admin/ListTeam';
import AdminContacts from './pages/admin/AdminContacts';
import AdminAppointments from './pages/admin/AdminAppointments';
import LifeCoachAppointmentlist from './pages/admin/LifeCoachAppointmentlist';
import AdminUsers from './pages/admin/AdminUsers';
import AddCoupon from './pages/admin/AddCoupon';
import ListCoupon from './pages/admin/ListCoupon';
import TeamMemberAppointments from './pages/team/TeamMemberAppointments';
import ManageSlots from './pages/admin/ManageSlots';
import AdminDashboard from './pages/admin/AdminDashboard';
import VideoCall from './pages/team/VideoCall';
import AdminCouponClaims from './pages/admin/AdminCouponClaims';
import { useLocation, matchPath } from 'react-router-dom'

const App = () => {
  const { aToken } = useContext(AdminContext)
  const { tToken } = useContext(TeamContext)


  const location = useLocation();
    const isVideoCallRoute = matchPath('/video-call/:id', location.pathname);

     const removeHeader = isVideoCallRoute;
   
  return aToken || tToken ? (
    <div>
      <ToastContainer />
       
       {!removeHeader && <Navbar />}
      <div className='flex items-start'>
       {!removeHeader && <Sidebar />}
        {/*---Admin Routes----- */}
        <Routes>
          <Route path="/admin/add" element={<AddTeam />} />
          <Route path="/admin/list" element={<ListTeam />} />
          <Route path="/admin/listcontact" element={<AdminContacts />} />
          <Route path="/admin/listappointment" element={<AdminAppointments />} />
          <Route path="/admin/lifecoach" element={<LifeCoachAppointmentlist />} />
          <Route path="/admin/user" element={<AdminUsers />} />
          <Route path="/admin/addcoupon" element={<AddCoupon />} />
          <Route path="/admin/listcoupon" element={<ListCoupon />} />
          <Route path="/admin/manageslot" element={<ManageSlots />} />
          <Route path="/admin/" element={<AdminDashboard/>} />
          <Route path='/admin/admincouponclaim' element={<AdminCouponClaims/>} />
     

        {/*---Team Routes----- */}
        
          <Route
            path="/team/appointments"
            element={
            
                <TeamMemberAppointments />
             
            }
          />
          
          <Route  path='/video-call/:id' element={<VideoCall/>} />

        </Routes>
      </div>


    </div>
  ) : (
    <>

      <Login />
      <ToastContainer />

    </>
  )
}

export default App
