
import { useContext } from 'react';
import '../assets/Css/Service.css'
import CommonHeading from './CommonHeading';
import { FaHeart } from "react-icons/fa";
import { Context } from '../Context/CreateContext';
import { FaFacebook } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { IoStar } from "react-icons/io5";
import { useRef } from 'react';


import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css'
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Autoplay } from 'swiper/modules'



const Testimonials = () => {
    const swiperRef = useRef(null);
    const { Testimonials } = useContext(Context)
    

    return (
        <div className='testimonial_section' id='our-client'>
            <div className="container">

                <CommonHeading title="Our Trusted Clients" />


                <div className="testimonial_slide">

                    <div className="testimonial_left">

                        <h2>Love from our customers</h2>
                        {/* <span>2K  reviews</span> */}
                        <span></span>
                        <div className="social_icon">
                            <p>
                                Let's Get Social  <FaHeart color='red' />
                            </p>
                            <ul>
                                <li><Link><FaFacebook /></Link></li>
                                <li><Link><FaInstagram /></Link></li>
                                <li><Link><FaSquareXTwitter /></Link></li>
                                <li><Link><FaLinkedin /></Link></li>
                            </ul>
                        </div>
                    </div>



                    <div className="testimonial_right">
                        <div
                            onMouseEnter={() => swiperRef.current?.autoplay.stop()}
                            onMouseLeave={() => swiperRef.current?.autoplay.start()}
                        >
                            <Swiper
                                modules={[Navigation, Autoplay]}
                                spaceBetween={10}
                                slidesPerView={1.5}
                                centeredSlides={true}
                                navigation
                                autoplay={{ delay: 3000, disableOnInteraction: false }}
                                loop
                                onSwiper={(swiper) => (swiperRef.current = swiper)}
                                className="testimonial-swiper"
                                breakpoints={{
                                    320: {
                                        slidesPerView: 1,
                                    },
                                    640: {
                                        slidesPerView: 1,
                                    },
                                    768: {
                                        slidesPerView: 1.5,
                                    },
                                    1024: {
                                        slidesPerView: 1.5,
                                    },
                                }}


                            >
                                {Testimonials.map((item, id) => (
                                    <SwiperSlide key={id}>
                                        <div className="testimonial_card">
                                            <img src={item.userImg} width="120px" alt={item.userName} />

                                            <div className="rating">
                                                <IoStar /> <IoStar /> <IoStar /> <IoStar /> <IoStar />
                                            </div>

                                            <h3>{item.userName}</h3>
                                            <p>{item.title}</p>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>





                </div>







            </div>
        </div>
    )
}

export default Testimonials