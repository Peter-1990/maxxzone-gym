/* eslint-disable default-case */
import React, { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import MemberCard from '../../Components/MemberCard/memberCard';
import { getMonthlyJoined } from './data';

const GeneralUser = () => {

    const [header, setHeader] = useState("");
    const [data, setData] = useState([]);

    useEffect(() => {
        const func = sessionStorage.getItem('func');
        functionCall(func)
    }, [])

    const functionCall = async (func) => {

        switch (func) {

            case "monthlyJoined":

                setHeader("Monthly Joined Members")
                try {
                    const datas = await getMonthlyJoined();
                    console.log('Fetched data:', datas);
                    setData(datas);
                } catch (error) {
                    console.error('Error fetching joined members:', error);
                }
                break;

            case "threeDayExpire":

                setHeader("Expiring In 3 Days Members")
                break;

            case "fourToSevenDaysExpire":

                setHeader("Expiring in 4-7 Days Members")
                break;

            case "expired":

                setHeader("Expired Members")
                break;

            case "inActiveMembers":

                setHeader("InActive Members")
                break;
        }
    }

    return (
        <div className='text-white p-5 w-3/4 flex-col '>

            <div className='flex justify-between w-full text-white rounded-lg p-3'>
                <Link to={'/dashboard'} className='border-2 pl-3 pr-3 pt-1 pb-1 bg-white rounded-2xl text-black cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black'>
                    <ArrowBackIcon /> Back To DashBoard
                </Link>
            </div>

            <div className='pt-5 text-xl text-slate-400'>
                {header}
            </div>

            <div className=' p-5 mt-5 text-black rounded-lg grid gap-2 grid-cols-3 overflow-x-auto h-[80%]'>
                {
                    data.map((item,index) => {
                        return (
                            <MemberCard item={item}/>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default GeneralUser