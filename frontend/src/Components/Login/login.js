import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import './Login.css';

const Login = () => {
    const [loginField, setLoginField] = useState({ "userName": "", "password": "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState({ userName: false, password: false });
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!loginField.userName || !loginField.password) {
            toast.error("Please fill all fields");
            return;
        }
        
        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/auth/login`, 
                loginField, 
                { withCredentials: true }
            );
            
            localStorage.setItem('gymName', response.data.gym.gymName);
            localStorage.setItem('gymPic', response.data.gym.profilePic);
            localStorage.setItem('isLogin', true);
            localStorage.setItem('token', response.data.token);

            toast.success("Login successful! Redirecting...");
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Login failed. Please check your credentials.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (event, name) => {
        setLoginField({ ...loginField, [name]: event.target.value });
    }

    const handleFocus = (field) => {
        setIsFocused({ ...isFocused, [field]: true });
    }

    const handleBlur = (field) => {
        setIsFocused({ ...isFocused, [field]: false });
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="floating-dumbbell">💪</div>
                <div className="floating-weight">🏋️</div>
                <div className="floating-gym">🔥</div>
            </div>
            
            <div className="login-card">
                <div className="login-header">
                    <div className="logo-container">
                        <FitnessCenterIcon className="logo-icon" />
                        <h1 className="logo-text">Gym World</h1>
                    </div>
                    <p className="login-subtitle">Transform your body, transform your life</p>
                </div>

                <div className="login-form">
                    <div className={`input-group ${isFocused.userName ? 'focused' : ''} ${loginField.userName ? 'has-value' : ''}`}>
                        <input 
                            value={loginField.userName} 
                            onChange={(event) => { handleChange(event, "userName") }} 
                            onFocus={() => handleFocus('userName')}
                            onBlur={() => handleBlur('userName')}
                            onKeyPress={handleKeyPress}
                            type="text" 
                            className="login-input" 
                            placeholder=" "
                        />
                        <label className="input-label">Username</label>
                        <span className="input-icon">👤</span>
                    </div>
                    
                    <div className={`input-group ${isFocused.password ? 'focused' : ''} ${loginField.password ? 'has-value' : ''}`}>
                        <input 
                            value={loginField.password} 
                            onChange={(event) => { handleChange(event, "password") }} 
                            onFocus={() => handleFocus('password')}
                            onBlur={() => handleBlur('password')}
                            onKeyPress={handleKeyPress}
                            type={showPassword ? "text" : "password"} 
                            className="login-input" 
                            placeholder=" "
                        />
                        <label className="input-label">Password</label>
                        <span className="input-icon">🔒</span>
                        <div className="password-toggle" onClick={togglePasswordVisibility}>
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </div>
                    </div>
                    
                    <button 
                        className={`login-button ${loading ? 'loading' : ''}`}
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        <span className="button-text">{loading ? "Logging in..." : "Login"}</span>
                        <div className="button-loader"></div>
                        <div className="button-arrow">→</div>
                    </button>

                    <div className="login-divider">
                        <span>Or</span>
                    </div>

                    <div className="forgot-password-link">
                        Forgot your password?
                    </div>
                </div>

                <div className="login-footer">
                    <p>Don't have an account? <span className="signup-link">Contact administrator</span></p>
                </div>
            </div>

            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    )
}

export default Login;