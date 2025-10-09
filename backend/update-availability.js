require('dotenv').config();
const mysql = require('mysql2/promise');

async function updateAvailability() {
  let connection;
  
  try {
    console.log('🔄 Updating barber availability...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    console.log('✅ Connected to MySQL');

    const availability = JSON.stringify([
      { dayOfWeek: 0, startTime: '10:00', endTime: '15:00' }, // Sunday
      { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' }, // Monday
      { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' }, // Tuesday
      { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' }, // Wednesday
      { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' }, // Thursday
      { dayOfWeek: 5, startTime: '09:00', endTime: '18:00' }, // Friday
      { dayOfWeek: 6, startTime: '10:00', endTime: '16:00' }  // Saturday
    ]);

    // Update all barbers
    await connection.execute(`
      UPDATE Barbers SET availability = ?
    `, [availability]);
    
    console.log('✅ Barber availability updated to include all days of the week');
    console.log('📅 Barbers now available:');
    console.log('   - Sunday: 10:00 AM - 3:00 PM');
    console.log('   - Monday-Friday: 9:00 AM - 6:00 PM');
    console.log('   - Saturday: 10:00 AM - 4:00 PM');
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Update error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

updateAvailability();
