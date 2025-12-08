import { Request, Response } from "express";
import { prisma } from "../prisma.js";

// Hent alle vurderinger for en plakat
export const getRatings = async (req: Request, res: Response) => {
  try {
    const { posterId } = req.params;
    const ratings = await prisma.userRating.findMany({
      where: { posterId: parseInt(posterId) },
      include: {
        user: true,
        poster: true,
      },
    });
    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch ratings" });
  }
};

// Opret eller opdater vurdering
export const createOrUpdateRating = async (req: Request, res: Response) => {
  try {
    const { userId, posterId, numStars } = req.body;
    const rating = await prisma.userRating.upsert({
      where: {
        userId_posterId: {
          userId,
          posterId,
        },
      },
      update: {
        numStars,
      },
      create: {
        userId,
        posterId,
        numStars,
        createdAt: new Date(),
      },
      include: {
        user: true,
        poster: true,
      },
    });
    res.json(rating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create/update rating" });
  }
};

// Slet vurdering
export const deleteRating = async (req: Request, res: Response) => {
  try {
    const { userId, posterId } = req.params;
    await prisma.userRating.delete({
      where: {
        userId_posterId: {
          userId: parseInt(userId),
          posterId: parseInt(posterId),
        },
      },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete rating" });
  }
};

// Hent gennemsnitlig rating for en plakat
export const getAverageRating = async (req: Request, res: Response) => {
  try {
    const { posterId } = req.params;
    const result = await prisma.userRating.aggregate({
      where: { posterId: parseInt(posterId) },
      _avg: {
        numStars: true,
      },
      _count: {
        numStars: true,
      },
    });
    res.json({
      average: result._avg.numStars || 0,
      count: result._count.numStars,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to calculate average rating" });
  }
};
