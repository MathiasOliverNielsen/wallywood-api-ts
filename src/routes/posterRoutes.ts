import { Router } from "express";
import { getPosters, getPoster, getPosterBySlug, createPoster, updatePoster, deletePoster, getPostersByGenre } from "../controllers/posterController.js";

const router = Router();

router.get("/", getPosters);
router.get("/genre/:genreSlug", getPostersByGenre);
router.get("/slug/:slug", getPosterBySlug);
router.get("/:id", getPoster);
router.post("/", createPoster);
router.put("/:id", updatePoster);
router.delete("/:id", deletePoster);

export const posterRoutes = router;
