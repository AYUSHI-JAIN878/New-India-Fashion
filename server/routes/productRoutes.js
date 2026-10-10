import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin-only routes
router.post(
  "/",
  protect,
  adminOnly,
  upload.fields([
    { name: "mainImages", maxCount: 10 },
    { name: "colorImages", maxCount: 20 },
  ]),
  createProduct
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.fields([
    { name: "mainImages", maxCount: 10 },
    { name: "colorImages", maxCount: 20 },
  ]),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

export default router;