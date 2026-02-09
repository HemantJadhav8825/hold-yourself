import { Router } from 'express';
import { ShareController } from '../controllers/share.controller';
import { SupportController } from '../controllers/support.controller';
import { CommentController } from '../controllers/comment.controller';
import { PreferenceController } from '../controllers/preference.controller';
import { authenticate, optionalAuthenticate } from '../middleware/auth';

const router = Router();
const shareController = new ShareController();
const supportController = new SupportController();
const commentController = new CommentController();
const preferenceController = new PreferenceController();

/**
 * Expression Layer Endpoints (Milestone 1)
 */
router.post('/shares', authenticate, (req, res) => shareController.createShare(req, res));
// Feed uses optionalAuthenticate for viewer visibility and muting checks
router.get('/shares', optionalAuthenticate, (req, res) => shareController.getShares(req as any, res));
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

/**
 * Visibility & Protection Endpoints (Milestone 3)
 */
router.patch('/preferences', authenticate, (req, res) => preferenceController.updatePreferences(req, res));
router.get('/preferences', authenticate, (req, res) => preferenceController.getPreferences(req, res));

export default router;
