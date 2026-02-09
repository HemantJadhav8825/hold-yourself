import { Router } from 'express';
import { ShareController } from '../controllers/share.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new ShareController();

/**
 * Expression Layer Endpoints (Milestone 1)
 */

// POST /shares - Create a new share (Authenticated)
router.post('/shares', authenticate, (req, res) => controller.createShare(req, res));

// GET /shares - Real chronological feed (Public/Authenticated)
router.get('/shares', (req, res) => controller.getShares(req, res));

// PATCH /shares/:id - Edit a share (Authenticated, Author only)
router.patch('/shares/:id', authenticate, (req, res) => controller.updateShare(req, res));

// DELETE /shares/:id - Delete a share (Authenticated, Author only)
router.delete('/shares/:id', authenticate, (req, res) => controller.deleteShare(req, res));

export default router;
