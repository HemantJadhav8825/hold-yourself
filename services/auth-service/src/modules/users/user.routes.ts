import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();
const controller = new UserController();

router.get('/', (req, res) => controller.listUsers(req, res));
router.get('/:id', (req, res) => controller.getProfile(req, res));
router.post('/anonymous', (req, res) => controller.createAnonymousProfile(req, res));

export default router;
