require('dotenv').config();
const { Admin, connectDB } = require('../src/models-sql');

/**
 * Script to create the initial admin user
 * Usage: node scripts/createAdmin.js
 */
const createAdmin = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();
    
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@makeplus.com';
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { email: adminEmail } });
    
    if (existingAdmin) {
      console.log('⚠️  Admin already exists!');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Name: ${existingAdmin.name}`);
      console.log('\nTo create a new admin, change the DEFAULT_ADMIN_EMAIL in your .env file');
      process.exit(0);
    }
    
    // Create new admin
    const admin = await Admin.create({
      email: adminEmail,
      password: process.env.DEFAULT_ADMIN_PASSWORD || 'ChangeThisPassword123!',
      name: process.env.DEFAULT_ADMIN_NAME || 'Makeplus Admin',
      role: 'superadmin'
    });
    
    console.log('\n✅ Admin created successfully!');
    console.log('═══════════════════════════════════════');
    console.log(`Email: ${admin.email}`);
    console.log(`Name: ${admin.name}`);
    console.log(`Role: ${admin.role}`);
    console.log('═══════════════════════════════════════');
    console.log('\n⚠️  IMPORTANT SECURITY NOTICE:');
    console.log('1. Change the default password immediately after first login');
    console.log('2. Remove DEFAULT_ADMIN_PASSWORD from your .env file');
    console.log('3. Never commit your .env file to version control');
    console.log('\nYou can now login at: /api/admin/login\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    
    if (error.code === 11000) {
      console.log('\nThis email is already in use. Please use a different email.');
    }
    
    process.exit(1);
  }
};

// Run the script
createAdmin();
