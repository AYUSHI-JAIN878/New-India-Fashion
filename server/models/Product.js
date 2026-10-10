import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    originalPrice: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Suits",
        "Gowns",
        "Tops",
        "Indo-Western",
        "Bottomwear",
      ],
    },

    subCategory: {
      type: String,
      default: "",
      trim: true,
    },

    // Main product images
    images: [
      {
        type: String,
      },
    ],

    // Available sizes
    sizes: [
      {
        type: String,
        trim: true,
      },
    ],

    // Keep this for compatibility with your existing products
    colors: [
      {
        type: String,
        trim: true,
      },
    ],

    // New: color + image for circular color selector
    colorVariants: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        image: {
          type: String,
          required: true,
        },
      },
    ],

    // Product details
    fabric: {
      type: String,
      default: "",
      trim: true,
    },

    work: {
      type: String,
      default: "",
      trim: true,
    },

    pattern: {
      type: String,
      default: "",
      trim: true,
    },

    fit: {
      type: String,
      default: "",
      trim: true,
    },

    occasion: {
      type: String,
      default: "",
      trim: true,
    },

    sleeve: {
      type: String,
      default: "",
      trim: true,
    },

    neck: {
      type: String,
      default: "",
      trim: true,
    },

    length: {
      type: String,
      default: "",
      trim: true,
    },

    careInstructions: {
      type: String,
      default: "",
      trim: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    brand: {
      type: String,
      default: "New India Fashion",
    },

    // Calculated/updated when reviews are added
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;