const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    mealName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true,
        min: 0
    }
});

const dietPlanSchema = new mongoose.Schema({
    gym: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
        required: true
    },
    planName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    meals: [mealSchema],
    totalCalories: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('DietPlan', dietPlanSchema);