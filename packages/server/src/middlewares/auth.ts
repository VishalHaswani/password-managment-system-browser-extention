import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
//  Types Import

import { AuthRequest, DecodedToken } from '../types.js';

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader: string | undefined = req.headers.authorization;
    if (!authHeader) { return res.status(403).send('Unauthorized'); }

    const token = authHeader.split(' ')[1];

    const decodedToken = jwt.decode(token) as DecodedToken;
    if (!decodedToken.isValid || decodedToken == null) {
      return res.status(403).send('Unauthorized');
    }
    jwt.verify(token, process.env.JWT_SECRET as string);
    const { userID } = jwt.decode(token) as DecodedToken;
    req.userID = userID;
    next();
  } catch (error: any) {
    // console.lo g(error);
    if (error.message === 'jwt expired') { return res.status(403).json('Login again'); }
    return res.status(401).send({ error });
  }
};

export default auth;
