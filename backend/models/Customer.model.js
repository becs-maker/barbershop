const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Customer = sequelize.define('Customer', {
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
  loyaltyPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalVisits: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalSpent: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  referralCode: {
    type: DataTypes.STRING(20),
    unique: true
  },
  referredBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Customers',
      key: 'id'
    }
  },
  visitHistory: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  discountsEarned: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  preferences: {
    type: DataTypes.JSON,
    defaultValue: {
      favoriteBarber: null,
      favoriteServices: [],
      notificationPreferences: {
        email: true,
        sms: true,
        whatsapp: false
      }
    }
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (customer) => {
      if (!customer.referralCode) {
        customer.referralCode = 'REF' + Math.random().toString(36).substr(2, 9).toUpperCase();
      }
    }
  }
});

module.exports = Customer;
