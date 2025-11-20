import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDatabase } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import scanHistoryRoutes from './routes/scanHistoryRoutes.js';
import ingredientSafetyRoutes from './routes/ingredientSafetyRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import sentimentRoutes from './routes/sentimentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Security & middlewares
app.use(helmet());

// CORS configuration - allows frontend to make requests to backend
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

// Allow all Vercel preview deployments
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or is a Vercel preview URL
    if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache preflight requests for 10 minutes
};
app.use(cors(corsOptions));

app.use(xss());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/auth', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/history', scanHistoryRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/ingredients', ingredientSafetyRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/sentiment', sentimentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/chat', chatRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'DermoScanner API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      scans: '/api/scans',
      ai: '/api/ai'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDatabase(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// For Vercel serverless deployment
if (process.env.VERCEL) {
  connectDatabase(process.env.MONGO_URI).catch(err => {
    console.error('Failed to connect to database:', err);
  });
} else if (process.env.NODE_ENV !== 'test') {
  // Local development
  start();
}

export default app;

