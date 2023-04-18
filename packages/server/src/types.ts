import { Request } from 'express';

export interface MailOptions {
  from: string,
  to: string,
  subject: string,
  html: string
}

export interface RequestWithUserID extends Request {
  userID?: string | undefined
}

export interface AuthRequest extends Request {
  userID?: string | undefined,
  authorization?: string | undefined;
}

export interface DecodedToken {
  userID: string;
  isValid: boolean;
  role: string;
  iat?: number;
  exp?: number;
}

export interface IUser extends Document {
  email: string;
  password: string | null;
  file: string | undefined;
  otp: number | undefined;
  token: string | undefined;
  isVerified: boolean;
  secret: string | null;
}

export interface TransportConfig {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
}

export interface IOtp {
  email: string;
  code: number;
  createdAt: Date;
}
