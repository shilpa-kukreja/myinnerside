import React from 'react'
import CommonHeading from './CommonHeading'

import { Swiper, SwiperSlide } from 'swiper/react'



 import icon1 from '../assets/Image/icon/icon1.png'
import banner1 from '../assets/mainbanner/connectionimg1.png'
import banner2 from '../assets/mainbanner/connectionimg2.png'
import banner3 from '../assets/mainbanner/connectionimg4.png'
import banner4 from '../assets/mainbanner/connectionimg3.png'
import banner5 from '../assets/mainbanner/connectionimg5.png'

 
import 'swiper/css'

import '../assets/Css/Header.css'


const CommonPoints = () => {
    const points = [
        {
            icon: banner1, 
            title: '100',
            subtitle: 'Daily Callers',
        },
        {
            icon: banner2, 
            title: '8000',
            subtitle: 'Slots Booked',
        },
        {
            icon: banner4,
            title: '7500',
            subtitle: 'Calls  Completed',
        },
        {
           icon: banner3,
            title: '1000+',
            subtitle: 'Happy Users',
        },
        {
             icon: banner5,
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
