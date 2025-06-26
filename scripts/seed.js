import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import LiveStream from '../src/models/LiveStream.js';
import WalletRequest from '../src/models/WalletRequest.js';
import Admin from '../src/models/Admin.js';

// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/new-dashboard';
const MONGODB_URI = 'mongodb+srv://govindayadav2478:gCFF1B4CCTljTgL9@cluster0.vsf7qx5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function seed() {
  await mongoose.connect(MONGODB_URI);

  // Clear old data
  await User.deleteMany({});
  await LiveStream.deleteMany({});
  await WalletRequest.deleteMany({});
  await Admin.deleteMany({});

  // Create test admin
  const admin = await Admin.create({
    email: 'admin@example.com',
    password: await bcrypt.hash('admin123', 10),
    role: 'superadmin',
    permissions: [],
  });

  // Create test users
  const users = await User.insertMany([
    {
      name: 'Alice',
      email: 'alice@example.com',
      photo: '',
      loginMethods: ['otp'],
      wallets: [
        { type: 'main', balance: 100 },
        { type: 'bonus', balance: 50 },
      ],
      rewardPoints: 10,
      status: 'active',
    },
    {
      name: 'Bob',
      email: 'bob@example.com',
      photo: '',
      loginMethods: ['otp'],
      wallets: [
        { type: 'main', balance: 200 },
        { type: 'bonus', balance: 0 },
      ],
      rewardPoints: 20,
      status: 'active',
    },
  ]);

  // Create test live streams
  await LiveStream.insertMany([
    {
      userId: users[0]._id,
      status: 'pending',
      comments: [],
      viewers: [],
    },
    {
      userId: users[1]._id,
      status: 'live',
      comments: [],
      viewers: [],
    },
  ]);

  // Create test wallet requests
  await WalletRequest.insertMany([
    {
      userId: users[0]._id,
      walletType: 'main',
      amount: 50,
      status: 'pending',
    },
  ]);

  console.log('Seed data created!');
  process.exit();
}

seed(); 