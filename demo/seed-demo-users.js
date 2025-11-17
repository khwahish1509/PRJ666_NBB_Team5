/**
 * Demo User Seed Script
 * 
 * This script creates demo user accounts and pre-populates scan history
 * for the DermoScanner Sprint 3 demo presentation.
 * 
 * Usage:
 *   node demo/seed-demo-users.js
 * 
 * Requirements:
 *   - MongoDB connection configured in .env
 *   - Server dependencies installed (npm install)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../dermoscanners/server/.env') });

// Import models
const User = require('../dermoscanners/server/models/User');
const Scan = require('../dermoscanners/server/models/Scan');

// Demo user data
const demoUsers = [
  {
    name: 'Sarah Thompson',
    email: 'sarah.thompson.demo@dermoscanner.com',
    password: 'DemoPass2024!',
    age: 32,
    role: 'user'
  },
  {
    name: 'Test User',
    email: 'test.user@dermoscanner.com',
    password: 'TestPass2024!',
    age: 28,
    role: 'user'
  },
  {
    name: 'Power User',
    email: 'power.user@dermoscanner.com',
    password: 'PowerPass2024!',
    age: 45,
    role: 'user'
  }
];

// Sarah's scan history (pre-populated for demo)
const getSarahScans = (userId) => {
  const now = new Date();
  
  return [
    {
      userId,
      result: 'benign',
      confidence: 0.87,
      processingTime: 3200,
      notes: 'New mole on left forearm - first scan',
      timestamp: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      imageUrl: '/uploads/demo-scan-1.jpg'
    },
    {
      userId,
      result: 'benign',
      confidence: 0.89,
      processingTime: 3100,
      notes: 'Follow-up scan - no visible changes',
      timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      imageUrl: '/uploads/demo-scan-2.jpg'
    },
    {
      userId,
      result: 'benign',
      confidence: 0.85,
      processingTime: 3300,
      notes: 'Checking after sun exposure',
      timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      imageUrl: '/uploads/demo-scan-3.jpg'
    },
    {
      userId,
      result: 'suspicious',
      confidence: 0.72,
      processingTime: 3400,
      notes: 'Slight color change noticed - scheduling doctor appointment',
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      imageUrl: '/uploads/demo-scan-4.jpg'
    },
    {
      userId,
      result: 'benign',
      confidence: 0.88,
      processingTime: 3150,
      notes: 'Pre-appointment scan for doctor records',
      timestamp: now, // Today
      imageUrl: '/uploads/demo-scan-5.jpg'
    }
  ];
};

// Power user's extensive scan history
const getPowerUserScans = (userId) => {
  const now = new Date();
  const scans = [];
  
  // Generate 20 scans over 3 months
  for (let i = 0; i < 20; i++) {
    const daysAgo = Math.floor(Math.random() * 90); // Random day in last 90 days
    const results = ['benign', 'benign', 'benign', 'suspicious']; // 75% benign, 25% suspicious
    const result = results[Math.floor(Math.random() * results.length)];
    const confidence = result === 'benign' 
      ? 0.75 + Math.random() * 0.2  // 0.75-0.95 for benign
      : 0.60 + Math.random() * 0.25; // 0.60-0.85 for suspicious
    
    scans.push({
      userId,
      result,
      confidence: Math.round(confidence * 100) / 100,
      processingTime: 3000 + Math.floor(Math.random() * 500),
      notes: `Routine monitoring scan #${i + 1}`,
      timestamp: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000),
      imageUrl: `/uploads/demo-power-scan-${i + 1}.jpg`
    });
  }
  
  // Sort by timestamp (oldest first)
  return scans.sort((a, b) => a.timestamp - b.timestamp);
};

/**
 * Connect to MongoDB
 */
async function connectDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/dermoscanner';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

/**
 * Create demo users
 */
async function createDemoUsers() {
  console.log('\n📝 Creating demo users...');
  
  const createdUsers = [];
  
  for (const userData of demoUsers) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️  User already exists: ${userData.email}`);
        createdUsers.push(existingUser);
        continue;
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create user
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      
      console.log(`✅ Created user: ${user.email} (ID: ${user._id})`);
      createdUsers.push(user);
      
    } catch (error) {
      console.error(`❌ Error creating user ${userData.email}:`, error.message);
    }
  }
  
  return createdUsers;
}

/**
 * Seed scan history for demo users
 */
async function seedScanHistory(users) {
  console.log('\n📊 Seeding scan history...');
  
  // Find Sarah's user account
  const sarah = users.find(u => u.email === 'sarah.thompson.demo@dermoscanner.com');
  if (sarah) {
    try {
      // Delete existing scans for Sarah
      await Scan.deleteMany({ userId: sarah._id });
      
      // Create Sarah's scan history
      const sarahScans = getSarahScans(sarah._id);
      await Scan.insertMany(sarahScans);
      
      console.log(`✅ Created ${sarahScans.length} scans for Sarah Thompson`);
    } catch (error) {
      console.error('❌ Error seeding Sarah\'s scans:', error.message);
    }
  }
  
  // Find Power User's account
  const powerUser = users.find(u => u.email === 'power.user@dermoscanner.com');
  if (powerUser) {
    try {
      // Delete existing scans for Power User
      await Scan.deleteMany({ userId: powerUser._id });
      
      // Create Power User's scan history
      const powerUserScans = getPowerUserScans(powerUser._id);
      await Scan.insertMany(powerUserScans);
      
      console.log(`✅ Created ${powerUserScans.length} scans for Power User`);
    } catch (error) {
      console.error('❌ Error seeding Power User\'s scans:', error.message);
    }
  }
  
  // Test User has no scans (empty history for new user demo)
  const testUser = users.find(u => u.email === 'test.user@dermoscanner.com');
  if (testUser) {
    await Scan.deleteMany({ userId: testUser._id });
    console.log('✅ Test User has empty scan history (new user experience)');
  }
}

/**
 * Verify demo data
 */
async function verifyDemoData() {
  console.log('\n🔍 Verifying demo data...');
  
  for (const userData of demoUsers) {
    const user = await User.findOne({ email: userData.email });
    
    if (!user) {
      console.log(`❌ User not found: ${userData.email}`);
      continue;
    }
    
    const scanCount = await Scan.countDocuments({ userId: user._id });
    console.log(`✅ ${user.name}: ${scanCount} scans`);
  }
}

/**
 * Display demo credentials
 */
function displayCredentials() {
  console.log('\n' + '='.repeat(60));
  console.log('DEMO CREDENTIALS');
  console.log('='.repeat(60));
  
  demoUsers.forEach(user => {
    console.log(`\n${user.name}:`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Password: ${user.password}`);
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('⚠️  These credentials are for demo purposes only!');
  console.log('⚠️  Do not use in production or share publicly.');
  console.log('='.repeat(60) + '\n');
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 DermoScanner Demo User Seed Script');
  console.log('=====================================\n');
  
  try {
    // Connect to database
    await connectDatabase();
    
    // Create demo users
    const users = await createDemoUsers();
    
    if (users.length === 0) {
      console.log('\n❌ No users created. Exiting.');
      process.exit(1);
    }
    
    // Seed scan history
    await seedScanHistory(users);
    
    // Verify data
    await verifyDemoData();
    
    // Display credentials
    displayCredentials();
    
    console.log('✅ Demo data seeded successfully!\n');
    
  } catch (error) {
    console.error('\n❌ Error seeding demo data:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { createDemoUsers, seedScanHistory };
