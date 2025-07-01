 
  import banner from '../assets/mainbanner/banner.jpeg'
 import '../assets/Css/Service.css'
 
 const CancellationPolicy = () => {
   return (
     <>
     <div>
              <img src={banner} width="100%" alt="banner" />
            </div>
      
            <div className='privacy_content_section'>
      
      
              <div className="container">
      
                <h2> Our Cancellation Policy </h2>
                <p>
                 Session once booked cannot be cancelled until it’s a medical emergency. Medical documents will be needed in the provided scenario.
                </p>           
                
                <p>
                 Sessions can be rescheduled only once.
                </p>                
              </div>
            </div>
     </>
   )
 }
 
 export default CancellationPolicy