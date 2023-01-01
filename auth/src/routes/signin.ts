import express, { Request, Response } from "express";
import { body} from "express-validator";
import jwt from 'jsonwebtoken';
import { BadRequestError,validateRequest  } from "@glticket/common";
import { Password } from "../helpers/password";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password should not be empty"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {email,password} = req.body;
    const existingUser = await User.findOne({email}); 
    if(!existingUser){
        throw new BadRequestError('Invalid credentials');
    }
    const doesPasswordsMatch = await Password.compare(existingUser.password,password);
    if(!doesPasswordsMatch){
        throw new BadRequestError('Invalid credentials');
    }
    //Generate jwt and store it on session object
    const userJwt = jwt.sign({
        id:existingUser.id,
        email:existingUser.email
      },process.env.JWT_KEY!);
  
      req.session.jwt = userJwt;
  
      res.status(200).send(existingUser);
  }
);

export { router as signInRouter };
