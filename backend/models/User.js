const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    identityNumber: { 
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: function(v) {
                return /^\d{13}$/.test(v); // Basic 13-digit check
            },
            message: props => `${props.value} is not a valid 13-digit ID!`
        }
    },
    role: { type: String, enum: ['user', 'admin', 'runner'], default: 'user' },
    penaltyPoints: { type: Number, default: 0 },
    notices: [{ message: String, date: { type: Date, default: Date.now } }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);