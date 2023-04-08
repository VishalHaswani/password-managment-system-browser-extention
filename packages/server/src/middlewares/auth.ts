import * as express from 'express';
import jwt, { decode } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader: any = req.headers.authorization;
    if (!authHeader) { return res.status(403).send('Unauthorized'); }

    const token = authHeader.split(' ')[1];

    const decodedToken: any = jwt.decode(token);
    if (!decodedToken.isValid || decodedToken == null) {
      return res.status(403).send('Unauthorized');
    }

    jwt.verify(token, process.env.JWT_SECRET as string);
    next();
  } catch (error: Error | any) {
    console.log(error);
    if (error.message === 'jwt expired') { return res.status(403).json('Login again'); }
    return res.status(401).send({ error });
  }
};

export default auth;
