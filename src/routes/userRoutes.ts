import { Router } from "express";
import { getUsers, getUser, createUser, updateUser, deleteUser, getRecords } from "../controllers/userController.js";

const router = Router();

router.get("/", getUsers);
router.get("/records", getRecords); // Bagudkompatibilitet
router.get("/:id", getUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export const userRoutes = router;
