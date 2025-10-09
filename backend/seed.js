const { sequelize, User, Customer, Barber, Service, LoyaltyRule } = require('./models');
require('dotenv').config();

const seedData = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ force: true });
    console.log('✅ Database synced');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@barbershop.com',
      phone: '+251911000001',
      password: 'admin123',
      role: 'admin',
      preferredLanguage: 'en'
    });
    console.log('✅ Admin user created');

    // Create staff users
    const staff1 = await User.create({
      name: 'Abebe Kebede',
      email: 'abebe@barbershop.com',
      phone: '+251911000002',
      password: 'staff123',
      role: 'staff',
      preferredLanguage: 'am'
    });

    const staff2 = await User.create({
      name: 'Chaltu Tadesse',
      email: 'chaltu@barbershop.com',
      phone: '+251911000003',
      password: 'staff123',
      role: 'staff',
      preferredLanguage: 'om'
    });
    console.log('✅ Staff users created');

    // Create customer users
    const customer1 = await User.create({
      name: 'Dawit Haile',
      email: 'dawit@example.com',
      phone: '+251911000004',
      password: 'customer123',
      role: 'customer',
      preferredLanguage: 'am'
    });

    const customer2 = await User.create({
      name: 'Sara Mohammed',
      email: 'sara@example.com',
      phone: '+251911000005',
      password: 'customer123',
      role: 'customer',
      preferredLanguage: 'om'
    });
    console.log('✅ Customer users created');

    // Create customer profiles
    const customerProfile1 = await Customer.create({
      userId: customer1.id,
      loyaltyPoints: 50,
      totalVisits: 5,
      totalSpent: 500
    });

    const customerProfile2 = await Customer.create({
      userId: customer2.id,
      loyaltyPoints: 30,
      totalVisits: 3,
      totalSpent: 300
    });
    console.log('✅ Customer profiles created');

    // Create barber profiles
    const barber1 = await Barber.create({
      userId: staff1.id,
      bio: 'Expert barber with 10 years of experience',
      specialties: ['haircut', 'shave', 'styling'],
      experience: 10,
      ratingAverage: 4.8,
      ratingCount: 45,
      availability: [
        { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 5, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 6, startTime: '10:00', endTime: '16:00' }
      ],
      isActive: true
    });

    const barber2 = await Barber.create({
      userId: staff2.id,
      bio: 'Specialized in modern styling and treatments',
      specialties: ['styling', 'treatment'],
      experience: 7,
      ratingAverage: 4.6,
      ratingCount: 32,
      availability: [
        { dayOfWeek: 1, startTime: '10:00', endTime: '19:00' },
        { dayOfWeek: 2, startTime: '10:00', endTime: '19:00' },
        { dayOfWeek: 3, startTime: '10:00', endTime: '19:00' },
        { dayOfWeek: 4, startTime: '10:00', endTime: '19:00' },
        { dayOfWeek: 5, startTime: '10:00', endTime: '19:00' }
      ],
      isActive: true
    });
    console.log('✅ Barber profiles created');

    // Create services
    const services = [
      {
        name: {
          am: 'መደበኛ ፀጉር መቁረጥ',
          om: 'Rifeensa Idilee',
          ti: 'ልሙድ ጸጉሪ ምቑራጽ',
          en: 'Regular Haircut'
        },
        description: {
          am: 'መደበኛ የፀጉር አስተካካይ አገልግሎት',
          om: 'Tajaajila sirreessuu rifeensa idilee',
          ti: 'ልሙድ ናይ ጸጉሪ ኣገልግሎት',
          en: 'Standard haircut service'
        },
        price: 150,
        duration: 30,
        category: 'haircut',
        loyaltyPoints: 15,
        popularity: 0,
        isActive: true
      },
      {
        name: {
          am: 'ልዩ ፀጉር መቁረጥ',
          om: 'Rifeensa Addaa',
          ti: 'ፍሉይ ጸጉሪ ምቑራጽ',
          en: 'Premium Haircut'
        },
        description: {
          am: 'ልዩ የፀጉር አስተካካይ አገልግሎት ከማሳጅ ጋር',
          om: 'Tajaajila sirreessuu rifeensa addaa waliin massage',
          ti: 'ፍሉይ ናይ ጸጉሪ ኣገልግሎት ምስ ማሳጅ',
          en: 'Premium haircut with massage'
        },
        price: 250,
        duration: 45,
        category: 'haircut',
        loyaltyPoints: 25,
        popularity: 0,
        isActive: true
      },
      {
        name: {
          am: 'ባህላዊ ፀጉር መላጨት',
          om: 'Haaduu Aadaa',
          ti: 'ባህላዊ ጸጉሪ ምላጭ',
          en: 'Traditional Shave'
        },
        description: {
          am: 'ባህላዊ የፀጉር መላጨት አገልግሎት',
          om: 'Tajaajila haaduu aadaa',
          ti: 'ባህላዊ ናይ ጸጉሪ ምላጭ ኣገልግሎት',
          en: 'Traditional shaving service'
        },
        price: 100,
        duration: 20,
        category: 'shave',
        loyaltyPoints: 10,
        popularity: 0,
        isActive: true
      },
      {
        name: {
          am: 'የፀጉር ማስተካከያ',
          om: 'Qophii Rifeensa',
          ti: 'ናይ ጸጉሪ ማስተካከያ',
          en: 'Hair Styling'
        },
        description: {
          am: 'ዘመናዊ የፀጉር ማስተካከያ',
          om: 'Qophii rifeensa ammayyaa',
          ti: 'ዘመናዊ ናይ ጸጉሪ ማስተካከያ',
          en: 'Modern hair styling'
        },
        price: 200,
        duration: 40,
        category: 'styling',
        loyaltyPoints: 20,
        popularity: 0,
        isActive: true
      },
      {
        name: {
          am: 'የፀጉር ህክምና',
          om: 'Yaalii Rifeensa',
          ti: 'ናይ ጸጉሪ ሕክምና',
          en: 'Hair Treatment'
        },
        description: {
          am: 'ልዩ የፀጉር ህክምና እና እንክብካቤ',
          om: 'Yaalii fi kunuunsa rifeensa addaa',
          ti: 'ፍሉይ ናይ ጸጉሪ ሕክምና',
          en: 'Special hair treatment and care'
        },
        price: 300,
        duration: 60,
        category: 'treatment',
        loyaltyPoints: 30,
        popularity: 0,
        isActive: true
      },
      {
        name: {
          am: 'ሙሉ ፓኬጅ',
          om: 'Paakeejii Guutuu',
          ti: 'ምሉእ ፓኬጅ',
          en: 'Complete Package'
        },
        description: {
          am: 'ፀጉር መቁረጥ፣ መላጨት እና ማስተካከያ',
          om: 'Rifeensa, haaduu fi qophii',
          ti: 'ጸጉሪ ምቑራጽ፣ ምላጭን ማስተካከያን',
          en: 'Haircut, shave and styling'
        },
        price: 400,
        duration: 90,
        category: 'package',
        loyaltyPoints: 50,
        popularity: 0,
        isActive: true
      }
    ];

    for (const serviceData of services) {
      await Service.create(serviceData);
    }
    console.log('✅ Services created');

    // Create loyalty rules
    await LoyaltyRule.create({
      name: 'Bronze Member',
      type: 'visit-count',
      threshold: 5,
      rewardType: 'percentage',
      rewardValue: 10,
      expiryDays: 30,
      isActive: true
    });

    await LoyaltyRule.create({
      name: 'Silver Member',
      type: 'visit-count',
      threshold: 10,
      rewardType: 'percentage',
      rewardValue: 15,
      expiryDays: 60,
      isActive: true
    });

    await LoyaltyRule.create({
      name: 'Gold Member',
      type: 'amount-spent',
      threshold: 1000,
      rewardType: 'percentage',
      rewardValue: 20,
      expiryDays: 90,
      isActive: true
    });
    console.log('✅ Loyalty rules created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('Admin: admin@barbershop.com / admin123');
    console.log('Staff: abebe@barbershop.com / staff123');
    console.log('Customer: dawit@example.com / customer123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
