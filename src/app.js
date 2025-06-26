import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from './utils/passport.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import liveRoutes from './routes/liveRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(passport.initialize());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/live', liveRoutes);
app.use('/api/admin', adminRoutes);

// TODO: Add routes

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use(errorHandler);

export default app; 