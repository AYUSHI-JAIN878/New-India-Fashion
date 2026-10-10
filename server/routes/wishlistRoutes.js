import express from "express";

import {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getWishlist);

// Add / toggle wishlist
router.post("/", toggleWishlist);

// Remove specific product
router.delete("/:productId", removeFromWishlist);

export default router;