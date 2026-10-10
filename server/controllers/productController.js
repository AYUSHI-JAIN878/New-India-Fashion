import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

// Upload one image buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = "new-india-fashion") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// =========================
// GET ALL PRODUCTS
// =========================
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      subCategory,
      search,
      featured,
      minPrice,
      maxPrice,
    } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (subCategory) {
      filter.subCategory = {
        $regex: subCategory,
        $options: "i",
      };
    }

    if (featured === "true") {
      filter.featured = true;
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { subCategory: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { fabric: { $regex: search, $options: "i" } },
        { work: { $regex: search, $options: "i" } },
        { colors: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// GET SINGLE PRODUCT
// =========================
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// CREATE PRODUCT
// =========================
export const createProduct = async (req, res) => {
  try {
    let productData = {};

    // Product data JSON
    if (req.body.productData) {
      productData = JSON.parse(req.body.productData);
    } else {
      productData = { ...req.body };
    }

    // Main product images
    const mainImages = [];

    if (req.files?.mainImages) {
      for (const file of req.files.mainImages) {
        const imageUrl = await uploadToCloudinary(
          file.buffer,
          "new-india-fashion/products"
        );

        mainImages.push(imageUrl);
      }
    }

    // Color variant images
    const colorVariants = productData.colorVariants || [];

    if (req.files?.colorImages) {
      for (let i = 0; i < req.files.colorImages.length; i++) {
        const file = req.files.colorImages[i];

        const imageUrl = await uploadToCloudinary(
          file.buffer,
          "new-india-fashion/color-variants"
        );

        if (colorVariants[i]) {
          colorVariants[i].image = imageUrl;
        }
      }
    }

    const product = await Product.create({
      ...productData,
      images: mainImages,
      colorVariants,
      colors: colorVariants.map((item) => item.name),
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// UPDATE PRODUCT
// =========================
export const updateProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let productData = {};

    if (req.body.productData) {
      productData = JSON.parse(req.body.productData);
    } else {
      productData = { ...req.body };
    }

    // Keep existing images unless new ones are uploaded
    let images = existingProduct.images || [];

    if (req.files?.mainImages?.length) {
      images = [];

      for (const file of req.files.mainImages) {
        const imageUrl = await uploadToCloudinary(
          file.buffer,
          "new-india-fashion/products"
        );

        images.push(imageUrl);
      }
    }

    // Color variants
    let colorVariants =
      productData.colorVariants || existingProduct.colorVariants || [];

    if (req.files?.colorImages?.length) {
      for (let i = 0; i < req.files.colorImages.length; i++) {
        const file = req.files.colorImages[i];

        const imageUrl = await uploadToCloudinary(
          file.buffer,
          "new-india-fashion/color-variants"
        );

        if (colorVariants[i]) {
          colorVariants[i].image = imageUrl;
        }
      }
    }

    productData.images = images;
    productData.colorVariants = colorVariants;
    productData.colors = colorVariants.map((item) => item.name);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// DELETE PRODUCT
// =========================
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};