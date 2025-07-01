
import '../assets/Css/Footer.css';
import { FaHeart } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { HashLink } from 'react-router-hash-link';

// import logo from '../assets/Image/logo/my-inner-side.jpeg'
import logo from '../assets/Image/logo/my-inner-side1.png'
const Footer = () => {

  return (
    <div className='footer_section'>
      <div className="container">
        <div className="footer_widget">
          <div className="footer_links">
            <Link to='/'> <img src={logo} width='150px' alt="img" /></Link>
            <p>
              A secure, judgment-free space where men can talk openly, connect emotionally, and feel truly heard — anytime, anywhere.
            </p>
          </div>
          <div className="footer_links">
            <h4> Quick Links</h4>
            <div>
              <ul>
                <li>
                  <Link to='/'>Home</Link>
              
                </li>
                <li>
                  <Link to='/about-us'>About Us</Link>
                </li>
                <li>
                  {/* <Link to='/#service'>Our Service</Link> */}
                   <HashLink smooth to="/#service" > Our Service</HashLink>
                </li>
                <li>
                   <HashLink smooth to="/#our-client" > Our Client</HashLink>
                </li>
                 <li><Link to='contact-us'>Contact Us</Link></li>
               
              
              </ul>
            </div>
          </div>

          <div className="footer_links">
            <h4>Useful Links </h4>

             <ul>
                <li>
                  <Link to='/privacy-policy'>Privacy Policy</Link>
                </li>
                 <li>
                  <Link to="/term-condition"> Terms and Condition</Link>
                </li>
                <li>
                  <Link to="/cancellation-policy">Cancellation Policy</Link>
                </li>
                 <li>
                  <HashLink smooth to='/#faq'>Faqs</HashLink>
                </li>
                <li> <Link to='/login'>Login</Link></li>
               
             </ul>
            
          </div>

          <div className="footer_links">
            <h4>Contact Us</h4>

            <ul>
              <li> <FaPhoneAlt className='icon' /> <Link href="tel:+91 000000000">+91 00000000</Link></li>
              <li> <MdOutlineMailOutline className='icon' /> <Link href="mailto:info@gmail.com">info@gmail.com</Link> </li>
            </ul>

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
        </div>
        <div className='copyright_section'>
             <p>
              Copyright &copy; MyInnerSide. All Right Reserved.
             </p>
        </div>
      </div>
    </div>
  )
}

export default Footer