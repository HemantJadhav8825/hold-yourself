import { Router } from 'express';
import { ShareController } from '../controllers/share.controller';
import { SupportController } from '../controllers/support.controller';
import { CommentController } from '../controllers/comment.controller';
import { PreferenceController } from '../controllers/preference.controller';
import { ReportController } from '../controllers/report.controller';
import { BlockController } from '../controllers/block.controller';
import { ModerationController } from '../controllers/moderation.controller';
import { authenticate, optionalAuthenticate, requireAdmin } from '../middleware/auth';

const router = Router();
const shareController = new ShareController();
const supportController = new SupportController();
const commentController = new CommentController();
const preferenceController = new PreferenceController();
const reportController = new ReportController();
const blockController = new BlockController();
const moderationController = new ModerationController();

/**
 * Expression Layer Endpoints (Milestone 1)
 */
router.post('/shares', authenticate, (req, res) => shareController.createShare(req, res));
// Feed uses optionalAuthenticate for viewer visibility and muting checks
router.get('/shares', optionalAuthenticate, (req, res) => shareController.getShares(req as any, res));
router.get('/shares/:id', optionalAuthenticate, (req, res) => shareController.getShareById(req as any, res));
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

/**
 * Moderation & Harm Containment (Milestone 4)
 */

// Reporting
router.post('/reports', authenticate, (req, res) => reportController.createReport(req, res));

// Blocking
router.post('/block/:userId', authenticate, (req, res) => blockController.blockUser(req, res));
router.delete('/block/:userId', authenticate, (req, res) => blockController.unblockUser(req, res));

// Internal Moderation (Admin only)
router.patch('/internal/moderation/share/:id/shadow', authenticate, requireAdmin, (req, res) => moderationController.shadowLimitShare(req, res));
router.patch('/internal/moderation/comment/:id/shadow', authenticate, requireAdmin, (req, res) => moderationController.shadowLimitComment(req, res));

export default router;
