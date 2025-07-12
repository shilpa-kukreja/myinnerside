

import CommonHeading from './CommonHeading'
import servImg from '../assets/mainbanner/serviceweprovide.jpg'
import '../assets/Css/Service.css'
import { Link } from 'react-router-dom'
import { FaWhatsapp } from "react-icons/fa";
import { MdCall } from "react-icons/md";
 import { useContext } from 'react';
 import { Context } from '../Context/CreateContext';
const Service = () => {

    const { setShowAppointmentForm } = useContext(Context);
    return (
        <div className='service_section' id='service'>
            <div className="container">
                <CommonHeading title="Service We Provide" />
                <div className="service_box">
                    <div className="left_section"> 
                        <img src={servImg} width='100%'  alt="service_img" />
                    </div>
                    <div className='right_section'>
                        <h3> Heartfelt Listening, Real Human Connection</h3>
                        <p>
                           We offer one-on-one session consultations with certified professionals who truly listen. Share your thoughts, feelings, or life experiences in a safe, private space—judgment-free, supportive, and emotionally healing.
                        </p>
                        {/* <div className='calling_btn'>
                            <button className='whatsapp-btn'>
                                <Link to=""> <FaWhatsapp size={20} className='icon' /> Whatsapp Now!</Link>
                            </button>
                            <button className='call-btn'>
                                <Link to="tel:+91 00000000"> <MdCall size={20} className='icon' /> Call Now!</Link>
                            </button>
                        </div> */}
                        <div>
                                      <button className='common-btn' style={{ marginTop: '20px' }} onClick={() => setShowAppointmentForm(true)} >
                                        <Link> Book Appointment  </Link>
                                      </button>
                                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Service;