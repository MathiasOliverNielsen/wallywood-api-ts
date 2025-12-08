import { Router } from "express";
import { getRatings, createOrUpdateRating, deleteRating, getAverageRating } from "../controllers/ratingController.js";

const router = Router();

router.get("/poster/:posterId", getRatings);
router.get("/poster/:posterId/average", getAverageRating);
router.post("/", createOrUpdateRating);
router.delete("/:userId/:posterId", deleteRating);

export const ratingRoutes = router;
