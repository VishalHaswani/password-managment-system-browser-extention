import mongoose, { Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string | null;
  files: string[];
  otp: string | undefined;
  token: string | undefined;
  isVerified: boolean;
  secret: string | null;
}

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
  files: {
    type: [String],
    default: [],
  },
  otp: String,
  token: String,
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
