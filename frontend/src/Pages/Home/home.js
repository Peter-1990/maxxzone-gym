import React from 'react'
import Login from '../../Components/Login/login'
import SignUp from '../../Components/Signup/signUp'

const Home = () => {
  return (
    <div className='w-full h-[100vh]'>
        <div className='border-2 border-slate-800 bg-slate-800 text-white p-5 font-semibold text-xl'>
            Welcome To Gym World
        </div>
        <div className='w-full bg-gradient-to-r from-slate-400 via-teal-800 to-slate-800 flex justify-center h-[100%] '>
            <div className='w-full flex flex-col lg:flex-row justify-center items-center lg:gap-32 p-4'>
                <Login />
                <SignUp />
            </div>
        </div>
    </div>
  )
}

export default Home