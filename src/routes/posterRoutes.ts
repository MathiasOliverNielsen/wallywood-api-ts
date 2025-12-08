import { Router } from "express";
import { getPosters, getPoster, createPoster, updatePoster, deletePoster } from "../controllers/posterController.js";

const router = Router();

router.get("/", getPosters);
router.get("/:id", getPoster);
router.post("/", createPoster);
router.put("/:id", updatePoster);
router.delete("/:id", deletePoster);

export const posterRoutes = router;
