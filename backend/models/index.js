const { sequelize } = require('../config/database');
const User = require('./User.model');
const Customer = require('./Customer.model');
const Barber = require('./Barber.model');
const Service = require('./Service.model');
const Appointment = require('./Appointment.model');
const LoyaltyRule = require('./LoyaltyRule.model');
const Expense = require('./Expense.model');

// Define relationships

// User -> Customer (One-to-One)
User.hasOne(Customer, { foreignKey: 'userId', as: 'customerProfile' });
Customer.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User -> Barber (One-to-One)
User.hasOne(Barber, { foreignKey: 'userId', as: 'barberProfile' });
Barber.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Appointment relationships
Appointment.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Appointment.belongsTo(Barber, { foreignKey: 'barberId', as: 'barber' });
Appointment.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });

// Customer relationships
Customer.hasMany(Appointment, { foreignKey: 'customerId', as: 'appointments' });
Customer.belongsTo(Customer, { foreignKey: 'referredBy', as: 'referrer' });

// Barber relationships
Barber.hasMany(Appointment, { foreignKey: 'barberId', as: 'appointments' });

// Service relationships
Service.hasMany(Appointment, { foreignKey: 'serviceId', as: 'appointments' });

// Expense relationships
Expense.belongsTo(User, { foreignKey: 'addedBy', as: 'addedByUser' });

module.exports = {
  sequelize,
  User,
  Customer,
  Barber,
  Service,
  Appointment,
  LoyaltyRule,
  Expense
};
