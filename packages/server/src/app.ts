import express from 'express';
import * as dotenv from 'dotenv';
import mongoose, { ConnectOptions } from 'mongoose';
import userRoutes from './routes/user.js';

// Load environment variables
dotenv.config();
const app: express.Application = express();

interface MongooseConnectOptions extends ConnectOptions {
  useNewUrlParser: boolean,
  useUnifiedTopology: boolean
}

const mongooseConnectOptions: MongooseConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.DB_URL as string, mongooseConnectOptions)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));
// Set up body-parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up the user routes
app.use('/api/v1/user', userRoutes);

// Set up the default route
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Welcome to the authentication and authorization app!');
});

// Start the server
const port: number = (() => {
  if (typeof process.env.PORT === 'string') {
    return parseInt(process.env.PORT, 10);
  }
  return 3000;
})();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
