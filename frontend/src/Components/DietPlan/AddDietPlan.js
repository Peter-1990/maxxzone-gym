import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const AddDietPlan = ({ onPlanAdded, onCancel, editingPlan }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    planName: '',
    description: '',
    meals: [{ mealName: '', description: '', calories: '', items: [''] }],
    totalCalories: 0
  });

  // Pre-fill form if editing
  useEffect(() => {
    if (editingPlan) {
      setFormData({
        planName: editingPlan.planName,
        description: editingPlan.description,
        meals: editingPlan.meals.map(meal => ({
          mealName: meal.mealName,
          description: meal.description,
          calories: meal.calories.toString(),
          items: meal.items && meal.items.length > 0 ? meal.items : ['']
        })),
        totalCalories: editingPlan.totalCalories
      });
    }
  }, [editingPlan]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMealChange = (index, field, value) => {
    const updatedMeals = [...formData.meals];
    updatedMeals[index][field] = value;
    
    // Calculate total calories
    const totalCal = updatedMeals.reduce((sum, meal) => {
      return sum + (Number(meal.calories) || 0);
    }, 0);
    
    setFormData(prev => ({
      ...prev,
      meals: updatedMeals,
      totalCalories: totalCal
    }));
  };

  const handleMealItemChange = (mealIndex, itemIndex, value) => {
    const updatedMeals = [...formData.meals];
    updatedMeals[mealIndex].items[itemIndex] = value;
    
    setFormData(prev => ({
      ...prev,
      meals: updatedMeals
    }));
  };

  const addMealItem = (mealIndex) => {
    const updatedMeals = [...formData.meals];
    updatedMeals[mealIndex].items.push('');
    
    setFormData(prev => ({
      ...prev,
      meals: updatedMeals
    }));
  };

  const removeMealItem = (mealIndex, itemIndex) => {
    const updatedMeals = [...formData.meals];
    if (updatedMeals[mealIndex].items.length > 1) {
      updatedMeals[mealIndex].items.splice(itemIndex, 1);
      
      setFormData(prev => ({
        ...prev,
        meals: updatedMeals
      }));
    }
  };

  const addMeal = () => {
    setFormData(prev => ({
      ...prev,
      meals: [...prev.meals, { mealName: '', description: '', calories: '', items: [''] }]
    }));
  };

  const removeMeal = (index) => {
    if (formData.meals.length > 1) {
      const updatedMeals = formData.meals.filter((_, i) => i !== index);
      const totalCal = updatedMeals.reduce((sum, meal) => {
        return sum + (Number(meal.calories) || 0);
      }, 0);
      
      setFormData(prev => ({
        ...prev,
        meals: updatedMeals,
        totalCalories: totalCal
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form data
      if (!formData.planName.trim() || !formData.description.trim()) {
        toast.error('Please fill in all required fields');
        return;
      }

      for (let i = 0; i < formData.meals.length; i++) {
        const meal = formData.meals[i];
        if (!meal.mealName.trim() || !meal.description.trim() || !meal.calories) {
          toast.error('Please fill in all meal fields');
          return;
        }
        
        // Validate meal items
        const hasEmptyItems = meal.items.some(item => !item.trim());
        if (hasEmptyItems) {
          toast.error('Please fill in all meal items or remove empty ones');
          return;
        }
      }

      const url = editingPlan 
        ? `${process.env.REACT_APP_BACKEND_URL}/diet-plan/update/${editingPlan._id}`
        : `${process.env.REACT_APP_BACKEND_URL}/diet-plan/add`;

      const method = editingPlan ? 'put' : 'post';

      await axios[method](
        url,
        {
          ...formData,
          meals: formData.meals.map(meal => ({
            ...meal,
            calories: Number(meal.calories),
            items: meal.items.filter(item => item.trim()) // Remove empty items
          }))
        },
        { withCredentials: true }
      );

      toast.success(editingPlan ? 'Diet plan updated successfully!' : 'Diet plan added successfully!');
      onPlanAdded();
    } catch (error) {
      console.error('Error saving diet plan:', error);
      toast.error(error.response?.data?.error || `Failed to ${editingPlan ? 'update' : 'add'} diet plan`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-diet-plan-form">
      <h2>{editingPlan ? 'Edit Diet Plan' : 'Add New Diet Plan'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Plan Name *</label>
          <input
            type="text"
            name="planName"
            value={formData.planName}
            onChange={handleInputChange}
            placeholder="Enter plan name"
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe this diet plan"
            rows="3"
            required
          />
        </div>

        <div className="meals-section">
          <div className="section-header">
            <h3>Meals</h3>
            <button type="button" onClick={addMeal} className="add-meal-btn">
              <AddIcon /> Add Meal
            </button>
          </div>

          {formData.meals.map((meal, mealIndex) => (
            <div key={mealIndex} className="meal-form">
              <div className="meal-header">
                <h4>Meal {mealIndex + 1}</h4>
                {formData.meals.length > 1 && (
                  <button type="button" onClick={() => removeMeal(mealIndex)} className="remove-meal-btn">
                    <RemoveIcon />
                  </button>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Meal Name *</label>
                  <input
                    type="text"
                    value={meal.mealName}
                    onChange={(e) => handleMealChange(mealIndex, 'mealName', e.target.value)}
                    placeholder="e.g., Breakfast, Lunch"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Calories *</label>
                  <input
                    type="number"
                    value={meal.calories}
                    onChange={(e) => handleMealChange(mealIndex, 'calories', e.target.value)}
                    placeholder="Calories"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={meal.description}
                  onChange={(e) => handleMealChange(mealIndex, 'description', e.target.value)}
                  placeholder="Describe this meal"
                  rows="2"
                  required
                />
              </div>

              <div className="form-group">
                <label>Food Items *</label>
                {meal.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="meal-item-input">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleMealItemChange(mealIndex, itemIndex, e.target.value)}
                      placeholder="e.g., 2 scrambled eggs with spinach"
                      required
                    />
                    {meal.items.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeMealItem(mealIndex, itemIndex)} 
                        className="remove-item-btn"
                      >
                        <RemoveIcon />
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addMealItem(mealIndex)} 
                  className="add-item-btn"
                >
                  <AddIcon /> Add Food Item
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="total-calories-display">
          <strong>Total Calories: {formData.totalCalories}</strong>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? 'Saving...' : (editingPlan ? 'Update Diet Plan' : 'Add Diet Plan')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDietPlan;