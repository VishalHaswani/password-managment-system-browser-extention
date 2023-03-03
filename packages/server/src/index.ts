import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Password from './models/database.js';

const PORT = 3000;

const app = express();
app.use(bodyParser.json());

// GET all passwords
app.get('/', async (req: Request, res: Response) => {
  try {
    const passwords = await Password.find();
    res.json(passwords);
    console.log('GET / home page works');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single password by username
app.get('/:username', async (req: Request, res: Response) => {
  try {
    const password = await Password.findOne({
      username: req.params.username,
    });

    if (!password) {
      return res.status(404).json({ message: 'Not Exist' });
    }

    res.json(password);
    console.log('GET / password for username page works');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new password
app.post('/', async (req: Request, res: Response) => {
  const password = new Password({
    website: req.body.website,
    username: req.body.username,
    password: req.body.password,
  });

  try {
    const newPassword = await password.save();
    res.status(201).json(newPassword);
    console.log('POST / new password works. Password added to DB!');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH update a password by website and username
app.patch('/:username', async (req: Request, res: Response) => {
  try {
    const password = await Password.findOne({
      username: req.params.username,
    });

    if (!password) {
      return res.status(404).json({ message: 'Password not found' });
    }

    password.password = req.body.password;

    await password.save();

    res.json(password);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a password by username
app.delete('/:username', async (req: Request, res: Response) => {
  try {
    const password = await Password.findOneAndDelete({
      username: req.params.username,
    });

    if (!password) {
      return res.status(404).json({ message: 'Password not found' });
    }

    res.json({ message: 'Password deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server up on http://localhost:${PORT}`);
});
