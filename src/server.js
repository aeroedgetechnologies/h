import mongoose from 'mongoose';
import app from './app.js';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 5000;
// const MONGODB_URI = process.env.MONGODB_URI;

const MONGODB_URI = 'mongodb+srv://govindayadav2478:gCFF1B4CCTljTgL9@cluster0.vsf7qx5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

let io;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  io = new Server(server, { cors: { origin: '*' } });
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

export { io }; 