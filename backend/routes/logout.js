import express from 'express'
let router = express.Router();
import logoutController  from '../controllers/logoutController.js';

router.get('/', logoutController.handleLogout);

export default router;