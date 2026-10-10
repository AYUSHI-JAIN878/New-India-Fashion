
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  ImagePlus,
  Package,
  Plus,
  Save,
  Trash2,
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import "./AdminProductForm.css";

const API_URL = "http://localhost:5000/api/products";

const CATEGORIES = [
  "Suits",
  "Gowns",
  "Tops",
  "Indo-Western",
  "Bottomwear",
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

const DETAILS_FIELDS = [
  ["fabric", "Fabric"],
  ["work", "Work / Embroidery"],
  ["pattern", "Pattern"],
  ["fit", "Fit"],
  ["occasion", "Occasion"],
  ["sleeve", "Sleeve"],
  ["neck", "Neck Style"],
  ["length", "Length"],
];

const INITIAL_FORM = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  category: "Suits",
  subCategory: "",
  sizes: [],
  fabric: "",
  work: "",
  pattern: "",
  fit: "",
  occasion: "",
  sleeve: "",
  neck: "",
  length: "",
  careInstructions: "",
  stock: "0",
  featured: false,
};

function AdminProductForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [mainImages, setMainImages] = useState([]);
  const [mainPreviews, setMainPreviews] = useState([]);
  const [colors, setColors] = useState([
    { name: "", file: null, preview: "" },
  ]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  useEffect(() => {
    return () => {
      mainPreviews.forEach((url) => URL.revokeObjectURL(url));

      colors.forEach((color) => {
        if (color.preview) {
          URL.revokeObjectURL(color.preview);
        }
      });
    };
  }, [mainPreviews, colors]);

  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((item) => item !== size)
        : [...prev.sizes, size],
    }));
  };

  const updateColor = (index, changes) => {
    setColors((prev) =>
      prev.map((color, i) =>
        i === index ? { ...color, ...changes } : color
      )
    );
  };

  const addColor = () => {
    if (colors.length >= 20) {
      setMessage("Maximum 20 color variants allowed hain.");
      setMessageType("error");
      return;
    }

    setColors((prev) => [
      ...prev,
      { name: "", file: null, preview: "" },
    ]);
  };

  const removeColor = (index) => {
    const color = colors[index];

    if (color?.preview) {
      URL.revokeObjectURL(color.preview);
    }

    setColors((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleMainImages = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length > 10) {
      setMessage("Maximum 10 main images select karo.");
      setMessageType("error");
      event.target.value = "";
      return;
    }

    if (files.some((file) => !file.type.startsWith("image/"))) {
      setMessage("Sirf image files upload kar sakte ho.");
      setMessageType("error");
      event.target.value = "";
      return;
    }

    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      setMessage("Har image ka size 5 MB se kam hona chahiye.");
      setMessageType("error");
      event.target.value = "";
      return;
    }

    mainPreviews.forEach((url) => URL.revokeObjectURL(url));

    setMainImages(files);
    setMainPreviews(
      files.map((file) => URL.createObjectURL(file))
    );
    setMessage("");
  };

  const handleColorFile = (index, file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Color variant ke liye image file select karo.");
      setMessageType("error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Color image 5 MB se chhoti honi chahiye.");
      setMessageType("error");
      return;
    }

    const previous = colors[index]?.preview;

    if (previous) {
      URL.revokeObjectURL(previous);
    }

    updateColor(index, {
      file,
      preview: URL.createObjectURL(file),
    });

    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const name = form.name.trim();
    const price = Number(form.price);

    const originalPrice =
      form.originalPrice === ""
        ? undefined
        : Number(form.originalPrice);

    const stock = Number(form.stock);

    if (!name || !form.description.trim()) {
      setMessage("Product name aur description required hain.");
      setMessageType("error");
      return;
    }

    if (
      form.price === "" ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      setMessage("Selling price zero se zyada honi chahiye.");
      setMessageType("error");
      return;
    }

    if (
      originalPrice !== undefined &&
      (!Number.isFinite(originalPrice) || originalPrice < price)
    ) {
      setMessage(
        "Original price selling price ke barabar ya usse zyada rakho."
      );
      setMessageType("error");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setMessage(
        "Stock ek valid non-negative whole number hona chahiye."
      );
      setMessageType("error");
      return;
    }

    if (!mainImages.length) {
      setMessage("Kam se kam ek main product image upload karo.");
      setMessageType("error");
      return;
    }

    const enteredColors = colors.filter(
      (color) => color.name.trim() || color.file
    );

    if (
      enteredColors.some(
        (color) => !color.name.trim() || !color.file
      )
    ) {
      setMessage(
        "Har color ke liye color name aur image dono zaroori hain."
      );
      setMessageType("error");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Login session nahi mila. Dobara login karo.");
      setMessageType("error");
      return;
    }

    const productData = {
      ...form,
      name,
      description: form.description.trim(),
      price,
      originalPrice,
      stock,
      sizes: form.sizes,
      colors: enteredColors.map((color) => color.name.trim()),
      colorVariants: enteredColors.map((color) => ({
        name: color.name.trim(),
      })),
    };

    const data = new FormData();

    data.append("productData", JSON.stringify(productData));

    mainImages.forEach((file) => {
      data.append("mainImages", file);
    });

    enteredColors.forEach((color) => {
      data.append("colorImages", color.file);
    });

    try {
      setSaving(true);

      await axios.post(API_URL, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Product successfully add ho gaya!");
      setMessageType("success");

      setForm({ ...INITIAL_FORM });
      setMainImages([]);

      mainPreviews.forEach((url) => URL.revokeObjectURL(url));
      setMainPreviews([]);

      colors.forEach((color) => {
        if (color.preview) {
          URL.revokeObjectURL(color.preview);
        }
      });

      setColors([{ name: "", file: null, preview: "" }]);
      event.target.reset();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Product save nahi hua. Backend, admin role aur Cloudinary settings check karo."
      );
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="admin-product-page">
      <div className="admin-product-topline">
        <Link to="/admin" className="admin-back-link">
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <span className="admin-secure-label">
          <BadgeCheck size={16} />
          Store management
        </span>
      </div>

      <header className="admin-product-heading">
        <div>
          <p className="admin-eyebrow">
            <Sparkles size={14} />
            NEW INDIA FASHION · CATALOGUE
          </p>

          <h1>Add a new product</h1>

          <p className="admin-subtitle">
            Create a polished product listing for your customers.
          </p>
        </div>

        <div className="admin-step-chip">
          <span>01</span> Product details
          <span className="admin-step-divider">/</span>
          <span>02</span> Images
        </div>
      </header>

      {message && (
        <div
          className={`admin-alert ${messageType}`}
          role="status"
        >
          {messageType === "success" ? (
            <CheckCircle2 size={19} />
          ) : (
            <AlertCircle size={19} />
          )}
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="admin-product-form"
      >
        <section className="admin-form-card">
          <div className="admin-section-heading">
            <span className="admin-section-icon">
              <Package size={19} />
            </span>

            <div>
              <h2>Product information</h2>
              <p>
                Start with the essential details customers will see.
              </p>
            </div>
          </div>

          <div className="admin-form-grid">
            <div className="admin-field admin-field-wide">
              <label htmlFor="name">
                Product name <span>*</span>
              </label>

              <input
                id="name"
                required
                maxLength={150}
                placeholder="e.g. Embroidered Anarkali Suit Set"
                value={form.name}
                onChange={(e) =>
                  updateField("name", e.target.value)
                }
              />
            </div>

            <div className="admin-field">
              <label htmlFor="category">
                Category <span>*</span>
              </label>

              <select
                id="category"
                value={form.category}
                onChange={(e) =>
                  updateField("category", e.target.value)
                }
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-field">
              <label htmlFor="subCategory">Subcategory</label>

              <input
                id="subCategory"
                placeholder="e.g. Anarkali, Party Wear"
                value={form.subCategory}
                onChange={(e) =>
                  updateField("subCategory", e.target.value)
                }
              />
            </div>

            <div className="admin-field">
              <label htmlFor="price">
                Selling price (₹) <span>*</span>
              </label>

              <div className="admin-input-prefix">
                <span>₹</span>
                <input
                  id="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="1499"
                  value={form.price}
                  onChange={(e) =>
                    updateField("price", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="admin-field">
              <label htmlFor="originalPrice">
                Original price (₹)
              </label>

              <div className="admin-input-prefix">
                <span>₹</span>
                <input
                  id="originalPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="1999"
                  value={form.originalPrice}
                  onChange={(e) =>
                    updateField("originalPrice", e.target.value)
                  }
                />
              </div>

              <small>
                Optional — use this to show a discount.
              </small>
            </div>

            <div className="admin-field">
              <label htmlFor="stock">
                Stock quantity <span>*</span>
              </label>

              <input
                id="stock"
                type="number"
                min="0"
                step="1"
                required
                placeholder="50"
                value={form.stock}
                onChange={(e) =>
                  updateField("stock", e.target.value)
                }
              />
            </div>

            <div className="admin-field admin-field-wide">
              <label htmlFor="description">
                Product description <span>*</span>
              </label>

              <textarea
                id="description"
                rows={4}
                required
                maxLength={5000}
                placeholder="Describe the fabric, fit, detailing and what makes this piece special..."
                value={form.description}
                onChange={(e) =>
                  updateField("description", e.target.value)
                }
              />

              <small>
                {form.description.length}/5000 characters
              </small>
            </div>
          </div>

          <label className="admin-featured-toggle">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                updateField("featured", e.target.checked)
              }
            />

            <span className="admin-toggle-copy">
              <strong>Feature this product</strong>
              <small>
                Highlight it in the store's featured collection.
              </small>
            </span>
          </label>
        </section>

        <section className="admin-form-card">
          <div className="admin-section-heading">
            <span className="admin-section-icon">
              <BadgeCheck size={19} />
            </span>

            <div>
              <h2>Sizes & fit</h2>
              <p>
                Select every size available for this product.
              </p>
            </div>
          </div>

          <div className="admin-size-list">
            {SIZES.map((size) => (
              <label
                key={size}
                className={`admin-size-option ${
                  form.sizes.includes(size) ? "selected" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.sizes.includes(size)}
                  onChange={() => toggleSize(size)}
                />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="admin-form-card">
          <div className="admin-section-heading">
            <span className="admin-section-icon">
              <Sparkles size={19} />
            </span>

            <div>
              <h2>Fabric & style details</h2>
              <p>
                Help customers understand the finer details of this piece.
              </p>
            </div>
          </div>

          <div className="admin-form-grid">
            {DETAILS_FIELDS.map(([name, label]) => (
              <div className="admin-field" key={name}>
                <label htmlFor={name}>{label}</label>

                <input
                  id={name}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  value={form[name]}
                  onChange={(e) =>
                    updateField(name, e.target.value)
                  }
                />
              </div>
            ))}

            <div className="admin-field admin-field-wide">
              <label htmlFor="careInstructions">
                Care instructions
              </label>

              <textarea
                id="careInstructions"
                rows={2}
                placeholder="e.g. Dry clean only. Store in a cool, dry place."
                value={form.careInstructions}
                onChange={(e) =>
                  updateField("careInstructions", e.target.value)
                }
              />
            </div>
          </div>
        </section>

        <section className="admin-form-card">
          <div className="admin-section-heading">
            <span className="admin-section-icon">
              <ImagePlus size={19} />
            </span>

            <div>
              <h2>Product photography</h2>
              <p>
                Use clear, high-quality images. JPG, PNG or WebP,
                up to 5 MB each.
              </p>
            </div>
          </div>

          <label className="admin-upload-zone">
            <input
              type="file"
              accept="image/*"
              multiple
              required
              onChange={handleMainImages}
            />

            <span className="admin-upload-icon">
              <UploadCloud size={25} />
            </span>

            <strong>
              Click to upload or drag your images here
            </strong>

            <small>
              Main product images · Maximum 10 images
            </small>

            <span className="admin-upload-button">
              Choose images
            </span>
          </label>

          {mainPreviews.length > 0 && (
            <div className="admin-preview-grid">
              {mainPreviews.map((src, index) => (
                <div
                  className="admin-preview-card"
                  key={src}
                >
                  <img
                    src={src}
                    alt={`Product preview ${index + 1}`}
                  />

                  <span>Image {index + 1}</span>

                  <button
                    type="button"
                    aria-label={`Remove image ${index + 1}`}
                    onClick={() => {
                      URL.revokeObjectURL(src);

                      setMainPreviews((prev) =>
                        prev.filter((item) => item !== src)
                      );

                      setMainImages((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="admin-form-card">
          <div className="admin-section-heading admin-section-heading-between">
            <div className="admin-section-heading">
              <span className="admin-section-icon">
                <Sparkles size={19} />
              </span>

              <div>
                <h2>Colour variants</h2>
                <p>
                  Add a separate image for each available colour.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="admin-button admin-button-outline admin-add-colour"
              onClick={addColor}
            >
              <Plus size={16} />
              Add colour
            </button>
          </div>

          <div className="admin-colour-list">
            {colors.map((color, index) => (
              <div
                className="admin-colour-row"
                key={index}
              >
                <div className="admin-field">
                  <label htmlFor={`color-${index}`}>
                    Colour name
                  </label>

                  <input
                    id={`color-${index}`}
                    placeholder="e.g. Maroon"
                    value={color.name}
                    onChange={(e) =>
                      updateColor(index, {
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <label className="admin-colour-upload">
                  <span>Colour image</span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleColorFile(
                        index,
                        e.target.files?.[0]
                      )
                    }
                  />
                </label>

                {color.preview && (
                  <img
                    className="admin-colour-preview"
                    src={color.preview}
                    alt={`${color.name || "Colour"} preview`}
                  />
                )}

                <button
                  type="button"
                  className="admin-icon-button admin-danger-button"
                  aria-label="Remove colour"
                  onClick={() => removeColor(index)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>

          <p className="admin-help-note">
            Colour names and images must both be provided for
            each variant you add.
          </p>
        </section>

        <div className="admin-form-actions">
          <button
            type="button"
            className="admin-button admin-button-outline"
            onClick={() => navigate("/admin")}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="admin-button admin-button-primary"
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="admin-spinner" />
                Saving product…
              </>
            ) : (
              <>
                <Save size={17} />
                Save product
              </>
            )}
          </button>
        </div>

        <p className="admin-form-footnote">
          Fields marked <span>*</span> are required. Your product
          will be saved to the store catalogue.
        </p>
      </form>
    </main>
  );
}

export default AdminProductForm;