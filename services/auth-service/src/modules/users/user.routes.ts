import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();
const controller = new UserController();

router.get('/', (req, res) => controller.listUsers(req, res));
router.get('/:id', (req, res) => controller.getProfile(req, res));

export default router;
