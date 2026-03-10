const sequelize = require('../config/database'); // Match your actual filename
const User = require('./User');
const Runner = require('./Runner');

// --- DEFINE RELATIONSHIPS ---
// This tells Postgres: "Every Runner must have a User ID"
User.hasOne(Runner, { 
    foreignKey: 'userId', 
    onDelete: 'CASCADE' 
});

Runner.belongsTo(User, { 
    foreignKey: 'userId' 
});

// Export everything so you can import them easily in your controllers
module.exports = {
    sequelize,
    User,
    Runner
};