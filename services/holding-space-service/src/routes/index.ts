import { Router } from 'express';
import { ShareController } from '../controllers/share.controller';
import { SupportController } from '../controllers/support.controller';
import { CommentController } from '../controllers/comment.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const shareController = new ShareController();
const supportController = new SupportController();
const commentController = new CommentController();

/**
 * Expression Layer Endpoints (Milestone 1)
 */
router.post('/shares', authenticate, (req, res) => shareController.createShare(req, res));
router.get('/shares', (req, res) => shareController.getShares(req, res));
router.patch('/shares/:id', authenticate, (req, res) => shareController.updateShare(req, res));
router.delete('/shares/:id', authenticate, (req, res) => shareController.deleteShare(req, res));

/**
 * Interaction Layer Endpoints (Milestone 2)
 */

// Support
router.post('/shares/:id/support', authenticate, (req, res) => supportController.toggleSupport(req, res));
router.delete('/shares/:id/support', authenticate, (req, res) => supportController.deleteSupport(req, res));

// Comments
router.post('/shares/:id/comments', authenticate, (req, res) => commentController.createComment(req, res));
router.get('/shares/:id/comments', authenticate, (req, res) => commentController.getComments(req, res));

export default router;
