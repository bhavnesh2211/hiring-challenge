import { Request, Response } from "express";
import joi from "joi";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const registerSchema = joi
  .object({
    name: joi.string().required(),
    email: joi.string().required(),
    phone_number: joi.string().required(),
    password: joi.string().required(),
  })
  .unknown()
  .required();

async function registerUser(req: Request, res: Response) {
  const register = joi.attempt(req.body, registerSchema);

  const isUserExistedWithSameNumber = await prisma.users.findFirst({
    select: {
      id: true,
      phoneNumber: true,
    },
    where: {
      phoneNumber: register.phone_number,
      isActive: true,
    },
  });

  if (isUserExistedWithSameNumber) {
    return res.status(400).json({
      message:
        "User is already existed with provided number, Try with another number",
    });
  }

  const saltRounds = 10;
  bcrypt.hash(register.password, saltRounds, async (err, hash) => {
    if (err) {
      return res.status(500).send("Error hashing password");
    }

    const user = await prisma.users.create({
      data: {
        password: hash,
        phoneNumber: register.phone_number,
        email: register.email,
        name: register.name,
      },
    });

    return res.status(201).json({ message: "User Succeccfully created", user });

  });

}

export default registerUser;
