import React, { useEffect, useState } from 'react'
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import RunCircleIcon from '@mui/icons-material/RunCircle';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const [greeting, setGreeting] = useState("");
    const [isExpanded, setIsExpanded] = useState(true);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isCollapsing, setIsCollapsing] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const greetingMessage = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            setGreeting("Good Morning");
        } else if (currentHour < 18) {
            setGreeting("Good Afternoon");
        } else if (currentHour < 21) {
            setGreeting("Good Evening");
        } else {
            setGreeting("Good Night");
        }
    }

    useEffect(() => {
        greetingMessage();
        
        // Set active tab based on current path
        const path = location.pathname;
        if (path === '/dashboard') setActiveTab('dashboard');
        else if (path === '/member') setActiveTab('member');
        else if (path === '/diet-plan') setActiveTab('diet-plan');
    }, [location]);

    const handleLogout = async () => {
        localStorage.clear();
        navigate('/');
    }

    const toggleSidebar = () => {
        setIsCollapsing(true);
        setTimeout(() => {
            setIsExpanded(!isExpanded);
            setIsCollapsing(false);
        }, 300);
    }

    return (
        <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'} ${isCollapsing ? 'transitioning' : ''}`}>
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                <MenuIcon />
            </div>
            
            <div className="sidebar-header">
                <div className="gym-title">
                    <FitnessCenterIcon className="gym-icon" />
                    {isExpanded && <span className="gym-name">{localStorage.getItem('gymName')}</span>}
                </div>
            </div>
            
            <div className="user-profile">
                <div className="profile-image-container">
                    <div className="profile-image">
                        <img 
                            alt="gym" 
                            src={localStorage.getItem("gymPic")} 
                        />
                    </div>
                    {isExpanded && <div className="online-indicator"></div>}
                </div>
                {isExpanded && (
                    <div className="profile-info">
                        <div className="greeting">{greeting}</div>
                        <div className="username">Admin</div>
                    </div>
                )}
            </div>

            <div className="sidebar-menu">
                <Link 
                    to='/dashboard' 
                    className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    <div className="menu-icon">
                        <HomeIcon />
                    </div>
                    {isExpanded && <div className="menu-text">Dashboard</div>}
                    {activeTab === 'dashboard' && <div className="active-indicator"></div>}
                    <div className="menu-hover-effect"></div>
                </Link>

                <Link 
                    to='/member' 
                    className={`menu-item ${activeTab === 'member' ? 'active' : ''}`}
                    onClick={() => setActiveTab('member')}
                >
                    <div className="menu-icon">
                        <GroupIcon />
                    </div>
                    {isExpanded && <div className="menu-text">Members</div>}
                    {activeTab === 'member' && <div className="active-indicator"></div>}
                    <div className="menu-hover-effect"></div>
                </Link>

                <Link 
                    to='/diet-plans' 
                    className={`menu-item ${activeTab === 'diet-plan' ? 'active' : ''}`}
                    onClick={() => setActiveTab('diet-plan')}
                >
                    <div className="menu-icon">
                        <RunCircleIcon />
                    </div>
                    {isExpanded && <div className="menu-text">Diet Plan</div>}
                    {activeTab === 'diet-plan' && <div className="active-indicator"></div>}
                    <div className="menu-hover-effect"></div>
                </Link>

                <div 
                    className="menu-item logout-item"
                    onClick={handleLogout}
                >
                    <div className="menu-icon">
                        <LogoutIcon />
                    </div>
                    {isExpanded && <div className="menu-text">Logout</div>}
                    <div className="menu-hover-effect"></div>
                </div>
            </div>

            {isExpanded && (
                <div className="sidebar-footer">
                    <div className="current-time">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="current-date">
                        {new Date().toLocaleDateString()}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Sidebar;