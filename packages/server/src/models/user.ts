import mongoose, { Model } from 'mongoose';
// Types Import
import { IUser } from '../types.js';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    default: null,
  },
  file: {
    type: String,
    default: undefined,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  secret: {
    type: String,
    default: null,
  },
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
