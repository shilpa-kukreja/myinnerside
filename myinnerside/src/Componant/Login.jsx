import { Link, useNavigate } from 'react-router-dom';
import '../assets/Css/AuthForm.css';
import { LuUserRound } from "react-icons/lu";
import { MdOutlineMailOutline, MdOutlineDateRange } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { TbPhoneCall } from "react-icons/tb";
import { FaRegEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import logo from '../assets/Image/logo/my-inner-side1.png';
import login2 from '../assets/mainbanner/login_img2.png';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect, useContext } from 'react';
import { Context } from '../Context/CreateContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const { token, setToken, setUserLoginData, userLoginData } = useContext(Context);
  const navigate = useNavigate();

  const [loginDetail, setLoginDetails] = useState({
    name: "",
    aliasName: "",
    email: '',
    contact: '',
    dob: null,
    gender: '',
    pass: '',
    confPass: ''
  });

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && loginDetail.pass !== loginDetail.confPass) {
      alert("Passwords do not match");
      return;
    }

    const url = isLogin ? '/api/auth/login' : '/api/auth/register';

    const body = isLogin
      ? { email: loginDetail.email, password: loginDetail.pass }
      : {
          name: loginDetail.name,
          aliasName: loginDetail.aliasName,
          email: loginDetail.email,
          contact: loginDetail.contact,
          dob: loginDetail.dob,
          gender: loginDetail.gender,
          password: loginDetail.pass
        };

    try {
      const response = await fetch(`http://localhost:5000${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUserLoginData(data.user);
 
        
        localStorage.setItem('token', data.token);
        alert(isLogin ? 'Login successful' : 'Registration successful');
        navigate('/');
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server Error');
    }
  };


  

  const handleForgotPassword = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginDetail.email }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <div className='login_container'>
      <div className="container">
        <div className="login_section">
          <div className={`col-half ${isLogin ? 'right' : 'left'}`}>
            <div className="login_contant">
              <Link to="/"><img src={logo} alt="logo" width='141px' /></Link>
              <h2>{isForgot ? 'Forgot Your Password' : isLogin ? 'Login to Your Account' : 'Sign Up For Free'}</h2>
              
              <div className="new_user">
                {isForgot ? (
                  <p>Back to <span onClick={() => setIsForgot(false)}>Login</span></p>
                ) : isLogin ? (
                  <p>Don't have an Account <span onClick={() => setIsLogin(false)}> SignUp</span></p>
                ) : (
                  <p>Already have an <span onClick={() => setIsLogin(true)}>Login</span></p>
                )}
              </div>

              <div className="login_form">
                {isForgot ? (
                  <form onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }}>
                    <div className="form_group">
                      <label>Email</label>
                      <input type="email" name='email' value={loginDetail.email} onChange={handleChange} className='form_control' required />
                      <MdOutlineMailOutline className="icon" />
                    </div>
                    <button type='submit' className='login_btn w-100'>Send Reset Link</button>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {!isLogin && (
                      <>
                        <div className="form_group">
                          <label>Name</label>
                          <input type="text" name='name' value={loginDetail.name} onChange={handleChange} className='form_control' required />
                          <LuUserRound className='icon' />
                        </div>

                        <div className="form_group">
                          <label>Alias Name</label>
                          <input type="text" name='aliasName' value={loginDetail.aliasName} onChange={handleChange} className='form_control' required />
                          <LuUserRound className='icon' />
                        </div>

                        <div className="form_group">
                          <label>Contact</label>
                          <input type="tel" name='contact' pattern="\d{10}" maxLength="10" value={loginDetail.contact} onChange={handleChange} className='form_control' />
                          <TbPhoneCall className='icon' />
                        </div>

                        <div className="form_group">
                          <label>D.O.B</label>
                          <div className="datepicker_wrapper">
                            <DatePicker
                              selected={loginDetail.dob}
                              onChange={(date) => setLoginDetails(prev => ({ ...prev, dob: date }))}
                              dateFormat="dd/MM/yyyy"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              maxDate={new Date()}
                              className="form_control"
                              required
                            />
                            <MdOutlineDateRange className="icon" />
                          </div>
                        </div>

                        <div className="form_group">
                          <label>Gender</label>
                          <select name="gender" className='form_control' value={loginDetail.gender} onChange={handleChange} required>
                            <option value="">Choose Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </>
                    )}

                    <div className="form_group">
                      <label>Email</label>
                      <input type="email" name='email' value={loginDetail.email} onChange={handleChange} className='form_control' required />
                      <MdOutlineMailOutline className='icon' />
                    </div>

                    <div className="form_group">
                      <label>Password</label>
                      <input type={showPassword ? 'text' : 'password'} name='pass' value={loginDetail.pass} onChange={handleChange} className='form_control' required />
                      <div className='icon' onClick={() => setShowPassword(prev => !prev)}>
                        {showPassword ? <FaRegEye /> : <IoMdEyeOff />}
                      </div>
                    </div>

                    {!isLogin && (
                      <div className="form_group">
                        <label>Confirm Password</label>
                        <input type={confirmPasswordVisible ? 'text' : 'password'} name='confPass' value={loginDetail.confPass} onChange={handleChange} className='form_control' required />
                        <div className="icon" onClick={() => setConfirmPasswordVisible(prev => !prev)}>
                          {confirmPasswordVisible ? <FaRegEye /> : <IoMdEyeOff />}
                        </div>
                      </div>
                    )}

                    {isLogin && (
                      <div className="forgot_password new_user">
                        <span onClick={() => setIsForgot(true)}>Forgot Password?</span>
                      </div>
                    )}

                    <button type='submit' className='login_btn w-100'>
                      {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          <div className={`col-half login_signup_img ${isLogin ? 'left' : 'right'}`}>
            <div className={`login_img ${isLogin ? 'signup_img' : 'login_img'}`}>
              <img src={login2} alt="login" width="100%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
