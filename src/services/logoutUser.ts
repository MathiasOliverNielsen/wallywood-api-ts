import { prisma } from "../prisma.js";

export const logoutUser = async (refreshToken: string) => {
  // Find bruger og fjern refresh token
  const user = await prisma.user.findFirst({
    where: { refreshToken },
  });

  if (!user) {
    throw new Error("Invalid refresh token");
  }

  // Fjern refresh token fra database
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: null },
  });

  return { message: "Logged out successfully" };
};
