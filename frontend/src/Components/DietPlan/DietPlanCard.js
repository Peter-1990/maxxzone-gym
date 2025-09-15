import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const DietPlanCard = ({ plan, onEdit, onDelete }) => {
  // Function to render meal items with details
  const renderMealItems = (meal) => {
    return (
      <Accordion sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c7873' }}>
              {meal.mealName}
            </Typography>
            <Chip 
              label={`${meal.calories} cal`} 
              size="small" 
              sx={{ backgroundColor: '#e8f5f4', color: '#2c7873', fontWeight: 'bold' }}
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {meal.description ? (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Meal Description:</Typography>
              <Typography variant="body2" paragraph>{meal.description}</Typography>
              
              {meal.items && meal.items.length > 0 ? (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Food Items:</Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {meal.items.map((item, index) => (
                      <Typography 
                        component="li" 
                        key={index} 
                        variant="body2" 
                        sx={{ 
                          mb: 1,
                          '&:before': {
                            content: '"•"',
                            color: '#42e695',
                            fontWeight: 'bold',
                            display: 'inline-block',
                            width: '1em',
                            marginRight: '5px'
                          }
                        }}
                      >
                        {item}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No specific food items listed for this meal.
                </Typography>
              )}
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No description available for this meal.
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h5" component="h2" sx={{ color: '#2c7873', fontWeight: 'bold' }}>
            {plan.planName}
          </Typography>
          <Box>
            <IconButton 
              onClick={() => onEdit(plan)} 
              size="small" 
              sx={{ color: '#42e695' }}
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              onClick={() => onDelete(plan._id)} 
              size="small" 
              sx={{ color: '#ff6b6b' }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        
        {plan.description && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2, fontStyle: 'italic' }}>
            {plan.description}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3, p: 1, backgroundColor: '#f0f7ff', borderRadius: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Total Calories
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c7873' }}>
              {plan.totalCalories} cal
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Meals per Day
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c7873' }}>
              {plan.meals ? plan.meals.length : 0}
            </Typography>
          </Box>
        </Box>
        
        {/* Render each meal with its items */}
        {plan.meals && plan.meals.length > 0 ? (
          <Box>
            {plan.meals.map((meal, index) => (
              <Box key={index}>
                {renderMealItems(meal)}
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
            No meals added to this plan yet.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default DietPlanCard;