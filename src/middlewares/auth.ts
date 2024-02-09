import boom from "boom";
import jwt, { Secret, VerifyOptions } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express";
const jwtSecret: Secret = process.env.SECRET ?? "";
// Define options for token verification
const options: VerifyOptions = {
  algorithms: ['HS256'] // specify the algorithm used to sign the token
};

export default async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace('Bearer', '').trim();
  jwt.verify(token, jwtSecret, options, (err) => {
    if (err) {
      return next(boom.unauthorized());
    }
    next();
  });
};
