import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'holding-space'
  });
});

// Routes
// Mounting v1 routes
app.use('/v1', routes);

export default app;
