import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import joi from "joi";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const jwtSecret: Secret = process.env.SECRET ?? "";

const loginSchema = joi
  .object({
    phone_number: joi.string().required(),
    password: joi.string().required(),
  })
  .unknown()
  .required();

async function loginUser(req: Request, res: Response) {
  const login = joi.attempt(req.body, loginSchema);

  const user = await prisma.users.findFirst({
    select: {
      id: true,
      password: true,
      phoneNumber: true,
    },
    where: {
      phoneNumber: login.phone_number,
      isActive: true,
    },
  });

  if (user) {
    bcrypt.compare(login.password, user?.password, (err, result) => {
      if (err) {
        return res.status(500).send("Error comparing passwords");
      }

      if (result) {
        const result = {
          userId: user?.id,
        };
        const token = jwt.sign(result, jwtSecret);

        return res.status(200).json({ token });
      } else {
        return res
          .status(401)
          .send({ message: "Invalid phone number or password" });
      }
    });
  } else {
    return res.status(400).send({ message: "User not found" });
  }
}

export default loginUser;
