import { Router } from "express";
import { login, refreshToken, logout, getUserProfile } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { authorizeRole } from "../middleware/authorizeRole.js";

const router = Router();

// Authentication routes
router.post("/", login); // POST /api/login
router.post("/refresh", refreshToken); // POST /api/login/refresh
router.post("/logout", logout); // POST /api/login/logout

// Beskyttet routes - kræver gyldig token
router.get("/authenticate", authenticateToken, getUserProfile); // GET /api/login/authenticate
router.get("/authorize", authenticateToken, authorizeRole("ADMIN"), getUserProfile); // GET /api/login/authorize

export { router as loginRoutes };
