import { User } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import { PrismaSingleton } from "../../client";
import { signAsync, verifyPassword } from "../../helpers";
import { userInput } from "./signup";
const prismaClient = PrismaSingleton.getInstance().prisma;

// env var's
const secret = process.env.JWT_SECRET;

const loginInput = userInput.pick({ email: true, password: true });
export async function loginUser(req: Request, res: Response) {
  try {
    const reqBody = req.body;

    const parsedInput = await loginInput.safeParse(reqBody);

    if (!parsedInput.success) {
      res.status(401).json({
        success: false,
        message: "Invalid Input",
        errors: parsedInput.error.format(),
      });
      return;
    }

    const { email, password } = parsedInput.data;

    const userInDb = await prismaClient.user.findUnique({ where: { email } });

    if (!userInDb) {
      res.status(401).json({
        success: false,
        message: "no user found with that email",
        errors: {
          email: "No user found with that email",
        },
      });
      return;
    }

    const validPassword = await verifyPassword(password, userInDb.passowrd);

    if (!validPassword) {
      res.status(401).json({
        success: false,
        message: "incorrect password",
        errors: {
          password: "Incorrect password",
        },
      });
      return;
    }

    const signedToken = await signAsync({ email: userInDb.email, secret });
    // deleting user password before sending as a response
    // @ts-ignore
    delete userInDb.passowrd;
    res.status(200).json({
      success: true,
      message: "login successfull",
      user: userInDb,
      token: signedToken,
    });
  } catch (e: any) {
    res.status(401).json({
      success: false,
      message: e.message,
    });
  }
}
