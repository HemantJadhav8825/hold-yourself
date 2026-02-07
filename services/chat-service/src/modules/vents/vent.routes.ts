import { Router } from 'express';
import { VentController } from './vent.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new VentController();

router.post('/', authenticate, (req, res) => controller.createVent(req, res));
router.get('/', (req, res) => controller.getRecentFeed(req, res)); // Allow GET /v1/vents
router.get('/feed', (req, res) => controller.getRecentFeed(req, res));
router.get('/circle/:circleId', (req, res) => controller.getCircleFeed(req, res));
router.post('/:id/react', authenticate, (req, res) => controller.addReaction(req, res));

export default router;
