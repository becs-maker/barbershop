require('dotenv').config();
const mysql = require('mysql2/promise');

async function listUsers() {
  let connection;
  
  try {
    console.log('📋 Fetching all users from database...\n');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    const [users] = await connection.execute(`
      SELECT 
        id,
        name,
        email,
        phone,
        role,
        preferredLanguage,
        isActive,
        createdAt
      FROM Users
      ORDER BY role, name
    `);
    
    if (users.length === 0) {
      console.log('No users found in database.');
    } else {
      console.log(`Found ${users.length} users:\n`);
      console.log('='.repeat(100));
      
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Phone: ${user.phone}`);
        console.log(`   Role: ${user.role.toUpperCase()}`);
        console.log(`   Language: ${user.preferredLanguage}`);
        console.log(`   Active: ${user.isActive ? 'Yes' : 'No'}`);
        console.log(`   Created: ${user.createdAt}`);
      });
      
      console.log('\n' + '='.repeat(100));
      
      // Summary by role
      const roleCount = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});
      
      console.log('\n📊 Summary by Role:');
      Object.entries(roleCount).forEach(([role, count]) => {
        console.log(`   ${role.toUpperCase()}: ${count}`);
      });
    }
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

listUsers();
