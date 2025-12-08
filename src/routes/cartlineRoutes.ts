import { Router } from "express";
import { getCartlines, addToCart, updateCartline, removeFromCart, clearCart } from "../controllers/cartlineController.js";

const router = Router();

router.get("/user/:userId", getCartlines);
router.post("/", addToCart);
router.put("/:id", updateCartline);
router.delete("/:id", removeFromCart);
router.delete("/user/:userId/clear", clearCart);

export const cartlineRoutes = router;
