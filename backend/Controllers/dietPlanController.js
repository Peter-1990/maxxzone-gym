const dietPlan = require('../Models/dietPlan.js');


// Add a new diet plan
exports.addDietPlan = async (req, res) => {
    console.log('Incoming request body:', req.body);
    try {
        const { planName, description, meals, totalCalories } = req.body;
        const gymId = req.gym._id; // Assuming req.gym._id is available from authentication middleware

        // Basic validation for meals and totalCalories
        if (!Array.isArray(meals) || meals.length === 0) {
            return res.status(400).json({ error: "Meals array is required and cannot be empty." });
        }
        if (typeof totalCalories !== 'number' || totalCalories < 0) {
            return res.status(400).json({ error: "Total calories must be a non-negative number." });
        }

        const newDietPlan = new dietPlan({
            gym: gymId,
            planName,
            description,
            meals,
            totalCalories
        });

        await newDietPlan.save();
        res.status(201).json({ message: "Diet plan added successfully", data: newDietPlan });
    } catch (error) {
        console.error(error);
        // Handle Mongoose validation errors specifically
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: errors.join(', ') });
        }
        res.status(500).json({ error: "Server Error" });
    }
};

// Get all diet plans for a specific gym
exports.getAllDietPlans = async (req, res) => {
    try {
        const gymId = req.gym._id;
        const dietPlans = await dietPlan.find({ gym: gymId }).sort({ createdAt: -1 });

        res.status(200).json({
            message: dietPlans.length ? "Diet plans fetched successfully" : "No diet plans found for this gym",
            dietPlans: dietPlans,
            totalDietPlans: dietPlans.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

// Get a single diet plan by ID
exports.getDietPlanById = async (req, res) => {
    try {
        const { id } = req.params;
        const gymId = req.gym._id;

        const DietPlan = await dietPlan.findOne({ _id: id, gym: gymId });

        if (!dietPlan) {
            return res.status(404).json({ error: "Diet plan not found" });
        }
        res.status(200).json({ message: "Diet plan fetched successfully", dietPlan: DietPlan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

// Update a diet plan
exports.updateDietPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { planName, description, meals, totalCalories } = req.body;
        const gymId = req.gym._id;

        // Basic validation for meals and totalCalories if they are provided
        if (meals && (!Array.isArray(meals) || meals.length === 0)) {
            return res.status(400).json({ error: "Meals array cannot be empty if provided." });
        }
        if (totalCalories !== undefined && (typeof totalCalories !== 'number' || totalCalories < 0)) {
            return res.status(400).json({ error: "Total calories must be a non-negative number if provided." });
        }

        const updateFields = { planName, description };
        if (meals) updateFields.meals = meals;
        if (totalCalories !== undefined) updateFields.totalCalories = totalCalories;

        const DietPlan = await dietPlan.findOneAndUpdate(
            { _id: id, gym: gymId },
            updateFields,
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        if (!dietPlan) {
            return res.status(404).json({ error: "Diet plan not found or you don't have permission to update it" });
        }
        res.status(200).json({ message: "Diet plan updated successfully", dietPlan: DietPlan });
    } catch (error) {
        console.error(error);
        // Handle Mongoose validation errors specifically
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: errors.join(', ') });
        }
        res.status(500).json({ error: "Server Error" });
    }
};

// Delete a diet plan
exports.deleteDietPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const gymId = req.gym._id;

        const DietPlan = await dietPlan.findOneAndDelete({ _id: id, gym: gymId });

        if (!dietPlan) {
            return res.status(404).json({ error: "Diet plan not found or you don't have permission to delete it" });
        }
        res.status(200).json({ message: "Diet plan deleted successfully", dietPlan: DietPlan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};
