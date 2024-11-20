import { Response } from "express";
import { NextFncReq } from "../../middleware";

export async function fetchUser(req: NextFncReq, res: Response) {
  try {
    const user = req.user;
    user!.passowrd = "";

    res.status(200).json({
      success: true,
      user,
    });
  } catch (e: any) {
    res.status(401).json({
      success: false,
      message: e.message,
    });
  }
}
