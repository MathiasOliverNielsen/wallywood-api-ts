import { Request, Response } from "express";
import { prisma } from "../prisma.js";

// Hent alle genrer
export const getGenres = async (req: Request, res: Response) => {
  try {
    const genres = await prisma.genre.findMany({
      include: {
        genrePosterRels: {
          include: {
            poster: true,
          },
        },
      },
    });
    res.json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch genres" });
  }
};

// Hent enkelt genre
export const getGenre = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const genre = await prisma.genre.findUnique({
      where: { slug },
      include: {
        genrePosterRels: {
          include: {
            poster: true,
          },
        },
      },
    });
    if (!genre) {
      return res.status(404).json({ error: "Genre not found" });
    }
    res.json(genre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch genre" });
  }
};

// Opret genre
export const createGenre = async (req: Request, res: Response) => {
  try {
    const { title, slug } = req.body;
    const genre = await prisma.genre.create({
      data: {
        title,
        slug,
        createdAt: new Date(),
      },
    });
    res.status(201).json(genre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create genre" });
  }
};

// Opdater genre
export const updateGenre = async (req: Request, res: Response) => {
  try {
    const { slug: slugParam } = req.params;
    const { title, slug } = req.body;
    const genre = await prisma.genre.update({
      where: { slug: slugParam },
      data: {
        title,
        slug,
      },
    });
    res.json(genre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update genre" });
  }
};

// Slet genre
export const deleteGenre = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    await prisma.genre.delete({
      where: { slug },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete genre" });
  }
};
