import express from 'express';
import cors from 'cors';
import { jwtValidationMiddleware } from './auth/auth.middleware';
import authRoutes from './routes/auth.routes';
import apiRoutes from './routes/api.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Global JWT Validation (local, no DB)
app.use(jwtValidationMiddleware);

// Routes
app.use('/auth', authRoutes);
app.use('/', apiRoutes);

export default app;
