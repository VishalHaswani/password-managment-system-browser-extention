import nodemailer, { Transporter } from 'nodemailer';
import * as dotenv from 'dotenv';
import type { TransportConfig } from '../types.js';

dotenv.config();

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    // Make sure you add a mail and password
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
} as TransportConfig);

export default transport;
