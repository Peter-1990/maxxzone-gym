import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AddDietPlan from './AddDietPlan';
import DietPlanCard from './DietPlanCard';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import AddIcon from '@mui/icons-material/Add';
import './DietPlan.css';

const DietPlanPage = () => {
  const [dietPlans, setDietPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    fetchDietPlans();
  }, []);

  const fetchDietPlans = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/diet-plan/all`,
        { withCredentials: true }
      );
      setDietPlans(response.data.dietPlans || []);
    } catch (error) {
      console.error('Error fetching diet plans:', error);
      toast.error('Failed to load diet plans');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanAdded = () => {
    setShowAddForm(false);
    setEditingPlan(null);
    fetchDietPlans();
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setShowAddForm(true);
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm('Are you sure you want to delete this diet plan?')) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/diet-plan/delete/${planId}`,
          { withCredentials: true }
        );
        toast.success('Diet Plan Deleted Successfully');
        fetchDietPlans();
      } catch (error) {
        console.error('Error deleting diet plan:', error);
        toast.error('Failed to delete diet plan');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="diet-plan-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading diet plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="diet-plan-page">
      <div className="page-header">
        <div className="header-content">
          <LocalDiningIcon className="header-icon" />
          <h1>Diet Plans Management</h1>
        </div>
        
        {!showAddForm && (
          <button 
            className="add-plan-btn"
            onClick={() => setShowAddForm(true)}
          >
            <AddIcon /> Add New Plan
          </button>
        )}
      </div>

      {showAddForm ? (
        <AddDietPlan 
          onPlanAdded={handlePlanAdded}
          onCancel={() => {
            setShowAddForm(false);
            setEditingPlan(null);
          }}
          editingPlan={editingPlan}
        />
      ) : (
        <div className="diet-plans-container">
          {dietPlans.length === 0 ? (
            <div className="empty-state">
              <LocalDiningIcon className="empty-icon" />
              <h3>No Diet Plans Yet</h3>
              <p>Create your first diet plan to get started</p>
              <button 
                className="create-first-btn"
                onClick={() => setShowAddForm(true)}
              >
                Create First Plan
              </button>
            </div>
          ) : (
            <div className="diet-plans-grid">
              {dietPlans.map(plan => (
                <DietPlanCard
                  key={plan._id}
                  plan={plan}
                  onEdit={handleEditPlan}
                  onDelete={handleDeletePlan}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DietPlanPage;