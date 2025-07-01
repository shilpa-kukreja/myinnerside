

 
 
 import banner from '../assets/mainbanner/banner.jpeg'
 import '../assets/Css/Service.css'
 const  TermCondition = () => {
   return (
 
     <>
       <div>
         <img src={banner} width="100%" alt="banner" />
       </div>
 
       <div className='privacy_content_section'>
 
 
         <div className="container">
 
           <h2> Terms and Condition </h2>
 
           <p>
             Restricted Topics for discussion:
           </p>
 
           
 
        
           <ul>
             <li>
              Sex Related Discussion for Fun.
             </li>
             <li>
               Anti-National Topics.
             </li>
             <li>
              Criminal Cases.
             </li>
            
           </ul>
           
           <p>
            Profanity and wrong behavior will lead to Immediate Termination of the Session.
           </p>
          
           <p>
           If Saarthi(Person who is taking the session) , feels uncomfortable on live session, any sort of indecency in particular, He or She is free to turn the video off.

           </p>
           <p>
            Screen recording of session or taking screenshots of the Saarthi is strictly prohibited. Doing so can lead to Legal Action.

           </p>
           
          <p>
            All disputes are subject to Delhi Jurisdiction. 
          </p>
           
         </div>
       </div>
     </>
   )
 }
 
 export default  TermCondition;