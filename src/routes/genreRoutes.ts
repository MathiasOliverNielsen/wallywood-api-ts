import { Router } from "express";
import { getGenres, getGenre, createGenre, updateGenre, deleteGenre } from "../controllers/genreController.js";

const router = Router();

router.get("/", getGenres);
router.get("/:slug", getGenre);
router.post("/", createGenre);
router.put("/:slug", updateGenre);
router.delete("/:slug", deleteGenre);

export const genreRoutes = router;
