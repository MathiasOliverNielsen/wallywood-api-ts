import { prisma } from "../prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

export const loginUser = async (email: string, password: string) => {
  // 1. Find bruger i databasen
  const user = await prisma.user.findUnique({
    where: { email, isActive: true },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      password: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error("Bruger findes ikke");
  }

  // 2. Sammenlign password med det hash'ede password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Forkert password");
  }

  // 3. Generer access token (kort levetid)
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "15m" } // Access token udløber efter 15 minutter
  );

  // 4. Generer refresh token (lang random string)
  const refreshToken = crypto.randomBytes(64).toString("hex");

  // 5. Gem refresh token i database
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  // 6. Returnér bruger + tokens (uden password)
  const { password: _password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};
