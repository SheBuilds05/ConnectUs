const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const Runner = sequelize.define('Runner', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    // This connects the Runner back to the User Primary Key
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users', // Matches the table name
            key: 'id'
        }
    },
    penaltyPoints: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.ENUM('active', 'suspended'), defaultValue: 'active' },
    notices: { type: DataTypes.JSON, defaultValue: [] }
});

module.exports = Runner;