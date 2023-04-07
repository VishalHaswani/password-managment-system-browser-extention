import express, { Router, Request, Response } from 'express';
import {
  registerUser, verifyEmail, loginUser, verify2fa, setPassword, verifyLogin2fa,
} from '../controllers/user.js';
import auth from '../middlewares/auth.js';

const router: Router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Verify a user's email
router.post('/verify-email', verifyEmail);

// Set password after email verification
router.post('/set-password', setPassword);

// Verify a user's 2FA code
router.post('/verify-2fa', verify2fa);

// Log in a user
router.post('/login', loginUser);

//  Verify 2FA after login
router.post('/verify-login-2fa', verifyLogin2fa);

//  Protected routes. To be updated.
router.get('/protected', auth, (req: Request, res: Response) => {
  res.send('this is the protected route');
});
export default router;
