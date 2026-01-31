import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/requireAuth';

const router = Router();

// Public health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend-gateway' });
});

// Protected route example
router.get('/v1/users/profile', requireAuth, (req, res) => {
  res.json({
    message: 'Access granted by Gateway',
    user: req.auth
  });
});

// Admin only route example
router.get('/v1/admin/stats', requireAuth, requireRole('admin'), (req, res) => {
  res.json({
    message: 'Welcome, Admin',
    stats: { users: 42, activeUsers: 7 }
  });
});

export default router;
