// routes/cartRoutes.ts
import express from "express";
import {
  getOrCreateCart,
  addItemToCart,
  removeItemFromCart,
  mergeCarts,
  getCart,
  getCurrentUserCart,
} from "../controllers/cart.controller";
import { verifyJWT } from "../middlewares/auth";
import { handleGuestId } from "../middlewares/guestMiddleware";

const router = express.Router();

// Apply guest middleware to all cart routes
router.use(handleGuestId);

// Get or create cart (for both authenticated and guest users)
router.post("/", getOrCreateCart);

// Add item to cart
router.post("/items", addItemToCart);

// Remove item from cart (decrement or remove completely)
router.delete("/:cartId/items/:cartItemId", removeItemFromCart);

// Merge guest cart with user cart (when user logs in)
router.post("/merge", verifyJWT, mergeCarts);

// Get current user's cart (for authenticated users)
router.get("/current",verifyJWT, getCurrentUserCart);

// Get cart by ID
router.get("/:cartId", getCart);

export default router;
