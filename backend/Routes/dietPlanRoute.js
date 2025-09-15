const express = require('express');
const router = express.Router();
const dietPlanController = require('../Controllers/dietPlanController.js');
const auth = require('../Auth/auth.js');

router.post('/add', auth, dietPlanController.addDietPlan);
router.get('/all', auth, dietPlanController.getAllDietPlans);
router.get('/get-plan/:id', auth, dietPlanController.getDietPlanById);
router.put('/update/:id', auth, dietPlanController.updateDietPlan);
router.delete('/delete/:id', auth, dietPlanController.deleteDietPlan);

module.exports = router;