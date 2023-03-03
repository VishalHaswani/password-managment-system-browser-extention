import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

mongoose.connect('mongodb://0.0.0.0:27017/testDB');

interface PasswordInterface extends mongoose.Document {
  website: string;
  username: string;
  password: string;
  createdAt: Date;
}

const passwordSchema = new mongoose.Schema<PasswordInterface>({
  website: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash the password before saving to database
passwordSchema.pre<PasswordInterface>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Password = mongoose.model<PasswordInterface>('Password', passwordSchema);

export default Password;
