
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import '../assets/Css/Header.css'
import { Context } from '../Context/CreateContext'
import { HashLink } from 'react-router-hash-link'
import { HiBars3CenterLeft } from "react-icons/hi2"
import { RxCross2 } from "react-icons/rx";
import GoogleTranslate from './GoogleTranslate'
import logo from '../assets/Image/logo/my-inner-side1.png'
import { FaCircleUser } from "react-icons/fa6";
import { MdLogin } from "react-icons/md";
import { HiUsers } from "react-icons/hi2";
import { CgLogOut } from "react-icons/cg";



const Header = () => {

  const [showDropdown, setShowDropdown] = useState(true)

  const { setShowAppointmentForm ,token, setToken} = useContext(Context);

  const [menuOpen, setMenuOpen] = useState(false)
  const toggleMenu = () => setMenuOpen(prev => !prev)
  const closeMenu = () => setMenuOpen(false)



  // const handleLanguageChange = (e) => {
  //   const lang = e.target.value;
  //   const select = document.querySelector('.goog-te-combo');
  //   if (select) {
  //     select.value = lang;
  //     select.dispatchEvent(new Event('change'));
  //   }
  // };


  return (
    <div className='header_section'>
      <div className="container">
        <header>
          <div className="logo">
            <Link to='/'>
              <img src={logo} width='141px' alt="logo" />
            </Link>
          </div>

          <div className='menu_links'>
            <nav className={`nav_links  ${menuOpen ? 'open' : ''}`} >

              <div className={`remove_icon`}>
                <h2>Menu</h2>
                <RxCross2 className='cross_links' size={25} onClick={closeMenu} />
              </div>

              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <HashLink smooth to="/about-us" onClick={closeMenu}>About Us</HashLink>
                </li>
                <li>
                  <HashLink smooth to="/#service" onClick={closeMenu} >Service</HashLink>
                </li>
                <li>
                  <HashLink smooth to='/life-coach' onClick={closeMenu}> Life Coach  </HashLink>
                </li>
                <li>
                  <Link to="/contact-us" onClick={closeMenu} >Contact Us </Link>
                </li>
                <li>
                  {/* <select onChange={handleLanguageChange}>
                    <option value="">Choose Language</option>
                    <option value="hi">हिंदी</option>
                    <option value="en">English</option>
                  </select> */}
                  <GoogleTranslate />
                </li>

              </ul>
            </nav>

            <div className="user_profile">
              <FaCircleUser size="25px" />
              <div className="user_lists">
      <ul>
        {token ? (
          <>
            <li>
              <Link to="/my-profile">
                <HiUsers className="icon" /> My Profile
              </Link>
            </li>
            <li
              onClick={() => {
                localStorage.removeItem('token');
                setToken('');
              }}
            >
              <Link to="/login">
                <CgLogOut className="icon" /> Logout
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">
              <MdLogin className="icon" /> Login
            </Link>
          </li>
        )}
      </ul>
    </div>
            </div>
            <button className='common-btn' onClick={() => setShowAppointmentForm(true)}>
              <Link to='#'>Book Appointment</Link>
            </button>

            <div className='menubar' onClick={toggleMenu}>
              <HiBars3CenterLeft size={30} />
            </div>
          </div>



        </header>
      </div>
      {menuOpen && <div className="menu_overlay" onClick={closeMenu}></div>}

    </div>
  )
}

export default Header





// //
// import { useContext, useState } from 'react'
// import { Link } from 'react-router-dom'
// import '../assets/Css/Header.css'
// import { Context } from '../Context/CreateContext'
// import { HashLink } from 'react-router-hash-link'
// import { HiBars3CenterLeft } from "react-icons/hi2"
// import { RxCross2 } from "react-icons/rx"
// import logo from '../assets/Image/logo/my-inner-side1.png'
// import { FaCircleUser } from "react-icons/fa6"
// import { MdLogin } from "react-icons/md"
// import { HiUsers } from "react-icons/hi2"
// import { CgLogOut } from "react-icons/cg"

// const Header = () => {
//   const [showDropdown, setShowDropdown] = useState(true)
//   const { setShowAppointmentForm } = useContext(Context)
//   const [menuOpen, setMenuOpen] = useState(false)

//   const toggleMenu = () => setMenuOpen(prev => !prev)
//   const closeMenu = () => setMenuOpen(false)

//   // Google Translate language change handler
//   const handleLanguageChange = (e) => {
//     const lang = e.target.value;
//     const select = document.querySelector('.goog-te-combo');
//     if (select) {
//       select.value = lang;
//       select.dispatchEvent(new Event('change'));
//     } else {
//       // If not loaded yet, retry after a short delay
//       setTimeout(() => handleLanguageChange(e), 500);
//     }
//   };

//   return (
//     <div className='header_section'>
//       <div className="container">
//         <header>
//           <div className="logo">
//             <Link to='/'><img src={logo} width='141px' alt="logo" /></Link>
//           </div>

//           <div className='menu_links'>
//             <nav className={`nav_links ${menuOpen ? 'open' : ''}`}>
//               <div className={`remove_icon`}>
//                 <h2>Menu</h2>
//                 <RxCross2 className='cross_links' size={25} onClick={closeMenu} />
//               </div>

//               <ul>
//                 <li><Link to="/">Home</Link></li>
//                 <li><HashLink smooth to="/about-us" onClick={closeMenu}>About Us</HashLink></li>
//                 <li><HashLink smooth to="/#service" onClick={closeMenu}>Service</HashLink></li>
//                 <li><HashLink smooth to='/#our-client' onClick={closeMenu}>Our Clients</HashLink></li>
//                 <li><Link to="/contact-us" onClick={closeMenu}>Contact Us</Link></li>
//                 <li>
//                   <select onChange={handleLanguageChange} defaultValue="">
//         <option value="" disabled>Choose Language</option>
//         <option value="en">English</option>
//         <option value="hi">हिंदी</option>
//       </select>
//                 </li>
//               </ul>
//             </nav>

//             {/* User profile dropdown */}
//             <div className="user_profile">
//               <FaCircleUser size="25px" />
//               <div className="user_lists">
//                 <ul>
//                   {!showDropdown ? (
//                     <li><Link to='/login'><MdLogin className='icon' /> Login</Link></li>
//                   ) : (
//                     <>
//                       <li><Link to='/my-profile'><HiUsers className='icon' /> My Profile</Link></li>
//                       <li onClick={() => setShowDropdown(false)}><Link><CgLogOut className='icon' /> Logout</Link></li>
//                     </>
//                   )}
//                 </ul>
//               </div>
//             </div>

//             <button className='common-btn' onClick={() => setShowAppointmentForm(true)}>
//               <Link to='#'>Book Appointment</Link>
//             </button>

//             <div className='menubar' onClick={toggleMenu}>
//               <HiBars3CenterLeft size={30} />
//             </div>
//           </div>
//         </header>
//       </div>

//       {menuOpen && <div className="menu_overlay" onClick={closeMenu}></div>}
//     </div>
//   )
// }

// export default Header
