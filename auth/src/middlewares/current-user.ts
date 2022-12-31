import { Request, Response, NextFunction,Express } from "express";
import jwt from "jsonwebtoken";
import { isExpressionStatement } from "typescript";

interface UserPayload {
    id:string,
    email:string
}

//augmenting Request defenition of Express
declare global{
    namespace Express{
        interface Request {
            currentUser?:UserPayload
        }
    }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    if(!req.session?.jwt){
       return next(); 
    }
    try{
        const payload = jwt.verify(req.session.jwt,process.env.JWT_KEY) as UserPayload
        req.currentUser = payload;
        next();
    }catch(err){
        next();
    }
    
};
