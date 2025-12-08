// Fil: ./src/middleware/authorizeRole.ts
import { Response, NextFunction } from "express";
import { AuthRequest } from "./authenticateToken.js";

// Funktionen kan kaldes med en eller flere roller som parameter
export const authorizeRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    // Hvis authenticate ikke har sat user
    if (!user) {
      return res.status(401).json({ message: "You are not logged in" });
    }

    // Hvis der ikke er sat nogen roller, så giv bare adgang
    if (allowedRoles.length === 0) {
      return next();
    }

    // Tjek om brugerens role er en af de tilladte
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "You dont have permissions to access the url" });
    }

    // Alt ok
    return next();
  };
};
