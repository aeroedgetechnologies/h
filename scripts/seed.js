import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import LiveStream from '../src/models/LiveStream.js';
import WalletRequest from '../src/models/WalletRequest.js';
import Admin from '../src/models/Admin.js';

// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/new-dashboard';
const MONGODB_URI = 'mongodb+srv://govindayadav2478:gCFF1B4CCTljTgL9@cluster0.vsf7qx5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Generate realistic user data
const generateUsers = (count) => {
  const users = [];
  const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Kate', 'Liam', 'Mia', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Ruby', 'Sam', 'Tara', 'Uma', 'Victor', 'Wendy', 'Xander', 'Yara', 'Zoe'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
    
    // Random wallet balances
    const mainBalance = Math.floor(Math.random() * 1000) + 10;
    const bonusBalance = Math.floor(Math.random() * 500);
    
    // Random reward points
    const rewardPoints = Math.floor(Math.random() * 1000) + 1;
    
    // Random status (mostly active, some blocked)
    const status = Math.random() > 0.1 ? 'active' : 'blocked';
    
    users.push({
      name,
      email,
      photo: '',
      loginMethods: ['otp'],
      wallets: [
        { type: 'main', balance: mainBalance },
        { type: 'bonus', balance: bonusBalance },
      ],
      rewardPoints,
      status,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
    });
  }
  
  return users;
};

// Generate live streams
const generateLiveStreams = (users) => {
  const streams = [];
  const statuses = ['pending', 'approved', 'live', 'ended'];
  
  // Create streams for about 30% of users
  const streamUsers = users.filter(() => Math.random() < 0.3);
  
  streamUsers.forEach(user => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const numStreams = Math.floor(Math.random() * 3) + 1; // 1-3 streams per user
    
    for (let i = 0; i < numStreams; i++) {
      streams.push({
        userId: user._id,
        status,
        comments: [],
        viewers: [],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      });
    }
  });
  
  return streams;
};

// Generate wallet requests
const generateWalletRequests = (users) => {
  const requests = [];
  const statuses = ['pending', 'approved', 'rejected'];
  const walletTypes = ['main', 'bonus'];
  
  // Create requests for about 40% of users
  const requestUsers = users.filter(() => Math.random() < 0.4);
  
  requestUsers.forEach(user => {
    const numRequests = Math.floor(Math.random() * 4) + 1; // 1-4 requests per user
    
    for (let i = 0; i < numRequests; i++) {
      const walletType = walletTypes[Math.floor(Math.random() * walletTypes.length)];
      const amount = Math.floor(Math.random() * 500) + 10;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      requests.push({
        userId: user._id,
        walletType,
        amount,
        status,
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // Random date within last 60 days
      });
    }
  });
  
  return requests;
};

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear old data
    console.log('Clearing old data...');
    await User.deleteMany({});
    await LiveStream.deleteMany({});
    await WalletRequest.deleteMany({});
    await Admin.deleteMany({});

    // Create test admin
    console.log('Creating admin...');
    const admin = await Admin.create({
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'superadmin',
      permissions: [],
    });

    // Create 150 users
    console.log('Creating 150 users...');
    const userData = generateUsers(150);
    const users = await User.insertMany(userData);

    // Create live streams
    console.log('Creating live streams...');
    const liveStreamData = generateLiveStreams(users);
    await LiveStream.insertMany(liveStreamData);

    // Create wallet requests
    console.log('Creating wallet requests...');
    const walletRequestData = generateWalletRequests(users);
    await WalletRequest.insertMany(walletRequestData);

    // Print summary
    const userCount = await User.countDocuments();
    const liveStreamCount = await LiveStream.countDocuments();
    const walletRequestCount = await WalletRequest.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const blockedUsers = await User.countDocuments({ status: 'blocked' });
    const pendingStreams = await LiveStream.countDocuments({ status: 'pending' });
    const liveStreams = await LiveStream.countDocuments({ status: 'live' });
    const pendingRequests = await WalletRequest.countDocuments({ status: 'pending' });

    console.log('\n=== SEED DATA SUMMARY ===');
    console.log(`Total Users: ${userCount}`);
    console.log(`Active Users: ${activeUsers}`);
    console.log(`Blocked Users: ${blockedUsers}`);
    console.log(`Total Live Streams: ${liveStreamCount}`);
    console.log(`Pending Streams: ${pendingStreams}`);
    console.log(`Live Streams: ${liveStreams}`);
    console.log(`Total Wallet Requests: ${walletRequestCount}`);
    console.log(`Pending Requests: ${pendingRequests}`);
    console.log('========================\n');

    console.log('Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed(); 
