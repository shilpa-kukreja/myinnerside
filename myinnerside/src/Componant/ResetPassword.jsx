import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/Css/AuthForms.css';
import { Link } from 'react-router-dom';
import { FaEyeSlash, FaEye,  } from 'react-icons/fa'






import prakritisaLogo from '../assets/Image/logo/my-inner-side1.png';
// import img1 from '../assets/Image/banner-img1.jpg';



const ResetPassword = () => {
    const { token } = useParams(); 
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`https://myinnerside.com/api/auth/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password reset successful');
                setTimeout(() => {
                    navigate('/login'); 
                }, 2000);
            } else {
                setMessage(data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Failed to reset password');
        }
    };

    return (
        // <div className='flex min-h-screen items-center justify-center bg-white p-6'>
        //   <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
        //     <h2 className='text-2xl font-bold text-center mb-6'>Reset Password</h2>
        //     <form onSubmit={handleSubmit} className='space-y-4'>
        //       <input
        //         className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700 placeholder-gray-500'
        //         type='password'
        //         placeholder='New Password'
        //         value={password}
        //         onChange={(e) => setPassword(e.target.value)}
        //         required
        //       />
        //       <input
        //         className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700 placeholder-gray-500'
        //         type='password'
        //         placeholder='Confirm New Password'
        //         value={confirmPassword}
        //         onChange={(e) => setConfirmPassword(e.target.value)}
        //         required
        //       />
        //       <button
        //         type='submit'
        //         className='w-full bg-[#743B32] text-white py-2 rounded-lg text-lg font-semibold hover:bg-[#5a2a25] transition'
        //       >
        //         Reset Password
        //       </button>
        //     </form>
        //     {message && <p className='text-center mt-4'>{message}</p>}
        //   </div>
        // </div>

        <div className='signin_Cont'>
            <div className="signin_cont_left">
                <div className="signin_inner_cont">
                    <Link to='/'>
                        <img src={prakritisaLogo} alt="logo" width='110px' />
                    </Link>
                    <div className="login_title">Reset Password</div>


                    <form onSubmit={handleSubmit}>
                        <div className="form_group w-100 password-group">
                            <input className='form_control'
                                type={showPassword ? 'text' : 'password'}
                                placeholder='New Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <div className="form_group w-100 password-group">
                            <input className='form_control'
                                 type={showPassword ? 'text' : 'password'}
                                placeholder='Confirm New Password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <span onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                                {showPassword ? <FaEyeSlash /> : <FaEye />} 
                                </span>
                        </div>
                        <button type="submit">Reset Password</button>
                        {message && <p className='text-center mt-4'>{message}</p>}

                    </form>



                </div>
            </div>

            <div className="signin_cont_right">
                <img src={img1} alt="img" />
            </div>
        </div>




    );
};

export default ResetPassword;