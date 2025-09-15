import React, { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import EventIcon from '@mui/icons-material/Event';
import UpdateIcon from '@mui/icons-material/Update';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { useNavigate, useParams } from 'react-router-dom';
import Switch from 'react-switch';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MemberDetail.css';

const MemberDetail = () => {
    const [status, setStatus] = useState("Pending");
    const [renew, setRenew] = useState(false);
    const [membership, setMembership] = useState([]);
    const [data, setData] = useState(null);
    const [planMember, setPlanMember] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchData();
        fetchMembership();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchMembership = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/plans/get-membership`, 
                { withCredentials: true }
            );
            setMembership(response.data.membership);
            setPlanMember(response.data.membership[0]?._id || "");
        } catch (err) {
            console.log(err);
            toast.error("Something Went Wrong");
        }
    }

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/members/get-member/${id}`, 
                { withCredentials: true }
            );
            setData(response.data.member);
            setStatus(response.data.member.status);
            toast.success(response.data.message);
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    const handleSwitchBtn = async() => {
        let newStatus = status === "Active" ? "Pending" : "Active";
        try {
            await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/members/change-status/${id}`, 
                { status: newStatus }, 
                { withCredentials: true }
            );
            toast.success("Status Changed Successfully");
            setStatus(newStatus);
        } catch (err) {
            console.log(err);
            toast.error("Something Went Wrong");
        }
    }

    const isDateInPast = (inputDate) => {
        if (!inputDate) return false;
        const today = new Date();
        const givenDate = new Date(inputDate);
        return givenDate < today;
    };

    const handleOnChangeSelect = (event) => {
        let value = event.target.value;
        setPlanMember(value);
    }
    
    const handleRenewSaveBtn = async () => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/members/update-member-plan/${id}`, 
                { membership: planMember }, 
                { withCredentials: true }
            );
            setData(response.data.member);
            setRenew(false);
            toast.success(response.data.message);
        } catch (err) {
            toast.error("Something Went Wrong");
            console.log(err);
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return dateString.slice(0,10).split('-').reverse().join('-');
    }

    const getDaysUntilNextBill = (dateString) => {
        if (!dateString) return 0;
        const nextBillDate = new Date(dateString);
        const today = new Date();
        const diffTime = nextBillDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    if (isLoading) {
        return (
            <div className="member-detail-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading member details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="member-detail-container">
            <div className="member-detail-background">
                <div className="floating-dumbbell">💪</div>
                <div className="floating-weight">🏋️</div>
                <div className="floating-gym">🔥</div>
            </div>
            
            <div className="member-detail-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <ArrowBackIcon className="back-icon" />
                    <span>Go Back</span>
                </button>
                
                <div className="member-status">
                    <div className="status-label">Status:</div>
                    <div className={`status-badge ${status === "Active" ? "active" : "inactive"}`}>
                        {status}
                    </div>
                    <Switch 
                        onColor='#4ecdc4'
                        offColor='#ff6b6b'
                        checked={status === "Active"} 
                        onChange={handleSwitchBtn}
                        className="status-switch"
                    />
                </div>
            </div>

            <div className="member-detail-content">
                <div className="member-profile-section">
                    <div className="profile-image-container">
                        <img 
                            src={data?.profilePic || 'https://static.vecteezy.com/system/resources/previews/002/265/650/large_2x/unknown-person-user-icon-for-web-vector.jpg'} 
                            alt="Member Profile" 
                            className="profile-image"
                        />
                        <div className="profile-overlay">
                            <PersonIcon className="profile-icon" />
                        </div>
                    </div>

                    <div className="member-info-card">
                        <h2 className="member-name">{data?.name || "N/A"}</h2>
                        
                        <div className="info-item">
                            <PhoneIcon className="info-icon" />
                            <span className="info-label">Mobile:</span>
                            <span className="info-value">+91 {data?.mobileNo || "N/A"}</span>
                        </div>
                        
                        <div className="info-item">
                            <HomeIcon className="info-icon" />
                            <span className="info-label">Address:</span>
                            <span className="info-value">{data?.address || "N/A"}</span>
                        </div>
                        
                        <div className="info-item">
                            <EventIcon className="info-icon" />
                            <span className="info-label">Joined Date:</span>
                            <span className="info-value">{formatDate(data?.createdAt)}</span>
                        </div>
                        
                        <div className="info-item">
                            <UpdateIcon className="info-icon" />
                            <span className="info-label">Next Bill Date:</span>
                            <span className="info-value">{formatDate(data?.nextBillDate)}</span>
                            {data?.nextBillDate && (
                                <span className="days-remaining">
                                    ({getDaysUntilNextBill(data.nextBillDate)} days remaining)
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="member-actions-section">
                    {isDateInPast(data?.nextBillDate) && status === "Active" && (
                        <button 
                            onClick={() => setRenew(!renew)} 
                            className={`renew-button ${renew ? "active" : ""}`}
                        >
                            <FitnessCenterIcon className="renew-icon" />
                            <span>{renew ? "Cancel Renew" : "Renew Membership"}</span>
                        </button>
                    )}

                    {renew && status === "Active" && (
                        <div className="renewal-panel">
                            <h3 className="renewal-title">Renew Membership</h3>
                            
                            <div className="membership-selector">
                                <label className="selector-label">Select Membership Plan:</label>
                                <select 
                                    value={planMember} 
                                    onChange={handleOnChangeSelect} 
                                    className="membership-dropdown"
                                >
                                    {membership.map((item, index) => (
                                        <option value={item._id} key={index}>
                                            {item.months} Months Membership - ₹{item.price}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button 
                                onClick={handleRenewSaveBtn} 
                                className="save-button"
                            >
                                <span>Confirm Renewal</span>
                                <div className="button-arrow">→</div>
                            </button>
                        </div>
                    )}
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

export default MemberDetail;