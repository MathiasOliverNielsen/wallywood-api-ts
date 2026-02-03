import { Request, Response } from "express";
import { prisma } from "../prisma.js";

// Hent plakater efter genre slug
export const getPostersByGenre = async (req: Request, res: Response) => {
  try {
    const { genreSlug } = req.params;
    const { limit, offset, sort } = req.query;

    // Parse limit and offset
    const limitNumber = limit ? parseInt(limit as string) : 20;
    const offsetNumber = offset ? parseInt(offset as string) : 0;

    // Build order by clause based on sort parameter
    let orderBy: any = {};
    if (sort === "asc") {
      orderBy = { price: "asc" };
    } else if (sort === "desc") {
      orderBy = { price: "desc" };
    } else if (sort === "name") {
      orderBy = { name: "asc" };
    }

    const posters = await prisma.poster.findMany({
      where: {
        genrePosterRels: {
          some: {
            genre: {
              slug: genreSlug,
            },
          },
        },
      },
      include: {
        genrePosterRels: {
          include: {
            genre: true,
          },
        },
      },
      orderBy: Object.keys(orderBy).length > 0 ? orderBy : undefined,
      take: limitNumber,
      skip: offsetNumber,
    });

    // Transform genrePosterRels to genres for easier frontend use
    const transformedPosters = posters.map((poster) => ({
      ...poster,
      genres: poster.genrePosterRels.map((rel) => rel.genre),
    }));

    res.json(transformedPosters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch posters by genre" });
  }
};

// Hent alle plakater
export const getPosters = async (req: Request, res: Response) => {
  try {
    const { limit, offset, sort } = req.query;

    // Parse limit and offset
    const limitNumber = limit ? parseInt(limit as string) : 20;
    const offsetNumber = offset ? parseInt(offset as string) : 0;

    // Build order by clause based on sort parameter
    let orderBy: any = {};
    if (sort === "asc") {
      orderBy = { price: "asc" };
    } else if (sort === "desc") {
      orderBy = { price: "desc" };
    } else if (sort === "name") {
      orderBy = { name: "asc" };
    }

    const posters = await prisma.poster.findMany({
      include: {
        genrePosterRels: {
          include: {
            genre: true,
          },
        },
      },
      orderBy: Object.keys(orderBy).length > 0 ? orderBy : undefined,
      take: limitNumber,
      skip: offsetNumber,
    });

    // Transform genrePosterRels to genres for easier frontend use
    const transformedPosters = posters.map((poster) => ({
      ...poster,
      genres: poster.genrePosterRels.map((rel) => rel.genre),
    }));

    res.json(transformedPosters);
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

// Hent enkelt plakat via slug
export const getPosterBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const poster = await prisma.poster.findUnique({
      where: { slug: slug },
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
