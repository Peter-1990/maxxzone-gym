import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home/home';
import Dashboard from './Pages/Dashboard/dashboard';
import Sidebar from './Components/Sidebar/sidebar';
import { useEffect, useState } from 'react';
import Member from './Pages/Member/member';
import GeneralUser from './Pages/GeneralUser/generalUser';
import MemberDetail from './Pages/MemberDetail/memberDetail';
import 'react-toastify/dist/ReactToastify.css';
import MonthlyMember from './Pages/MonthlyMember/monthlyMember';
import ExpiringthreeDays from './Pages/ExpiringthreeDays/expiringthreeDays';
import ExpiringfourDays from './Pages/ExpiringfourDays/expiringfourDays';
import ExpiredMember from './Pages/ExpiredMember/expiredMember';
import InactiveMember from './Pages/InactiveMember/inactiveMember';
import DietPlanPage from './Components/DietPlan/DietPlanPage';



function App() {

  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    let isLogedIn = localStorage.getItem("isLogin");
    if (isLogedIn) {
      setIsLogin(true);
      navigate('/dashboard')
    } else {
      setIsLogin(false)
      navigate('/')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[localStorage.getItem("isLogin")])

  return (
    <div className="flex bg-black">
      {
        isLogin && <Sidebar />
      }
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/member' element={<Member />} />
        <Route path='/diet-plans' element={<DietPlanPage/>} />
        <Route path='/monthly-member' element={<MonthlyMember />} />
        <Route path='/expiring-3-days' element={<ExpiringthreeDays />} />
        <Route path='/expiring-4-7-days' element={<ExpiringfourDays />} />
        <Route path='/expired' element={<ExpiredMember />} />
        <Route path='/inactive-member' element={<InactiveMember/>} />
        <Route path='/specific/:page' element={<GeneralUser />} />
        <Route path='/member/:id' element={<MemberDetail/>} />
      </Routes>
      
    </div>
  );
}

export default App;
