import React, { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import MemberCard from '../../Components/MemberCard/memberCard';
import { inActiveMembers } from '../GeneralUser/data';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import RefreshIcon from '@mui/icons-material/Refresh';

const InActiveMember = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshAnimation, setRefreshAnimation] = useState(false);

    useEffect(() => {
        fetchInActiveMember();
    }, []);

    const fetchInActiveMember = async () => {
        try {
            setIsLoading(true);
            const members = await inActiveMembers();
            console.log('Fetched inactive members:', members);
            if (Array.isArray(members)) {
                setData(members);
            } else if (members && members.members) {
                setData(members.members);
            } else {
                console.error('Unexpected data structure:', members);
                setData([]);
            }
        } catch (error) {
            console.error('Error fetching inactive members:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = () => {
        setRefreshAnimation(true);
        fetchInActiveMember();
        setTimeout(() => setRefreshAnimation(false), 1000);
    };

    return (
        <div style={{
            marginLeft: '280px',
            width: 'calc(100% - 280px)',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)',
            backgroundSize: '400% 400%',
            animation: 'gradientBG 15s ease infinite',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'margin-left 0.3s ease, width 0.3s ease'
        }}>
            {/* Adjust for collapsed sidebar */}
            <style>
                {`
                .sidebar.collapsed ~ .inactive-member-container {
                    margin-left: 80px;
                    width: calc(100% - 80px);
                }
                `}
            </style>

            {/* Animated background elements */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                overflow: 'hidden',
                zIndex: 0
            }}>
                <div style={{
                    position: 'absolute',
                    fontSize: '3rem',
                    opacity: 0.1,
                    animation: 'float 8s ease-in-out infinite',
                    top: '15%',
                    left: '10%',
                    animationDelay: '0s'
                }}>🚫</div>
                <div style={{
                    position: 'absolute',
                    fontSize: '3rem',
                    opacity: 0.1,
                    animation: 'float 8s ease-in-out infinite',
                    top: '65%',
                    right: '15%',
                    animationDelay: '2s'
                }}>⏸️</div>
                <div style={{
                    position: 'absolute',
                    fontSize: '3rem',
                    opacity: 0.1,
                    animation: 'float 8s ease-in-out infinite',
                    bottom: '20%',
                    left: '20%',
                    animationDelay: '4s'
                }}>😴</div>
            </div>

            {/* Header section */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                position: 'relative',
                zIndex: 2
            }}>
                <Link 
                    to={'/dashboard'} 
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                        e.target.style.transform = 'translateX(-5px)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.transform = 'translateX(0)';
                    }}
                >
                    <ArrowBackIcon />
                    <span>Back To Dashboard</span>
                </Link>

                <button
                    onClick={handleRefresh}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        animation: refreshAnimation ? 'spin 1s ease-in-out' : 'none'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                >
                    <RefreshIcon />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Title section */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '25px',
                position: 'relative',
                zIndex: 2
            }}>
                <div style={{
                    background: 'rgba(107, 114, 128, 0.2)',
                    backdropFilter: 'blur(10px)',
                    padding: '15px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <DoNotDisturbIcon style={{ fontSize: '2rem', color: '#6b7280' }} />
                </div>
                <div>
                    <h1 style={{
                        margin: 0,
                        fontSize: '2rem',
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #6b7280, #4b5563)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent'
                    }}>
                        Inactive Members
                    </h1>
                    <p style={{
                        margin: '5px 0 0 0',
                        opacity: 0.8,
                        fontSize: '1rem'
                    }}>
                        {data.length} members currently inactive
                    </p>
                </div>
            </div>

            {/* Members grid */}
            {isLoading ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh',
                    position: 'relative',
                    zIndex: 2
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '3px solid rgba(255, 255, 255, 0.1)',
                        borderTop: '3px solid #6b7280',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                </div>
            ) : (
                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    padding: '25px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    zIndex: 2,
                    minHeight: '400px',
                    overflowY: 'auto',
                    maxHeight: 'calc(100vh - 250px)'
                }}>
                    {data.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '20px'
                        }}>
                            {data.map((item, index) => (
                                <MemberCard item={item} key={index} />
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '300px',
                            textAlign: 'center'
                        }}>
                            <DoNotDisturbIcon style={{ fontSize: '4rem', color: 'rgba(107, 114, 128, 0.3)', marginBottom: '20px' }} />
                            <h3 style={{ margin: '0 0 10px 0', color: 'white' }}>No Inactive Members</h3>
                            <p style={{ margin: 0, opacity: 0.7 }}>All members are currently active.</p>
                        </div>
                    )}
                </div>
            )}

            {/* CSS styles */}
            <style>
                {`
                @keyframes gradientBG {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                @keyframes float {
                    0% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                    100% { transform: translateY(0) rotate(0deg); }
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes pulse-inactive {
                    0% { opacity: 0.7; }
                    50% { opacity: 1; }
                    100% { opacity: 0.7; }
                }
                
                /* Scrollbar styling */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.4);
                }
                
                /* Inactive styling for inactive members */
                .inactive-member-status {
                    animation: pulse-inactive 2s infinite;
                }
                
                /* Responsive design */
                @media (max-width: 1024px) {
                    .inactive-member-container {
                        margin-left: 80px;
                        width: calc(100% - 80px);
                        padding: 15px;
                    }
                    
                    .inactive-member-container > div:first-child {
                        flex-direction: column;
                        gap: 15px;
                        align-items: flex-start;
                    }
                    
                    .inactive-member-container > div:nth-child(3) > div {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    }
                }
                
                @media (max-width: 768px) {
                    .inactive-member-container {
                        margin-left: 0;
                        width: 100%;
                    }
                    
                    .inactive-member-container > div:nth-child(3) > div {
                        grid-template-columns: 1fr;
                    }
                    
                    .inactive-member-container > div:nth-child(2) {
                        flex-direction: column;
                        text-align: center;
                        gap: 10px;
                    }
                    
                    .inactive-member-container h1 {
                        font-size: 1.8rem;
                    }
                }
                
                @media (max-width: 480px) {
                    .inactive-member-container {
                        padding: 10px;
                    }
                    
                    .inactive-member-container h1 {
                        font-size: 1.5rem;
                    }
                    
                    .inactive-member-container > div:first-child a,
                    .inactive-member-container > div:first-child button {
                        padding: 10px 15px;
                        font-size: 0.9rem;
                    }
                }
                `}
            </style>
        </div>
    )
}

export default InActiveMember;