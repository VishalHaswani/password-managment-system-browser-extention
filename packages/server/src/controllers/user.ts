//  Required Libraries
import jwt from 'jsonwebtoken';
import axios from 'axios';
import * as crypto from 'crypto';
//  Import types
import type { Request, Response } from 'express';
import type {
  AuthRequest,
  MailOptions, RequestWithUserID,
} from '../types.js';
// Import services
import transport from '../services/createTransport.js';
//  DB Model
import User from '../models/user.js';
import OtpModel from '../models/otp.js';

//  Register User
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ mesage: 'User already Exists!' });
    }
    // Generate a random 6-digit OTP. Generation to be updated
    const otpCode = crypto.randomInt(100000, 999999);
    // Save OTP in a new collection. To be implemented
    const otp = new OtpModel({
      email,
      code: otpCode,
    });
    await otp.save();
    //  Create user
    const user = new User({
      email,
      password: null,
      files: null,
      isVerified: false,
      secret: null,
    });
    await user.save();

    //  Create data token
    const dataToken = jwt.sign({ userID: email, isValid: false, role: 'user' }, process.env.JWT_SECRET as string);

    // Send the OTP to the user's email
    const mailOptions: MailOptions = {
      // Enter a Mail if nothing in environment variables
      from: process.env.EMAIL || '',
      to: email,
      subject: 'Your One time password is here! ',
      // text: 'Hello' ,//  change as required
      html: `<b>Hello User your OTP is: ${otpCode}.</b><br>The OTP will expired in 5 minutes.`,
    };
    try {
      await transport.sendMail(mailOptions);
      return res.status(250).json({ message: 'Verification email sent! Please check your inbox.', token: dataToken });
    } catch (err) {
      return res.status(500).json({ message: 'Error sending verification email. Please try again in sometime.' });
    }
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

//  Verify Email
export const verifyEmail = async (req: RequestWithUserID, res: Response) => {
  try {
    const { otp } = req.body;
    const email = req.userID;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }
    const otpCode = await OtpModel.findOne({ code: otp, email });
    if (!otpCode) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }
    user.isVerified = true;
    // Clear the OTP from database
    user.otp = undefined;
    //  Generate Secret Key for user to use in AuthenticatorAPI
    const userSecretKey = crypto.randomBytes(32).toString('hex');
    //  Encrypt key for user before saving. To be done with chacha20 cipher.
    // Set user secret key for authenticator app
    user.secret = userSecretKey;
    await OtpModel.deleteOne({ email });
    await user.save();

    res.status(200).json({ message: 'Email Verified' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Set password for new user
export const setPassword = async (req: RequestWithUserID, res: Response) => {
  try {
    const { password } = req.body;
    // Search for the user based on email provided
    const email = req.userID;
    // console.log(email);
    const user = await User.findOne({ email });
    if (!user) { return res.status(400).json({ message: 'Invalid email' }); }
    // Checks if email is verified or no.
    if (!user.isVerified) { return res.status(400).json({ message: 'Email not verified' }); }

    user.password = password;

    //  Generate Secret Key for user to use in AuthenticatorAPI
    const userSecretKey = crypto.randomBytes(32).toString('hex');
    //  Encrypt key for user. To be done with chacha20 cipher.

    user.secret = userSecretKey;
    await user.save();

    //  Generate QR Code to pair with authenticator app
    const response = await fetch(`https://www.authenticatorApi.com/pair.aspx?AppName=BPM&AppInfo=PasswordManager&SecretCode=${userSecretKey}`);
    const qrCodeUrl = await response.text();

    res.json({ message: 'Password set', qrCodeUrl });
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ message: err });
  }
};

//  Verifying 2FA with authenticator app. Security review required.
export const verify2fa = async (req: RequestWithUserID, res: Response) => {
  try {
    const { code } = req.body;
    const email = req.userID;
    // Find the user with the provided email id
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email.' });
    }
    // Verify the 2FA code using authenticatorapi.com
    const response = await axios.get<string>(`https://www.authenticatorapi.com/Validate.aspx?Pin=${code}&SecretCode=${user.secret}`);
    const isValid = response.data;

    if (isValid === 'True') {
      //  Generate Token. Token Currently Signed by _id field of db. To be updated.
      const jwtToken = jwt.sign({ userID: email, isValid: true, role: 'user' }, process.env.JWT_SECRET as string, { expiresIn: '2m' });
      res.json({ token: jwtToken });
    } else {
      res.status(400).json({ message: 'invalid 2FA code. Not Verified.' });
    }
  } catch (err) {
    // console.log(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

//  User Login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // Find the user with the provided username and password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email.' });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    // Generate JWT
    const token = jwt.sign({ userID: email, isValid: false, role: 'user' }, process.env.JWT_SECRET as string);
    res.json({ message: 'Complete 2FA to validate token', invalidToken: token });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const uploadFileString = async (req: AuthRequest, res: Response) => {
  try {
    const { fileString } = req.body;
    const email = req.userID;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email.' });
    }
    user.file = fileString;
    await user.save();
    res.status(201).json({ message: 'File updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};
