const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config();

async function createAdmin() {
  try {
    // Validate required environment variables
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cyberedu';
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      throw new Error('ADMIN_PASSWORD environment variable is required');
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      password: String,
      firstName: String,
      lastName: String,
      role: String,
      status: String,
      isActive: Boolean,
      isVerified: Boolean,
      createdAt: Date,
      updatedAt: Date,
    }));

    const adminUser = new User({
      email: 'admin@cyberedu.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Admin',
      role: 'admin',
      status: 'active',
      isActive: true,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@cyberedu.com');
    console.log('Password: [REDACTED - Check ADMIN_PASSWORD env var]');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdmin();