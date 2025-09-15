import React, { useEffect, useRef, useState } from 'react'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import ErrorIcon from '@mui/icons-material/Error';
import ReportIcon from '@mui/icons-material/Report';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import Model from '../../Components/Model/model';
import Addmembers from '../../Components/Addmembers/addmembers';

const Dashboard = () => {
  const [accordionDashboard, setAccordionDashboard] = useState(false);
  const [stats, setStats] = useState({
    totalMembers: 0,
    monthlyMembers: 0,
    expiring3Days: 0,
    expiring4to7Days: 0,
    expired: 0,
    inactive: 0
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [addMember, setAddmember] = useState(false);
  const accordionRef = useRef();

  const handleMembers = () => {
    setAddmember(prev => !prev);
  }

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mock data fetch (replace with actual API calls)
  useEffect(() => {
    // Simulate API call to fetch stats
    const fetchStats = () => {
      setStats({
        totalMembers: 142,
        monthlyMembers: 24,
        expiring3Days: 8,
        expiring4to7Days: 12,
        expired: 5,
        inactive: 17
      });
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const checkIfClickedOutside = e => {
      if (accordionDashboard && accordionRef.current && !accordionRef.current.contains(e.target)) {
        setAccordionDashboard(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [accordionDashboard]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-background">
        <div className="floating-dumbbell">💪</div>
        <div className="floating-weight">🏋️</div>
        <div className="floating-gym">🔥</div>
        <div className="floating-bar">📊</div>
      </div>

      <div className="dashboard-header">
        <div className="header-left">
          <div className="date-time-display">
            <div className="current-date">{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className="current-time">{currentTime.toLocaleTimeString()}</div>
          </div>
        </div>

        <div className="header-right">
          <div className="notification-bell">
            <NotificationsIcon />
            <span className="notification-badge">3</span>
          </div>

          <div className="user-profile">
            <img
              className="user-avatar"
              src={"https://static.vecteezy.com/system/resources/previews/002/265/650/large_2x/unknown-person-user-icon-for-web-vector.jpg"}
              alt="User profile"
            />
            <div className="user-info">
              <div className="user-name">Admin</div>
              <div className="user-role">Gym Manager</div>
            </div>
          </div>
        </div>
      </div>

      {accordionDashboard && (
        <div ref={accordionRef} className="dashboard-accordion">
          <div className="accordion-content">
            <h3>Welcome to Gym Management System</h3>
            <p>Hi! Welcome to our Gym Management System.</p>
            <p>Feel free to ask any queries or report issues.</p>
            <div className="contact-info">
              <span>Developer Contact: +919381065658</span>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-title">
        <h1>Dashboard Overview</h1>
        <p>Manage your gym efficiently with these quick insights</p>
      </div>

      <div className="stats-grid">
        <StatCard
          to="/member"
          icon={<PeopleAltIcon />}
          title="Joined Members"
          value={stats.totalMembers}
          gradient="from-green-400 to-blue-500"
          iconColor="#10B981"
          trend={{ value: 12, isPositive: true }}
        />

        <StatCard
          to="/monthly-member"
          icon={<SignalCellularAltIcon />}
          title="Monthly Joined"
          value={stats.monthlyMembers}
          gradient="from-purple-400 to-pink-500"
          iconColor="#8B5CF6"
          trend={{ value: 5, isPositive: true }}
        />

        <StatCard
          to="/expiring-3-days"
          icon={<AccessAlarmIcon />}
          title="Expiring in 3 days"
          value={stats.expiring3Days}
          gradient="from-yellow-400 to-red-500"
          iconColor="#F59E0B"
          trend={{ value: 3, isPositive: false }}
        />

        <StatCard
          to="/expiring-4-7-days"
          icon={<AccessAlarmIcon />}
          title="Expiring in 4-7 days"
          value={stats.expiring4to7Days}
          gradient="from-orange-400 to-red-500"
          iconColor="#F97316"
          trend={{ value: 4, isPositive: false }}
        />

        <StatCard
          to="/expired"
          icon={<ErrorIcon />}
          title="Expired Members"
          value={stats.expired}
          gradient="from-red-400 to-pink-600"
          iconColor="#EF4444"
          trend={{ value: 2, isPositive: false }}
        />

        <StatCard
          to="/inactive-member"
          icon={<ReportIcon />}
          title="Inactive Members"
          value={stats.inactive}
          gradient="from-gray-400 to-blue-600"
          iconColor="#6B7280"
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      <div className="dashboard-actions">
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button onClick={handleMembers} className="action-btn primary">Add New Member</button>
            <button className="action-btn secondary">Generate Report</button>
            <button className="action-btn tertiary">Send Notifications</button>
          </div>
        </div>
      </div>

      <div className="developer-contact">
        <div className="contact-card">
          <div className="contact-icon">📱</div>
          <div className="contact-info">
            <h3>Need Technical Support?</h3>
            <p>Contact Developer at +919381065658</p>
          </div>
        </div>
      </div>
      {addMember && (
        <Model
          header="Add New Member"
          handleClose={handleMembers}
          content={<Addmembers />}
        />
      )}
    </div>
  );
};

const StatCard = ({ to, icon, title, value, gradient, iconColor, trend }) => {
  return (
    <Link to={to} className="stat-card-link">
      <div className="stat-card">
        <div className={`card-gradient-bar bg-gradient-to-r ${gradient}`}></div>
        <div className="card-content">
          <div className="card-icon" style={{ color: iconColor }}>
            {icon}
          </div>
          <div className="card-text">
            <h3 className="card-value">{value}</h3>
            <p className="card-title">{title}</p>
          </div>
          {trend && (
            <div className={`trend-indicator ${trend.isPositive ? 'positive' : 'negative'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </div>
          )}
          <div className="card-badge">View Details</div>
        </div>
        <div className="card-hover-effect"></div>
      </div>
    </Link>
  );
};

export default Dashboard;