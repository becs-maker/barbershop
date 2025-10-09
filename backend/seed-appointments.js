require('dotenv').config();
const mysql = require('mysql2/promise');

async function seedAppointments() {
  let connection;
  
  try {
    console.log('🌱 Adding test appointments and expenses...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    console.log('✅ Connected to MySQL');

    // Add some completed appointments
    const appointments = [
      { customerId: 1, barberId: 1, serviceId: 1, date: '2025-10-01', startTime: '10:00', endTime: '10:30', price: 150, finalPrice: 150, status: 'completed', paymentStatus: 'paid' },
      { customerId: 1, barberId: 2, serviceId: 2, date: '2025-10-02', startTime: '11:00', endTime: '11:45', price: 250, finalPrice: 250, status: 'completed', paymentStatus: 'paid' },
      { customerId: 2, barberId: 1, serviceId: 3, date: '2025-10-03', startTime: '14:00', endTime: '14:20', price: 100, finalPrice: 100, status: 'completed', paymentStatus: 'paid' },
      { customerId: 2, barberId: 2, serviceId: 4, date: '2025-10-04', startTime: '15:00', endTime: '15:40', price: 200, finalPrice: 200, status: 'confirmed', paymentStatus: 'pending' },
      { customerId: 1, barberId: 1, serviceId: 5, date: '2025-10-05', startTime: '10:00', endTime: '11:00', price: 300, finalPrice: 300, status: 'confirmed', paymentStatus: 'pending' }
    ];

    for (const apt of appointments) {
      await connection.execute(`
        INSERT INTO Appointments (customerId, barberId, serviceId, date, startTime, endTime, price, finalPrice, status, paymentStatus, discountApplied, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())
      `, [apt.customerId, apt.barberId, apt.serviceId, apt.date, apt.startTime, apt.endTime, apt.price, apt.finalPrice, apt.status, apt.paymentStatus]);
    }
    
    console.log('✅ Test appointments created');

    // Add some expenses
    const expenses = [
      { category: 'rent', amount: 5000, description: 'Monthly shop rent', date: '2025-10-01', addedBy: 1 },
      { category: 'utilities', amount: 500, description: 'Electricity and water', date: '2025-10-02', addedBy: 1 },
      { category: 'supplies', amount: 800, description: 'Hair products and tools', date: '2025-10-03', addedBy: 1 },
      { category: 'salary', amount: 3000, description: 'Staff salaries', date: '2025-10-01', addedBy: 1 }
    ];

    for (const exp of expenses) {
      await connection.execute(`
        INSERT INTO Expenses (category, amount, description, date, addedBy, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      `, [exp.category, exp.amount, exp.description, exp.date, exp.addedBy]);
    }
    
    console.log('✅ Test expenses created');
    
    console.log('\n🎉 Test data seeded successfully!');
    console.log('\nDashboard should now show:');
    console.log('- Revenue: 700 ETB (3 completed appointments)');
    console.log('- Expenses: 9,300 ETB');
    console.log('- Profit: -8,600 ETB');
    console.log('- Total Bookings: 5');
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

seedAppointments();
