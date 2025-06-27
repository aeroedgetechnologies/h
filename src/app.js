import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from './utils/passport.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import liveRoutes from './routes/liveRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
dotenv.config();

const app = express();

// Swagger setup
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Admin Dashboard API',
    version: '1.0.0',
    description: 'Complete API documentation for the Admin Dashboard with authentication, user management, live streaming, and wallet operations.',
    contact: {
      name: 'API Support',
      email: 'support@example.com'
    }
  },
  servers: [
    { url: 'http://localhost:5000', description: 'Local Development Server' },
    { url: 'https://h-x6ti.onrender.com', description: 'Production Server' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token in the format: Bearer <token>'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};
const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
