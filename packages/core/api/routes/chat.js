import { Router } from 'express';
import { handleChat } from '../controller/chatController.js';

const router = Router();
router.post('/', handleChat);
export default router;


