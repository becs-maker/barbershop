require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  let connection;
  
  try {
    console.log('🌱 Starting database seed...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    });
    
    console.log('✅ Connected to MySQL');

    // Drop tables
    await connection.execute(`DROP TABLE IF EXISTS Appointments`);
    await connection.execute(`DROP TABLE IF EXISTS Expenses`);
    await connection.execute(`DROP TABLE IF EXISTS LoyaltyRules`);
    await connection.execute(`DROP TABLE IF EXISTS Barbers`);
    await connection.execute(`DROP TABLE IF EXISTS Customers`);
    await connection.execute(`DROP TABLE IF EXISTS Services`);
    await connection.execute(`DROP TABLE IF EXISTS Users`);
    
    // Create Users table
    await connection.execute(`
      CREATE TABLE Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('customer', 'staff', 'admin') DEFAULT 'customer',
        preferredLanguage ENUM('am', 'om', 'ti', 'en') DEFAULT 'am',
        isActive BOOLEAN DEFAULT true,
        avatar VARCHAR(255) DEFAULT '',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create Customers table
    await connection.execute(`
      CREATE TABLE Customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL UNIQUE,
        loyaltyPoints INT DEFAULT 0,
        totalVisits INT DEFAULT 0,
        totalSpent DECIMAL(10,2) DEFAULT 0,
        referralCode VARCHAR(20) UNIQUE,
        referredBy INT,
        visitHistory JSON,
        discountsEarned JSON,
        preferences JSON,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES Users(id)
      )
    `);
    
    // Create Services table
    await connection.execute(`
      CREATE TABLE Services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name JSON NOT NULL,
        description JSON,
        price DECIMAL(10,2) NOT NULL,
        duration INT NOT NULL,
        category ENUM('haircut', 'shave', 'styling', 'treatment', 'package') NOT NULL,
        image VARCHAR(255) DEFAULT '',
        isActive BOOLEAN DEFAULT true,
        loyaltyPoints INT DEFAULT 10,
        popularity INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create Barbers table
    await connection.execute(`
      CREATE TABLE Barbers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL UNIQUE,
        bio TEXT,
        specialties JSON,
        experience INT DEFAULT 0,
        ratingAverage DECIMAL(2,1) DEFAULT 0,
        ratingCount INT DEFAULT 0,
        availability JSON,
        blockedDates JSON,
        photos JSON,
        isActive BOOLEAN DEFAULT true,
        totalAppointments INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES Users(id)
      )
    `);
    
    console.log('✅ Tables created');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Insert admin user
    await connection.execute(`
      INSERT INTO Users (name, email, phone, password, role, preferredLanguage)
      VALUES ('Admin User', 'admin@barbershop.com', '+251911000001', ?, 'admin', 'en')
    `, [hashedPassword]);
    
    // Insert staff users
    const staffPassword = await bcrypt.hash('staff123', 10);
    const [staff1Result] = await connection.execute(`
      INSERT INTO Users (name, email, phone, password, role, preferredLanguage)
      VALUES ('Abebe Kebede', 'abebe@barbershop.com', '+251911000002', ?, 'staff', 'am')
    `, [staffPassword]);
    
    const [staff2Result] = await connection.execute(`
      INSERT INTO Users (name, email, phone, password, role, preferredLanguage)
      VALUES ('Chaltu Tadesse', 'chaltu@barbershop.com', '+251911000003', ?, 'staff', 'om')
    `, [staffPassword]);
    
    console.log('✅ Users created');
    
    // Insert customer users
    const customerPassword = await bcrypt.hash('customer123', 10);
    const [customer1Result] = await connection.execute(`
      INSERT INTO Users (name, email, phone, password, role, preferredLanguage)
      VALUES ('Dawit Haile', 'dawit@example.com', '+251911000004', ?, 'customer', 'am')
    `, [customerPassword]);
    
    const [customer2Result] = await connection.execute(`
      INSERT INTO Users (name, email, phone, password, role, preferredLanguage)
      VALUES ('Sara Mohammed', 'sara@example.com', '+251911000005', ?, 'customer', 'om')
    `, [customerPassword]);
    
    // Insert customer profiles
    await connection.execute(`
      INSERT INTO Customers (userId, loyaltyPoints, totalVisits, totalSpent, referralCode)
      VALUES (?, 50, 5, 500, 'REF001')
    `, [customer1Result.insertId]);
    
    await connection.execute(`
      INSERT INTO Customers (userId, loyaltyPoints, totalVisits, totalSpent, referralCode)
      VALUES (?, 30, 3, 300, 'REF002')
    `, [customer2Result.insertId]);
    
    console.log('✅ Customers created');
    
    // Insert barber profiles
    const availability = JSON.stringify([
      { dayOfWeek: 0, startTime: '10:00', endTime: '15:00' }, // Sunday
      { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' }, // Monday
      { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' }, // Tuesday
      { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' }, // Wednesday
      { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' }, // Thursday
      { dayOfWeek: 5, startTime: '09:00', endTime: '18:00' }, // Friday
      { dayOfWeek: 6, startTime: '10:00', endTime: '16:00' }  // Saturday
    ]);
    
    await connection.execute(`
      INSERT INTO Barbers (userId, bio, specialties, experience, ratingAverage, ratingCount, availability, isActive)
      VALUES (?, 'Expert barber with 10 years of experience', ?, 10, 4.8, 45, ?, true)
    `, [staff1Result.insertId, JSON.stringify(['haircut', 'shave', 'styling']), availability]);
    
    await connection.execute(`
      INSERT INTO Barbers (userId, bio, specialties, experience, ratingAverage, ratingCount, availability, isActive)
      VALUES (?, 'Specialized in modern styling and treatments', ?, 7, 4.6, 32, ?, true)
    `, [staff2Result.insertId, JSON.stringify(['styling', 'treatment']), availability]);
    
    console.log('✅ Barbers created');
    
    // Insert services
    const services = [
      {
        name: JSON.stringify({ am: 'መደበኛ ፀጉር መቁረጥ', om: 'Rifeensa Idilee', ti: 'ልሙድ ጸጉሪ ምቑራጽ', en: 'Regular Haircut' }),
        description: JSON.stringify({ am: 'መደበኛ የፀጉር አስተካካይ አገልግሎት', om: 'Tajaajila sirreessuu rifeensa idilee', ti: 'ልሙድ ናይ ጸጉሪ ኣገልግሎት', en: 'Standard haircut service' }),
        price: 150,
        duration: 30,
        category: 'haircut',
        loyaltyPoints: 15
      },
      {
        name: JSON.stringify({ am: 'ልዩ ፀጉር መቁረጥ', om: 'Rifeensa Addaa', ti: 'ፍሉይ ጸጉሪ ምቑራጽ', en: 'Premium Haircut' }),
        description: JSON.stringify({ am: 'ልዩ የፀጉር አስተካካይ አገልግሎት ከማሳጅ ጋር', om: 'Tajaajila sirreessuu rifeensa addaa waliin massage', ti: 'ፍሉይ ናይ ጸጉሪ ኣገልግሎት ምስ ማሳጅ', en: 'Premium haircut with massage' }),
        price: 250,
        duration: 45,
        category: 'haircut',
        loyaltyPoints: 25
      },
      {
        name: JSON.stringify({ am: 'ባህላዊ ፀጉር መላጨት', om: 'Haaduu Aadaa', ti: 'ባህላዊ ጸጉሪ ምላጭ', en: 'Traditional Shave' }),
        description: JSON.stringify({ am: 'ባህላዊ የፀጉር መላጨት አገልግሎት', om: 'Tajaajila haaduu aadaa', ti: 'ባህላዊ ናይ ጸጉሪ ምላጭ ኣገልግሎት', en: 'Traditional shaving service' }),
        price: 100,
        duration: 20,
        category: 'shave',
        loyaltyPoints: 10
      },
      {
        name: JSON.stringify({ am: 'የፀጉር ማስተካከያ', om: 'Qophii Rifeensa', ti: 'ናይ ጸጉሪ ማስተካከያ', en: 'Hair Styling' }),
        description: JSON.stringify({ am: 'ዘመናዊ የፀጉር ማስተካከያ', om: 'Qophii rifeensa ammayyaa', ti: 'ዘመናዊ ናይ ጸጉሪ ማስተካከያ', en: 'Modern hair styling' }),
        price: 200,
        duration: 40,
        category: 'styling',
        loyaltyPoints: 20
      },
      {
        name: JSON.stringify({ am: 'የፀጉር ህክምና', om: 'Yaalii Rifeensa', ti: 'ናይ ጸጉሪ ሕክምና', en: 'Hair Treatment' }),
        description: JSON.stringify({ am: 'ልዩ የፀጉር ህክምና እና እንክብካቤ', om: 'Yaalii fi kunuunsa rifeensa addaa', ti: 'ፍሉይ ናይ ጸጉሪ ሕክምና', en: 'Special hair treatment and care' }),
        price: 300,
        duration: 60,
        category: 'treatment',
        loyaltyPoints: 30
      },
      {
        name: JSON.stringify({ am: 'ሙሉ ፓኬጅ', om: 'Paakeejii Guutuu', ti: 'ምሉእ ፓኬጅ', en: 'Complete Package' }),
        description: JSON.stringify({ am: 'ፀጉር መቁረጥ፣ መላጨት እና ማስተካከያ', om: 'Rifeensa, haaduu fi qophii', ti: 'ጸጉሪ ምቑራጽ፣ ምላጭን ማስተካከያን', en: 'Haircut, shave and styling' }),
        price: 400,
        duration: 90,
        category: 'package',
        loyaltyPoints: 50
      }
    ];
    
    for (const service of services) {
      await connection.execute(`
        INSERT INTO Services (name, description, price, duration, category, loyaltyPoints, isActive)
        VALUES (?, ?, ?, ?, ?, ?, true)
      `, [service.name, service.description, service.price, service.duration, service.category, service.loyaltyPoints]);
    }
    
    console.log('✅ Services created');
    
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('Admin: admin@barbershop.com / admin123');
    console.log('Staff: abebe@barbershop.com / staff123');
    console.log('Customer: dawit@example.com / customer123');
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

seedDatabase();
