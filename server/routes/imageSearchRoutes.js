import express from "express";
import multer from "multer";

import {
  imageSearch,
} from "../controllers/imageSearchController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/",
  protect,
  upload.single("image"),
  imageSearch
);

export default router;