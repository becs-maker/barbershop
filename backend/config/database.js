const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'barbershop',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connected');
    
    // Database sync disabled - use migrations or seed scripts to manage schema
    // Uncomment below if you need to sync models with database:
    // await sequelize.sync(); // Creates tables if they don't exist
    // await sequelize.sync({ alter: true }); // Updates existing tables to match models
    // await sequelize.sync({ force: true }); // Drops and recreates all tables (DANGER!)
  } catch (error) {
    console.error('❌ MySQL Connection Error:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
