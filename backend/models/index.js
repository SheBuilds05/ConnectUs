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
    //Use alter await sequelize.sync({ alter: true });
    await sequelize.sync({ 
      alter: {
        drop: false // Don't drop columns
      }
    });
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