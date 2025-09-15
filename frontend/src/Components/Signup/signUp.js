import React, { useState } from 'react'
import Model from '../Model/model'
import ForgotPassword from '../ForgotPassword/forgotPassword';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './signUp.css';


const SignUp = () => {
    const [forgotPassword, setForgotPassword] = useState(false);
    const [inputField, setInputField] = useState({ 
        gymName: "", 
        email: "", 
        userName: "", 
        password: "", 
        profilePic: "https://tse4.mm.bing.net/th/id/OIP.ZsD8mRj5lOvnbxnxpV8YEAHaFa?w=1000&h=732&rs=1&pid=ImgDetMain&o=7&rm=3" 
    });
    const [loaderImage, setLoaderImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState({
        email: false,
        gymName: false,
        userName: false,
        password: false
    });

    const handleClose = () => {
        setForgotPassword(prev => !prev);
    }

    const handleOnChange = (event, name) => {
        setInputField({ ...inputField, [name]: event.target.value });
    }

    const handleFocus = (field) => {
        setIsFocused({ ...isFocused, [field]: true });
    }

    const handleBlur = (field) => {
        setIsFocused({ ...isFocused, [field]: false });
    }

    const uploadImage = async (event) => {
        setLoaderImage(true);
        const files = event.target.files;
        if (!files || files.length === 0) {
            setLoaderImage(false);
            return;
        }
        
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'gym-management');

        try {
            const response = await axios.post("https://api.cloudinary.com/v1_1/dhfd882ms/image/upload", data);
            const imageUrl = response.data.url;
            setInputField({ ...inputField, profilePic: imageUrl });
            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.log(error);
            toast.error("Image upload failed");
        } finally {
            setLoaderImage(false);
        }
    }

    const handleRegister = async () => {
        // Validation
        if (!inputField.email || !inputField.gymName || !inputField.userName || !inputField.password) {
            toast.error("Please fill all fields");
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputField.email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        
        // Password strength validation
        if (inputField.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }
        
        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/auth/register`,
                inputField
            );
            const successMsg = response.data.message;
            toast.success(successMsg);
            
            // Clear form after successful registration
            setInputField({ 
                gymName: "", 
                email: "", 
                userName: "", 
                password: "", 
                profilePic: "https://tse4.mm.bing.net/th/id/OIP.ZsD8mRj5lOvnbxnxpV8YEAHaFa?w=1000&h=732&rs=1&pid=ImgDetMain&o=7&rm=3" 
            });
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Registration failed";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleRegister();
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-background">
                <div className="floating-dumbbell">💪</div>
                <div className="floating-weight">🏋️</div>
                <div className="floating-gym">🔥</div>
            </div>
            
            <div className="signup-card">
                <div className="signup-header">
                    <div className="logo-container">
                        <FitnessCenterIcon className="logo-icon" />
                        <h2 className="signup-title">Create Account</h2>
                    </div>
                    <p className="signup-subtitle">Join our fitness community</p>
                </div>

                <div className="signup-form">
                    <div className="input-row">
                        <div className={`input-group ${isFocused.email ? 'focused' : ''} ${inputField.email ? 'has-value' : ''}`}>
                            <input 
                                type="email" 
                                value={inputField.email} 
                                onChange={(event) => { handleOnChange(event, "email") }} 
                                onFocus={() => handleFocus('email')}
                                onBlur={() => handleBlur('email')}
                                onKeyPress={handleKeyPress}
                                className="signup-input" 
                                placeholder=" "
                            />
                            <label className="input-label">Email Address</label>
                            <span className="input-icon">📧</span>
                        </div>
                        
                        <div className={`input-group ${isFocused.gymName ? 'focused' : ''} ${inputField.gymName ? 'has-value' : ''}`}>
                            <input 
                                type="text" 
                                value={inputField.gymName} 
                                onChange={(event) => { handleOnChange(event, "gymName") }} 
                                onFocus={() => handleFocus('gymName')}
                                onBlur={() => handleBlur('gymName')}
                                onKeyPress={handleKeyPress}
                                className="signup-input" 
                                placeholder=" "
                            />
                            <label className="input-label">Gym Name</label>
                            <span className="input-icon">🏢</span>
                        </div>
                    </div>
                    
                    <div className="input-row">
                        <div className={`input-group ${isFocused.userName ? 'focused' : ''} ${inputField.userName ? 'has-value' : ''}`}>
                            <input 
                                type="text" 
                                value={inputField.userName} 
                                onChange={(event) => { handleOnChange(event, "userName") }} 
                                onFocus={() => handleFocus('userName')}
                                onBlur={() => handleBlur('userName')}
                                onKeyPress={handleKeyPress}
                                className="signup-input" 
                                placeholder=" "
                            />
                            <label className="input-label">Username</label>
                            <span className="input-icon">👤</span>
                        </div>
                        
                        <div className={`input-group ${isFocused.password ? 'focused' : ''} ${inputField.password ? 'has-value' : ''}`}>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={inputField.password} 
                                onChange={(event) => { handleOnChange(event, "password") }} 
                                onFocus={() => handleFocus('password')}
                                onBlur={() => handleBlur('password')}
                                onKeyPress={handleKeyPress}
                                className="signup-input" 
                                placeholder=" "
                            />
                            <label className="input-label">Password</label>
                            <span className="input-icon">🔒</span>
                            <div className="password-toggle" onClick={togglePasswordVisibility}>
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </div>
                        </div>
                    </div>
                    
                    <div className="file-upload-container">
                        <label htmlFor="file-upload" className="file-upload-label">
                            <CloudUploadIcon className="upload-icon" />
                            <span>Upload Gym Image</span>
                        </label>
                        <input 
                            id="file-upload"
                            type="file" 
                            onChange={uploadImage} 
                            className="file-upload-input"
                            accept="image/*"
                        />
                        
                        {loaderImage && (
                            <div className="upload-progress">
                                <div className="progress-bar">
                                    <div className="progress-fill"></div>
                                </div>
                                <span>Uploading...</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="image-preview">
                        <img src={inputField.profilePic} alt="Gym preview" className="preview-image" />
                        <div className="image-overlay">Preview</div>
                    </div>

                    <button 
                        className={`signup-button ${loading ? 'loading' : ''}`}
                        onClick={handleRegister}
                        disabled={loading}
                    >
                        <span className="button-text">{loading ? "Creating Account..." : "Create Account"}</span>
                        <div className="button-loader"></div>
                        <div className="button-check">✓</div>
                    </button>

                    <div className="forgot-password-link" onClick={handleClose}>
                        Forgot Password?
                    </div>
                </div>
            </div>

            {forgotPassword && <Model header="Forgot Password" handleClose={handleClose} content={<ForgotPassword />} />}

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

export default SignUp;