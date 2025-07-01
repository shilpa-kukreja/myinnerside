
import React from 'react'
import '../index.css'

const CommonHeading = ({title}) => {
  return (
    <div className='common_heading'>

         <div className="container">


             {/* <span className='common_subtitle'>{subtitle}</span> */}
                         
                         <h2 className='common_title'>{title}</h2>


         </div>
    </div>
  )
}

export default CommonHeading