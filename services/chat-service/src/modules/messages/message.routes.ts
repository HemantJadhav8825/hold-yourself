import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { messageRateLimiter } from '../../middleware/rate-limit';
import { MessageController } from './message.controller';

const router = Router();

router.get('/:conversationId', authenticate, MessageController.list);
router.post('/', authenticate, messageRateLimiter, MessageController.create);

export default router;
