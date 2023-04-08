import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// interface AuthenticatedRequest extends Request {
//   userID?: string;
// }

const userInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader:any = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];

    const { userID }: any = jwt.decode(token);
    (req as any).userID = userID;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Try again in sometime', error });
  }
};

export default userInfo;
