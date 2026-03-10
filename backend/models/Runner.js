const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Runner = sequelize.define('Runner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_available'
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  totalDeliveries: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_deliveries'
  },
  vehicleType: {
    type: DataTypes.ENUM('bicycle', 'motorcycle', 'car', 'foot'),
    allowNull: true,
    field: 'vehicle_type'
  },
  vehiclePlate: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'vehicle_plate'
  },
  serviceArea: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'service_area'
  },
  completedTrips: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'completed_trips'
  },
  totalEarnings: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    field: 'total_earnings'
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'runners'
});

module.exports = Runner;