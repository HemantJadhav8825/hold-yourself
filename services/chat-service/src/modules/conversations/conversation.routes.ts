import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { ConversationController } from './conversation.controller';

const router = Router();

router.get('/', authenticate, ConversationController.list);
router.post('/', authenticate, ConversationController.create);

export default router;
