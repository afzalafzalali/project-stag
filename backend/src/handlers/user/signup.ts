import { User } from "@prisma/client";
import { Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { PrismaSingleton } from "../../client";
import { signAsync } from "../../helpers";

const prismaClient = PrismaSingleton.getInstance().prisma;

export const userInput = z.object({
  name: z
    .string({ required_error: "Name should be provided" })
    .min(1, { message: "name should be provided" })
    .max(50, { message: "name too long" }),
  email: z
    .string({ required_error: "Email should be provided" })
    .email({ message: "Invalid email syntax" }),
  password: z
    .string({ required_error: "Password should be provided" })
    .min(1, { message: "Password should be provided" }),
});

// env var's
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
const secret = process.env.JWT_SECRET;

export async function signupUser(
  req: {
    body: Partial<User>;
  },
  res: Response
) {
  try {
    const reqBody = req.body;
    const parsedInput = userInput.safeParse(reqBody);

    if (!parsedInput.success) {
      res.status(401).json({
        success: false,
        message: "Invalid Input",
        errors: parsedInput.error.format(),
      });
      return;
    }

    const { name, email, password } = parsedInput.data;

    // hashing password
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userInDb = await prismaClient.user.findUnique({ where: { email } });

    if (userInDb) {
      res.status(401).json({
        success: false,
        message: "user already present",
        errors: {
          email: "User present with the email",
        },
      });
      return;
    }

    const user = await prismaClient.user.create({
      data: {
        name: name!,
        email,
        passowrd: hashedPassword,
      },
    });

    const signedToken = await signAsync({ email: user.email, secret });

    // deleting user password before sending as a response
    // @ts-ignore
    delete user.passowrd;
    res.status(200).json({
      success: true,
      message: "user created successfully",
      user,
      token: signedToken,
    });
  } catch (e: any) {
    res.status(401).json({
      success: false,
      message: e.message,
    });
  }
}
