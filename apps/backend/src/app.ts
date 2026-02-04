import express from 'express';
import cors from 'cors';
import { jwtValidationMiddleware } from './auth/auth.middleware';
import authRoutes from './routes/auth.routes';
import apiRoutes from './routes/api.routes';

const app = express();

if (!process.env.CORS_ALLOWED_ORIGINS) {
  throw new Error('CORS_ALLOWED_ORIGINS environment variable is required');
}
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS.split(',');

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Global JWT Validation (local, no DB)
app.use(jwtValidationMiddleware);

// Routes
app.use('/auth', authRoutes);
app.use('/', apiRoutes);

export default app;
