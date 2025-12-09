import { Request, Response } from "express";
import { loginUser } from "../services/loginUser.js";
import { refreshAccessToken } from "../services/refreshToken.js";
import { logoutUser } from "../services/logoutUser.js";
import { AuthRequest } from "../middleware/authenticateToken.js";

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
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(401).json({
      message: error.message || "Login fejlede",
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token er påkrævet" });
    }

    const result = await refreshAccessToken(refreshToken);

    return res.status(200).json({
      message: "Token refreshed successfully",
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(401).json({
      message: error.message || "Token refresh fejlede",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token er påkrævet" });
    }

    const result = await logoutUser(refreshToken);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({
      message: error.message || "Logout fejlede",
    });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  // Hvis auth-middleware IKKE har lagt en bruger på req,
  // er brugeren ikke logget ind eller token er ugyldig
  if (!req.user) {
    return res.status(401).json({
      message: "User not authenticated or token is missing/invalid",
    });
  }

  // Hvis alt er OK, returnér den dekodede brugerinfo fra token
  return res.status(200).json(req.user);
};
