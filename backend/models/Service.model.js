const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Multilingual name: {am, om, ti, en}'
  },
  description: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Multilingual description: {am, om, ti, en}'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duration in minutes'
  },
  category: {
    type: DataTypes.ENUM('haircut', 'shave', 'styling', 'treatment', 'package'),
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  loyaltyPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  popularity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true
});

module.exports = Service;
