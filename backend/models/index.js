const sequelize = require('../config/database');
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
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synced successfully');
  } catch (error) {
    console.error('❌ Error syncing database models:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Runner,
  syncDatabase
};