import { prisma } from "../prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

  // 3. Lav en token (JWT)
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "1h" } // token udløber efter 1 time
  );

  // 4. Returnér bruger + token (uden password)
  const { password: _password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};
