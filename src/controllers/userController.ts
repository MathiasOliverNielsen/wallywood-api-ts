import { Request, Response } from "express";
import { prisma } from "../prisma.js";

// Hent alle brugere
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        cartlines: {
          include: {
            poster: true,
          },
        },
        userRatings: {
          include: {
            poster: true,
          },
        },
      },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Hent enkelt bruger
export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        cartlines: {
          include: {
            poster: true,
          },
        },
        userRatings: {
          include: {
            poster: true,
          },
        },
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Opret bruger
export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password,
        role,
        createdAt: new Date(),
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Opdater bruger
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, email, password, role, isActive } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        firstname,
        lastname,
        email,
        password,
        role,
        isActive,
      },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Slet bruger
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// For bagudkompatibilitet
export const getRecords = getUsers;
