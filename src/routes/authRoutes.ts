import { Router } from "express";
import { login, getUserProfile } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { authorizeRole } from "../middleware/authorizeRole.js";

const router = Router();

// Subroutes til /login
router.post("/", login);

// Beskyttet route - kræver gyldig token
// Først kører authenticateToken (tjekker om token er gyldig)
// Hvis token er OK, kører getUserProfile og returnerer brugerens data
router.get("/authenticate", authenticateToken, getUserProfile);

// Beskyttet route med rolle-autorisation - kun ADMIN adgang
// Først authenticateToken (token validation), så authorizeRole (rolle check), så getUserProfile
router.get("/authorize", authenticateToken, authorizeRole("ADMIN"), getUserProfile);

export { router as loginRoutes };
