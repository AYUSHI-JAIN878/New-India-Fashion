
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import imageSearchRoutes from "./routes/imageSearchRoutes.js";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Allowed frontend origins
const allowedOrigins = [
  "https://new-india-fashion.vercel.app",
  "http://localhost:5173",
];

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // and requests from approved frontend origins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/image-search", imageSearchRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "New India Fashion API is running",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
