import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'auth-service' }));

// Auth Routes
app.use('/v1/auth', authRoutes);

export default app;
