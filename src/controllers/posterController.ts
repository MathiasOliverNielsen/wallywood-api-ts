import { Request, Response } from "express";
import { prisma } from "../prisma.js";

// Hent alle plakater
export const getPosters = async (req: Request, res: Response) => {
  try {
    const posters = await prisma.poster.findMany({
      include: {
        genrePosterRels: {
          include: {
            genre: true,
          },
        },
      },
    });
    res.json(posters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch posters" });
  }
};

// Hent enkelt plakat
export const getPoster = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const poster = await prisma.poster.findUnique({
      where: { id: parseInt(id) },
      include: {
        genrePosterRels: {
          include: {
            genre: true,
          },
        },
        userRatings: true,
      },
    });
    if (!poster) {
      return res.status(404).json({ error: "Poster not found" });
    }
    res.json(poster);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch poster" });
  }
};

// Opret plakat
export const createPoster = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, image, width, height, price, stock } = req.body;
    const poster = await prisma.poster.create({
      data: {
        name,
        slug,
        description,
        image,
        width,
        height,
        price,
        stock,
        createdAt: new Date(),
      },
    });
    res.status(201).json(poster);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create poster" });
  }
};

// Opdater plakat
export const updatePoster = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image, width, height, price, stock } = req.body;
    const poster = await prisma.poster.update({
      where: { id: parseInt(id) },
      data: {
        name,
        slug,
        description,
        image,
        width,
        height,
        price,
        stock,
      },
    });
    res.json(poster);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update poster" });
  }
};

// Slet plakat
export const deletePoster = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.poster.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete poster" });
  }
};
