import * as express from 'express'
import * as jwt from 'jsonwebtoken'
import { Request,Response,NextFunction} from 'express';

const auth = async (req: Request, res:Response, next: NextFunction) => {
    try {
      const authHeader:any = req.headers['authorization']
        const token = authHeader.split(' ')[1]
    
        if (!token)
          return res.status(403).send('Unauthorized')
        
        const decodedToken: any = jwt.decode(token)
        if(!decodedToken.isValid || decodedToken == null){
          return res.status(403).send("Unauthorized")
        }
    
        jwt.verify(token, "SECRET_KEY")
        next();
      
    } catch (error: Error | any) {
        if(error.message === "jwt expired")
          return res.status(403).json("Login again")
        else
          return res.status(401).json({error})
    }  
  
};

export default auth