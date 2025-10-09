const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Barber = sequelize.define('Barber', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  specialties: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  experience: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  ratingAverage: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0
  },
  ratingCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  availability: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  blockedDates: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  photos: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  totalAppointments: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true
});

module.exports = Barber;
