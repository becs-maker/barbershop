const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LoyaltyRule = sequelize.define('LoyaltyRule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('visit-count', 'amount-spent', 'points'),
    allowNull: false
  },
  threshold: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rewardType: {
    type: DataTypes.ENUM('percentage', 'fixed', 'free-service'),
    allowNull: false
  },
  rewardValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  rewardServiceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Services',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  expiryDays: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  }
}, {
  timestamps: true
});

module.exports = LoyaltyRule;
