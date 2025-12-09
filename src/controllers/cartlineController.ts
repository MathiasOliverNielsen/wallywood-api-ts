import { Request, Response } from "express";
import { prisma } from "../prisma.js";

// Hent alle indkøbskurv linjer for en bruger
export const getCartlines = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const cartlines = await prisma.cartline.findMany({
      where: { userId: parseInt(userId) },
      include: {
        poster: true,
        user: true,
      },
    });
    res.json(cartlines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cartlines" });
  }
};

// Tilføj til indkøbskurv
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { userId, posterId, quantity } = req.body;

    // Validate input
    if (!userId || !posterId || !quantity) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["userId", "posterId", "quantity"],
        received: { userId, posterId, quantity },
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: `User with ID ${userId} not found` });
    }

    // Check if poster exists
    const poster = await prisma.poster.findUnique({ where: { id: posterId } });
    if (!poster) {
      return res.status(404).json({ error: `Poster with ID ${posterId} not found` });
    }

    const cartline = await prisma.cartline.create({
      data: {
        userId: parseInt(userId),
        posterId: parseInt(posterId),
        quantity: parseInt(quantity),
        createdAt: new Date(),
      },
      include: {
        poster: true,
        user: true,
      },
    });
    res.status(201).json(cartline);
  } catch (error) {
    console.error("AddToCart Error:", error);
    res.status(500).json({
      error: "Failed to add to cart",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Opdater antal i indkøbskurv
export const updateCartline = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const cartline = await prisma.cartline.update({
      where: { id: parseInt(id) },
      data: { quantity },
      include: {
        poster: true,
        user: true,
      },
    });
    res.json(cartline);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update cartline" });
  }
};

// Fjern fra indkøbskurv
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.cartline.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
};

// Tøm indkøbskurv for bruger
export const clearCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await prisma.cartline.deleteMany({
      where: { userId: parseInt(userId) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
};
