
import React from 'react'
import CommonHeading from './CommonHeading'
import { useContext } from 'react'
import { Context } from '../Context/CreateContext'
import banner from '../assets/mainbanner/abouttopbanner.png'
import '../assets/Css/Service.css'
import { Link } from 'react-router-dom'
import servImg from '../assets/mainbanner/aboutmyinnerside.jpg'
const About = () => {
  const { setShowAppointmentForm } = useContext(Context);
  return (
    < >
      <img src={banner} width="100%" alt="" />


      <div className="about_section">
        <div className="container">


          <CommonHeading title="About My Inner Side" />


          {/* <div className="about_info">

            <h4>
              
              My Inner Side was created to support those who feel alone and unheard. We connect individuals with certified professionals who offer compassionate listening through one-on-one calls. Our mission is to provide a safe, judgment-free space where emotions can be expressed freely. Every conversation is private, respectful, and rooted in empathy—because sometimes, just being heard can make all the difference.
            </h4>

            <div>
              <button className='common-btn' style={{ marginTop: '20px' }} onClick={() => setShowAppointmentForm(true)} >
                <Link> Book Appointment </Link>
              </button>
            </div>


          </div> */}
          <div className="about_myinnerside">
            <div className="col-half">
              <div className="aboutImg_myinnerside">
                <img src={servImg} alt="about-Img" />
              </div>

            </div>
            <div className="col-half">
              <div className="about_info">
                {/* <h4>

                  My Inner Side was created to support those who feel alone and unheard. We connect individuals with certified professionals who offer compassionate listening through one-on-one calls. Our mission is to provide a safe, judgment-free space where emotions can be expressed freely. Every conversation is private, respectful, and rooted in empathy—because sometimes, just being heard can make all the difference.
                </h4> */}

                {/* <h3>We are My Inner Side</h3> */}
                <p className='para'>
                  In everybody’s Life at certain point, time comes when person wants to talk to someone. Someone they don’t know. A person who doesn’t judge them as per his/her standards. Sometimes people want to talk to people they love or they are friends with. But in today’s world everybody is not very fortunate to have one or the one they can trust. Hence, we come into picture.
                </p>
                <p className='para'> My Inner Side, a service offered by Swarnim Bharat with an idea of giving that privacy to the customers where they feel comfortable to discuss what they are not able to discuss with the people they know personally. We provide sessions where they can vent their Heart Out. We keep details and sessions confidential to protect our client’s identity and emotions shared.</p>
                <p className='para'>
                  We refer our Executives as Saarthi.   <b>Saarthi means Companion Or someone who guides and leads you to your destination.</b> Our professionals are handpicked after a series of tests and are very well trained on emotional aspects. We only hire people with a Golden Heart because every emotion that comes along our clients brings in lots of responsibility on our shoulders.
                </p>

                <div>
                  <button className='common-btn' style={{ marginTop: '20px' }} onClick={() => setShowAppointmentForm(true)} >
                    <Link> Book Appointment </Link>
                  </button>
                </div>


              </div>


            </div>
          </div>



          {/* <div className="about_box_slide">



            <div className="mission_vision">

              <div className="col_left">
                <div className="content">
                  <h2>Our Mission </h2>
                  <p>
                  
                    Our mission is to provide a safe and supportive space where individuals can express their thoughts, emotions, and experiences without fear or judgment. Through heartfelt conversations with certified professionals, we aim to ease emotional burdens, reduce loneliness, and promote well-being by simply listening—because everyone deserves to be heard, understood, and valued in their most vulnerable moments.
                  </p>
                </div>
              </div>

              <div className="col_right">
                <img src={missionImg} width='100%' alt="img" />
              </div>

            </div>


            <div className="mission_vision">
              <div className="col_left">
                <img src={vision} width='100%' alt="img" />
              </div>

              <div className="col_right vision_text ">
                <div className="content">
                  <h2>Our Vision </h2>
                  <p>
                 
                    We envision a world where no one feels emotionally isolated or unheard. My Inner Side strives to become a trusted companion for those seeking connection, comfort, and clarity. By creating meaningful human interactions through thoughtful conversations, we aim to nurture emotional wellness and build a society that values empathy, mental health, and authentic, heart-centered support for every individual.
                  </p>
                </div>
              </div>
            </div>

   
            <div className="mission_vision">
              <div className="col_left">
                <div className="content">
                  <h2>Our Core Value </h2>
                  <p>
             
                    Compassion, confidentiality, and connection are the heart of our work. We believe in the power of listening with empathy, respecting every story shared, and holding space without judgment. Our certified professionals are committed to creating a trusting environment where individuals feel safe

                  </p>
                </div>
              </div>

              <div className="col_right">
                <img src={coreValue} width='100%' alt="img" />
              </div>





            </div>



          </div> */}
        </div>
      </div>
    </>
  )
}

export default About