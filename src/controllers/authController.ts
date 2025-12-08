import { Request, Response } from "express";
import { loginUser } from "../services/loginUser.js";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Simpel validering
    if (!email || !password) {
      return res.status(400).json({ message: "Email og password er påkrævet" });
    }

    const result = await loginUser(email, password);

    return res.status(200).json({
      message: "Login succesfuld",
      user: result.user,
      token: result.token,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(401).json({
      message: error.message || "Login fejlede",
    });
  }
};
