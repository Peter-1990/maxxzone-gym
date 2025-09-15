import React, { useState } from 'react'
import Loader from '../Loader/loader';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const ForgotPassword = () => {

    const [emailSubmit, setEmailSubmit] = useState(false);
    const [otpValidate, setOtpValidate] = useState(false);
    const [loader, setLoader] = useState(false);
    const [contentValue, setContentValue] = useState("Submit Your Email")
    const [inputField, setInputField] = useState({ email: "", otp: "", newPassword: "" });

    const handleSubmit = () => {
        if (!emailSubmit) {
            //setEmailSubmit(true)
            //setContentValue("Submit Your OTP")
            sendOtp();
        } else if (emailSubmit && !otpValidate) {
            //setOtpValidate(true)
            //setContentValue("Submit Your New Password")
            verifyOtp();
        } else {
            changePassword();
        }
    }

    const changePassword = async () => {
        setLoader(true)
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/reset-password`, { email: inputField.email, newPassword: inputField.newPassword }).then((response) => {
            toast.success(response.data.message);
            setLoader(false)
        }).catch(err => {
            toast.error("Some issues in sending Mail")
            console.log(err);
            setLoader(false)

        })
    }

    const verifyOtp = async () => {
        setLoader(true);
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/reset-password/checkOtp`, { email: inputField.email, otp: inputField.otp }).then((response) => {
            setOtpValidate(true)
            setContentValue("Submit Your New Password")
            toast.success(response.data.message);
            setLoader(false)
        }).catch(err => {
            toast.error("Some issues in sending Mail")
            console.log(err);
            setLoader(false)

        })
    }

    const sendOtp = async () => {
        setLoader(true);
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/reset-password/sendOtp`, { email: inputField.email }).then((response) => {
            setEmailSubmit(true)
            setContentValue("Submit Your OTP")
            toast.success(response.data.message);
            setLoader(false)
        }).catch(err => {
            toast.error("Some issues in sending Mail")
            console.log(err);
            setLoader(false)

        })
    }

    const handleOnChange = (event, name) => {
        setInputField({...inputField,[name]:event.target.value})
    }
    
    console.log(inputField)

    return (
        <div className='w-full'>
            <div className='w-full mb-5'>
                <div>Enter Your Email</div>
                <input type="text" value={inputField.email} onChange={(event)=>{handleOnChange(event,"email")}} className='w-1/2 border-2 border-slate-400 p-2 rounded-lg' placeholder='Enter Email' />
            </div>
            {
                emailSubmit && <div className='w-full mb-5'>
                    <div>Enter Your OTP</div>
                    <input type="text" value={inputField.otp} onChange={(event)=>{handleOnChange(event,"otp")}} className='w-1/2 border-2 border-slate-400 p-2 rounded-lg' placeholder='Enter OTP' />
                </div>
            }
            {
                otpValidate && <div className='w-full mb-5'>
                    <div>Enter Your New Password </div>
                    <input type="password" value={inputField.newPassword} onChange={(event)=>{handleOnChange(event,"newPassword")}} className='w-1/2 border-2 border-slate-400 p-2 rounded-lg' placeholder='Enter New Password' />
                </div>
            }

            <div className='bg-slate-800 text-white mx-auto w-2/3 p-3 rounded-lg text-center border-2 font-semibold cursor-pointer hover:bg-white hover:text-black' onClick={() => handleSubmit()}>
                {contentValue}
            </div>
            {loader && <Loader />}
            <ToastContainer theme='dark'/>
        </div>
    )
}

export default ForgotPassword