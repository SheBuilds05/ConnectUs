const { sequelize } = require('../config/database'); // CHANGE THIS LINE
const User = require('./User');
const Runner = require('./Runner');

// Define associations
User.hasOne(Runner, {
  foreignKey: 'user_id',
  as: 'runnerProfile'
});

Runner.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

const syncDatabase = async () => {
    try {
        // Don't sync all at once, sync in a specific order
        await sequelize.query('CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255), phone VARCHAR(20), role VARCHAR(50) DEFAULT \'customer\', "isActive" BOOLEAN DEFAULT true, "lastLogin" TIMESTAMP)');
        console.log('✅ Database Models Synced');
    } catch (error) {
        console.error('❌ Error syncing database models:', error);
        throw error;
    }
};

module.exports = {
  sequelize,
  User,
  Runner,
  syncDatabase
};