import express from 'express';
import type { Router, Request, Response } from 'express';
import {
  registerUser, verifyEmail, loginUser, verify2fa, setPassword, uploadFileString,
} from '../controllers/user.js';
import auth from '../middlewares/auth.js';
import userInfo from '../middlewares/userInfo.js';

import User from '../models/user.js';

const router: Router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Verify a user's email
router.post('/verify-email', userInfo, verifyEmail);

// Set password after email verification
router.post('/set-password', userInfo, setPassword);

// Verify a user's 2FA code
router.post('/verify-2fa', userInfo, verify2fa);

// Log in a user
router.post('/login', loginUser);

//  Protected routes. For testing during development.
router.get('/protected', auth, async (req: Request, res: Response) => {
  res.json({ message: 'Protected Route Works' });
});

// File string upload route
router.post('/upload', auth, uploadFileString);

export default router;
