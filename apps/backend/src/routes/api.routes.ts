import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/requireAuth';

import axios from 'axios';
import { AUTH_CONFIG } from '../auth/auth.config';

const router = Router();
const AUTH_SERVICE_URL = AUTH_CONFIG.SERVICE_URL;

// Public health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend-gateway' });
});

// GET /v1/users (list)
router.get('/v1/users', requireAuth, async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const response = await axios.get(`${AUTH_SERVICE_URL}/v1/users`, {
      params: { limit, offset }
    });
    res.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || 'Failed to fetch users';
    res.status(status).json({ error: message });
  }
});

// GET /v1/users/profile (expanded)
router.get('/v1/users/profile', requireAuth, async (req, res) => {
  try {
    // req.auth.userId is provided by jwtValidationMiddleware
    const userId = req.auth?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }

    const response = await axios.get(`${AUTH_SERVICE_URL}/v1/users/${userId}`);
    res.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || 'Failed to fetch profile';
    res.status(status).json({ error: message });
  }
});

// Admin only route example
router.get('/v1/admin/stats', requireAuth, requireRole('admin'), (req, res) => {
  res.json({
    message: 'Welcome, Admin',
    stats: { users: 42, activeUsers: 7 }
  });
});

export default router;
