import React from 'react'
import CommonHeading from './CommonHeading'

import { Swiper, SwiperSlide } from 'swiper/react'


import 'swiper/css'

import '../assets/Css/Header.css'


const CommonPoints = () => {
    const points = [
        {
            icon: 'https://www.yesmadam.com/_next/image?url=https%3A%2F%2Fcdn.yesmadam.com%2Fimages%2Flive%2Fwebsite%2Fimages%2Freact%2Fpublic-assets%2Fgirl.png&w=96&q=75',
            title: '3000+',
            subtitle: 'Daily Callers',
        },
        {
            icon: 'https://www.yesmadam.com/_next/image?url=https%3A%2F%2Fcdn.yesmadam.com%2Fimages%2Flive%2Fwebsite%2Fimages%2Freact%2Fpublic-assets%2Fgirl.png&w=96&q=75',
            title: '12K+',
            subtitle: 'Slots Booked',
        },
        {
            icon:'https://www.yesmadam.com/_next/image?url=https%3A%2F%2Fcdn.yesmadam.com%2Fimages%2Flive%2Fwebsite%2Fimages%2Freact%2Fpublic-assets%2Fgirl.png&w=96&q=75',
            title: '10k+',
            subtitle: 'Calls  Completed',
        },
        {
            icon:'https://www.yesmadam.com/_next/image?url=https%3A%2F%2Fcdn.yesmadam.com%2Fimages%2Flive%2Fwebsite%2Fimages%2Freact%2Fpublic-assets%2Fgirl.png&w=96&q=75',
            title: '1000+',
            subtitle: 'Happy Users',
        },
        {
            icon:'https://www.yesmadam.com/_next/image?url=https%3A%2F%2Fcdn.yesmadam.com%2Fimages%2Flive%2Fwebsite%2Fimages%2Freact%2Fpublic-assets%2Fgirl.png&w=96&q=75',
            title: '4.5+',
            subtitle: 'India’s Top Rated Calling web',
        },
        {
            icon:'https://www.yesmadam.com/_next/image?url=https%3A%2F%2Fcdn.yesmadam.com%2Fimages%2Flive%2Fwebsite%2Fimages%2Freact%2Fpublic-assets%2Fgirl.png&w=96&q=75',
            title: '25+',
            subtitle: 'Cities Covered',
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
                                     {item.icon && <img src={item.icon} width="50" alt={item.title} />}
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
