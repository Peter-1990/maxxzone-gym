import React, { useState } from 'react'
import CircleIcon from '@mui/icons-material/Circle';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Link } from 'react-router-dom';
import './MemberCard.css';

const MemberCard = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    return dateString.slice(0,10).split('-').reverse().join('-');
  };

  const getDaysUntilNextBill = (dateString) => {
    const nextBillDate = new Date(dateString);
    const today = new Date();
    const diffTime = nextBillDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilBill = getDaysUntilNextBill(item?.nextBillDate);
  let statusColor = "greenyellow";
  let statusText = "Active";

  if (daysUntilBill <= 3) {
    statusColor = "#ff6b6b";
    statusText = "Expiring Soon";
  } else if (daysUntilBill <= 7) {
    statusColor = "#feca57";
    statusText = "Renewal Due";
  }

  return (
    <Link 
      to={`/member/${item?._id}`} 
      className={`member-card ${isHovered ? 'hovered' : ''} ${item?.status === "Active" ? 'active' : 'inactive'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-gradient-bar"></div>
      
      <div className="member-image-container">
        <div className="image-wrapper">
          <img 
            className='member-image' 
            src={item?.profilePic || 'https://static.vecteezy.com/system/resources/previews/002/265/650/large_2x/unknown-person-user-icon-for-web-vector.jpg'} 
            alt='Profile' 
          />
          <div className="status-indicator" style={{ backgroundColor: statusColor }}>
            <CircleIcon className="status-icon" />
            <span className="status-text">{statusText}</span>
          </div>
        </div>
      </div>

      <div className="member-details">
        <div className="member-name">
          <FitnessCenterIcon className="detail-icon" />
          <h3>{item?.name}</h3>
        </div>
        
        <div className="member-phone">
          <PhoneIcon className="detail-icon" />
          <span>+91 {item?.mobileNo}</span>
        </div>
        
        <div className="member-bill-date">
          <CalendarTodayIcon className="detail-icon" />
          <span>Next Bill: {formatDate(item?.nextBillDate)}</span>
          <div className="days-remaining" style={{ color: statusColor }}>
            ({daysUntilBill} {daysUntilBill === 1 ? 'day' : 'days'} left)
          </div>
        </div>
      </div>

      <div className="view-details-button">
        View Details
        <div className="button-arrow">→</div>
      </div>

      {isHovered && (
        <div className="card-hover-effect"></div>
      )}
    </Link>
  )
}

export default MemberCard;