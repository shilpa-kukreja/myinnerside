
import React from 'react'
import Slider from './Slider'
import CommonPoints from './CommonPoints'
import Testimonials from './Testimonials'
import Service from './Service'
import banner from '../assets/mainbanner/frequentlyquestion.jpg'

 import Faq from './Faq'

// import PrivacyPolicy from './PrivacyPolicy'
const Home = () => {
  return (
    <div className=''>

       <Slider />

       <CommonPoints/>
      
       <Service/>

        <Testimonials/>

       <div className="container home_page_banner" >
             <img src={banner} width="100%"    style={{ borderRadius:'15px', margin:'20px 0 0 0 '}} alt="banner-Img" />
       </div>     

       <Faq />

       



       </div>
  )
}

export default Home