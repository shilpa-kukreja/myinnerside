import React, { useContext } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext'
import { TeamContext } from './context/TeamContext'

import Login from './pages/login';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import { Route, Routes } from 'react-router-dom';
import AddTeam from './pages/admin/AddTeam';
import ListTeam from './pages/admin/ListTeam';
import AdminContacts from './pages/admin/AdminContacts';
import AdminAppointments from './pages/admin/AdminAppointments';
import LifeCoachAppointmentlist from './pages/admin/lifeCoachAppointmentlist';
import AdminUsers from './pages/admin/AdminUsers';
import AddCoupon from './pages/admin/AddCoupon';
import ListCoupon from './pages/admin/ListCoupon';
import TeamMemberAppointments from './pages/team/TeamMemberAppointments';
import ManageSlots from './pages/admin/ManageSlots';
import AdminDashboard from './pages/admin/AdminDashboard';
import VideoCall from './pages/team/VideoCall';

const App = () => {
  const { aToken } = useContext(AdminContext)
  const { tToken } = useContext(TeamContext)
  return aToken || tToken ? (
    <div>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        {/*---Admin Routes----- */}
        <Routes>
          <Route path="/add" element={<AddTeam />} />
          <Route path="/list" element={<ListTeam />} />
          <Route path="/listcontact" element={<AdminContacts />} />
          <Route path="/listappointment" element={<AdminAppointments />} />
          <Route path="/lifecoach" element={<LifeCoachAppointmentlist />} />
          <Route path="/user" element={<AdminUsers />} />
          <Route path="/addcoupon" element={<AddCoupon />} />
          <Route path="/listcoupon" element={<ListCoupon />} />
          <Route path="/manageslot" element={<ManageSlots />} />
          <Route path="/" element={<AdminDashboard/>} />
     

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
