import mongoose from 'mongoose';
import { type IOtp } from '../types.js';

const OtpSchema = new mongoose.Schema<IOtp>({
  email: { type: String, required: true, unique: true },
  code: { type: Number, required: true },
  createdAt: {
    type: Date, required: true, default: Date.now, expires: 300,
  },
});

const OtpModel = mongoose.model<IOtp>('Otp', OtpSchema);
export default OtpModel;
