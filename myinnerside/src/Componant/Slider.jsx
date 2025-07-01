
import React from 'react'


import banner1 from '../assets/mainbanner/banner1.jpeg'
import banner2 from '../assets/mainbanner/banner2.jpeg'
import '../assets/Css/Header.css'


import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // core Swiper styles
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Pagination, Navigation, Autoplay } from 'swiper/modules'

const Slider = () => {
  return (
    <div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        className='banner_slider'
      >


        <SwiperSlide>
          <img src={banner1} width="100%" alt="myinnerSide-banner" />
        </SwiperSlide>

        <SwiperSlide>
          <img src={banner2} width="100%" alt="myinnerSide-banner" />
        </SwiperSlide>
      </Swiper>
      




    </div>
  )
}

export default Slider