import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AdminContextProvider from './context/AdminContext.jsx'
import TeamContextProvider from './context/TeamContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { VideoCallProvider } from './context/VideoCallContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <VideoCallProvider>
  <AdminContextProvider>
    <TeamContextProvider>
    <App />
    </TeamContextProvider>
  </AdminContextProvider>
  </VideoCallProvider>
  </BrowserRouter>,
)
