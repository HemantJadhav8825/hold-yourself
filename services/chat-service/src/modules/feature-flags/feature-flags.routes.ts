import { Router } from 'express';
import { FeatureFlagsController } from './feature-flags.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

// All feature flag routes require authentication
// In production, add admin role check middleware
router.get('/', authenticate, FeatureFlagsController.listFlags);
router.put('/:flagName', authenticate, FeatureFlagsController.updateFlag);

export default router;
