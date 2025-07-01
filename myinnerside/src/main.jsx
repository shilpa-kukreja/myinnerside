
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import CreateContextProvider from './Context/CreateContext.jsx'
import { VideoCallProvider } from './Context/VideoCallContext.jsx'
createRoot(document.getElementById('root')).render(

  <BrowserRouter>
  <VideoCallProvider>
        <CreateContextProvider>
          
               <App />
           
        </CreateContextProvider>
          </VideoCallProvider>
  </BrowserRouter>
  
)
