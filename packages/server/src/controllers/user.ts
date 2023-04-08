//  Required Libraries
import jwt from 'jsonwebtoken';
import axios, { AxiosResponse } from 'axios';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { Request, Response } from 'express';
//  DB Model
import User from '../models/user.js';

//  Register User
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) { return res.status(400).send('User already Exists!'); }
    // Generate a random 6-digit OTP
    const otp = crypto.randomBytes(4).toString('hex');
    // Save OTP in a new collection. To be implemented
    const user = new User({
      email,
      password: null,
      files: [],
      otp,
      isVerified: false,
      secret: null,
    });
    await user.save();

    const dataToken = jwt.sign({ userID: email, isValid: false, role: 'user' }, process.env.JWT_SECRET as string);

    // Send the OTP to the user's email
    const transport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        // Make sure you add a mail and password
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Body of the mail and other information
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your One time password is here! ',
      // text: 'Hello ',
      html: `<b>Hello User your OTP is: ${otp}</b>`,
    };
    try {
      const info = await transport.sendMail(mailOptions);
      console.log(`Email sent: ${(<any>info).status}`);
      return res.status(250).json({ message: 'Verification email sent! Please check your inbox.', token: dataToken });
    } catch (err) {
      console.log(err);
      return res.status(500).send('Error sending verification email. Please try again in sometime.');
    }
  } catch (err) {
    console.log(err);
    res.status(400).send('Error occurred check code');
  }
};

//  Verify Email
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;
    // Find the user with the provided email and OTP
    const user = await User.findOne({ otp });
    if (!user) {
      return res.status(400).send('Invalid OTP.');
    }

    user.isVerified = true;

    //  Generate Secret Key for user to use in AuthenticatorAPI
    const userSecretKey = crypto.randomBytes(32).toString('hex');
    //  Encrypt key for user before saving. To be done with chacha20 cipher.

    // Clear the OTP from database
    user.otp = undefined;
    // Set user secret key for authenticator app
    user.secret = userSecretKey;
    await user.save();

    res.status(200).json({ message: 'Email Verified' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error.');
  }
};

// Set password for new user
export const setPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    // Search for the user based on email provided
    const email = (req as any).userID;
    console.log(email);
    const user = await User.findOne({ email });
    if (!user) { return res.status(400).send('Invalid email'); }
    // Checks if email is verified or no.
    if (!user.isVerified) { return res.status(400).send('Email not verified'); }

    user.password = password;

    //  Generate Secret Key for user to use in AuthenticatorAPI
    const userSecretKey = crypto.randomBytes(32).toString('hex');
    //  Encrypt key for user. To be done with chacha20 cipher.

    user.secret = userSecretKey;
    await user.save();

    //  Generate QR Code to pair with authenticator app
    const response = await fetch(`https://www.authenticatorApi.com/pair.aspx?AppName=BPM&AppInfo=PasswordManager&SecretCode=${userSecretKey}`);
    const qrCodeUrl = await response.text();

    res.send({ message: 'Password set', qrCodeUrl });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Error check code');
  }
};

//  Verifying 2FA with authenticator app. Security review required.
export const verify2fa = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const email = (<any>req).userID;
    // Find the user with the provided email id
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid email.');
    }
    // Verify the 2FA code using authenticatorapi.com
    const response = await axios.get<string>(`https://www.authenticatorapi.com/Validate.aspx?Pin=${code}&SecretCode=${user.secret}`);
    const isValid = response.data;

    if (isValid === 'True') {
      //  Generate Token. Token Currently Signed by _id field of db. To be updated.
      const jwtToken = jwt.sign({ userID: email, isValid: true, role: 'user' }, process.env.JWT_SECRET as string, { expiresIn: '2m' });
      res.json({ token: jwtToken });
    } else {
      res.status(400).send('invalid 2FA code. Not Verified.');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error.');
  }
};

//  User Login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // Find the user with the provided username and password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid email.');
    }
    if (user.password !== password) {
      return res.status(400).send('Invalid password');
    }
    // Generate JWT
    const token = jwt.sign({ userID: email, isValid: false, role: 'user' }, process.env.JWT_SECRET as string);
    res.json({ message: 'Complete 2FA to validate token', invalidToken: token });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error.');
  }
};
