import { prisma } from "../prisma.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

export const refreshAccessToken = async (refreshToken: string) => {
  // 1. Find bruger med refresh token
  const user = await prisma.user.findFirst({
    where: {
      refreshToken,
      isActive: true,
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error("Invalid refresh token");
  }

  // 2. Generer ny access token
  const newAccessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  // 3. Generer ny refresh token
  const newRefreshToken = crypto.randomBytes(64).toString("hex");

  // 4. Opdater refresh token i database
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: newRefreshToken },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};
