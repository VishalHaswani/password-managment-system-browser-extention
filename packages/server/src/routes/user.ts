import express, { Router, Request, Response } from 'express';
import {
  registerUser, verifyEmail, loginUser, verify2fa, setPassword,
} from '../controllers/user.js';
import auth from '../middlewares/auth.js';
import userInfo from '../middlewares/userInfo.js';

const router: Router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Verify a user's email
router.post('/verify-email', verifyEmail);

// Set password after email verification
router.post('/set-password', userInfo, setPassword);

// Verify a user's 2FA code
router.post('/verify-2fa', userInfo, verify2fa);

// Log in a user
router.post('/login', loginUser);

//  Protected routes. To be updated.
router.get('/protected', auth, (req: Request, res: Response) => {
  res.send('this is the protected route');
});
export default router;
