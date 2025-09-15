import React, { useEffect, useState } from 'react'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PeopleIcon from '@mui/icons-material/People';
import Model from '../../Components/Model/model';
import MemberCard from '../../Components/MemberCard/memberCard';
import AddmemberShip from '../../Components/Addmembership/addmemberShip';
import Addmembers from '../../Components/Addmembers/addmembers';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MemberPage.css';

const Member = () => {
    const [addMembership, setAddmemberShip] = useState(false);
    const [addMember, setAddmember] = useState(false);
    const [data, setData] = useState([]);
    const [skip, setSkip] = useState(0);
    const [search, setSearch] = useState("");
    const [isSearchModeOn, setIsSearchModeOn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [startFrom, setStartFrom] = useState(0);
    const [endTo, setEndTo] = useState(9);
    const [totalData, setTotalData] = useState(0);
    const [limit] = useState(9);
    const [noOfPage, setNoOfPage] = useState(0);

    useEffect(() => {
        fetchData(0, 9);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchData = async (skip, limits) => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/members/all-member?skip=${skip}&limit=${limits}`, 
                { withCredentials: true }
            );
            
            let totalData = response.data.totalMembers;
            setTotalData(totalData);
            setData(response.data.members);

            let extraPage = totalData % limit === 0 ? 0 : 1;
            let totalPage = parseInt(totalData / limit) + extraPage;
            setNoOfPage(totalPage);

            if (totalData === 0) {
                setStartFrom(-1);
                setEndTo(0);
            } else if (totalData < 10) {
                setStartFrom(0);
                setEndTo(totalData);
            }
        } catch (err) {
            toast.error("Something went wrong");
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    const handleMemberShip = () => {
        setAddmemberShip(prev => !prev);
    }

    const handleMembers = () => {
        setAddmember(prev => !prev);
    }

    const handlePrev = () => {
        if (currentPage !== 1) {
            let currPage = currentPage - 1;
            setCurrentPage(currPage);
            let from = (currPage - 1) * 9;
            let to = (currPage * 9);
            setStartFrom(from);
            setEndTo(to);
            let skipValue = skip - 9;
            setSkip(skipValue);
            fetchData(skipValue, 9);
        }
    }

    const handleNext = () => {
        if (currentPage !== noOfPage) {
            let currPage = currentPage + 1;
            setCurrentPage(currPage);
            let from = (currPage - 1) * 9;
            let to = (currPage * 9);
            if (to > totalData) {
                to = totalData;
            }
            setStartFrom(from);
            setEndTo(to);
            let skipValue = skip + 9;
            setSkip(skipValue);
            fetchData(skipValue, 9);
        }
    }

    const handleSearchData = async () => {
        if (search !== "") {
            setIsSearchModeOn(true);
            setIsLoading(true);
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/members/searched-members?searchTerm=${search}`, 
                    { withCredentials: true }
                );
                setData(response.data.members);
                setTotalData(response.data.totalMembers);
            } catch (err) {
                console.log(err);
                toast.error("Technical Fault");
            } finally {
                setIsLoading(false);
            }
        } else {
            if (isSearchModeOn) {
                window.location.reload();
            } else {
                toast.error("Please enter a search term");
            }
        }
    }

    const handleClearSearch = () => {
        setSearch("");
        setIsSearchModeOn(false);
        setCurrentPage(1);
        setSkip(0);
        fetchData(0, 9);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchData();
        }
    }

    return (
        <div className="member-page-container">
            <div className="member-background">
                <div className="floating-dumbbell">💪</div>
                <div className="floating-weight">🏋️</div>
                <div className="floating-gym">🔥</div>
            </div>
            
            <div className="member-header">
                <div className="header-actions">
                    <button className="action-btn primary" onClick={handleMembers}>
                        <AddIcon className="btn-icon" />
                        <span>Add Member</span>
                    </button>
                    <button className="action-btn secondary" onClick={handleMemberShip}>
                        <FitnessCenterIcon className="btn-icon" />
                        <span>Membership</span>
                    </button>
                </div>

                <Link to={'/dashboard'} className="back-link">
                    <ArrowBackIcon className="back-icon" />
                    <span>Back to Dashboard</span>
                </Link>
            </div>

            <div className="search-section">
                <div className="search-container">
                    <div className="search-input-group">
                        <SearchIcon className="search-icon" />
                        <input 
                            type="text" 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="search-input" 
                            placeholder="Search by name or mobile number..." 
                        />
                        {search && (
                            <button className="clear-search" onClick={handleClearSearch}>
                                ×
                            </button>
                        )}
                    </div>
                    <button className="search-btn" onClick={handleSearchData}>
                        <SearchIcon />
                        <span>Search</span>
                    </button>
                </div>
            </div>

            <div className="members-stats">
                <div className="total-members">
                    <PeopleIcon className="stats-icon" />
                    <span>{totalData} Total Members</span>
                    {isSearchModeOn && <span className="search-results">(Search Results)</span>}
                </div>
                
                {!isSearchModeOn && (
                    <div className="pagination-controls">
                        <div className="pagination-info">
                            Showing {startFrom + 1} - {endTo} of {totalData} Members
                        </div>
                        <div className="pagination-buttons">
                            <button 
                                className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`} 
                                onClick={handlePrev}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeftIcon />
                            </button>
                            <button 
                                className={`pagination-btn ${currentPage === noOfPage ? 'disabled' : ''}`} 
                                onClick={handleNext}
                                disabled={currentPage === noOfPage}
                            >
                                <ChevronRightIcon />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="members-grid-container">
                {isLoading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading members...</p>
                    </div>
                ) : data.length > 0 ? (
                    <div className="members-grid">
                        {data.map((item, index) => (
                            <MemberCard key={item._id || index} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="no-members">
                        <PeopleIcon className="no-members-icon" />
                        <h3>No Members Found</h3>
                        <p>{isSearchModeOn ? "Try a different search term" : "Add your first member to get started"}</p>
                        {!isSearchModeOn && (
                            <button className="add-first-member" onClick={handleMembers}>
                                Add First Member
                            </button>
                        )}
                    </div>
                )}
            </div>

            {addMembership && (
                <Model 
                    header="Add Membership" 
                    handleClose={handleMemberShip} 
                    content={<AddmemberShip handleClose={handleMemberShip} />} 
                />
            )}
            {addMember && (
                <Model 
                    header="Add New Member" 
                    handleClose={handleMembers} 
                    content={<Addmembers />} 
                />
            )}
            
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

export default Member;



