import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Type imports
import { type DecodedToken, RequestWithUserID } from '../types.js';

const userInfo = async (req: RequestWithUserID, res: Response, next: NextFunction) => {
  try {
    const authHeader: string | undefined = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];

    const { userID } = jwt.decode(token) as DecodedToken;
    req.userID = userID;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Try again in sometime', error });
  }
};

export default userInfo;
