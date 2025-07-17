import React from 'react'
import CommonHeading from './CommonHeading'

import { Swiper, SwiperSlide } from 'swiper/react'



 import icon1 from '../assets/Image/icon/icon1.png'
  import  call from '../assets/Image/icon/calls-completed.png'
 import daily from '../assets/Image/icon/daily-callers.png'
 import happy from '../assets/Image/icon/happy-users.png'
 import slot from '../assets/Image/icon/slot-booked.png'
 import top from '../assets/Image/icon/top-rated.png'

 
import 'swiper/css'

import '../assets/Css/Header.css'


const CommonPoints = () => {
    const points = [
        {
            icon: daily ,
            title: '100',
            subtitle: 'Daily Callers',
        },
        {
            icon: slot ,
            title: '8000',
            subtitle: 'Slots Booked',
        },
        {
            icon: call ,
            title: '7500',
            subtitle: 'Calls  Completed',
        },
        {
           icon: happy ,
            title: '1000+',
            subtitle: 'Happy Users',
        },
        {
             icon: top ,
            title: '4.5+',
            subtitle: 'India’s Top Rated Calling web',
        },
      
    ]

    return (

         <div className="points_section">

        <div className='container'>

            <CommonHeading title="Your Journey to Connection" />

            <div className="my-10">
                <Swiper
                    spaceBetween={20}
                    slidesPerView={5}
                    loop
                   breakpoints={{
                   1024: { slidesPerView:5 },
                   768: { slidesPerView: 4 },
                   640: { slidesPerView: 3 },
                   320: { slidesPerView: 2 },
          }}>
                    {points.map((item, id) => (
                        <SwiperSlide key={id}>
                            <div className="points_icon">
                                <div className='icon_img'>
                                     {item.icon && <img src={item.icon}  alt={item.title} />}
                                </div>
                                <h4 className='title'>{item.title}</h4>
                                <p className='subtitle'>{item.subtitle}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
             </div>
    )
}

export default CommonPoints
