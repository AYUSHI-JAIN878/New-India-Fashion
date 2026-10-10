import { useRef, useState } from "react";
import { Camera, ImagePlus, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ImageSearch() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [searching, setSearching] = useState(false);

  const handleImageSelect = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setSelectedImage(file);
    setPreview(imageUrl);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    handleImageSelect(file);
  };

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setSelectedImage(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSearch = async () => {
    if (!selectedImage) return;

    try {
      setSearching(true);

      /*
       * Abhi frontend image-search flow.
       * Backend/Gemini/Cloudinary connect karne ke baad
       * yahin actual API call add karenge.
       */

      navigate("/image-search", {
        state: {
          image: preview,
          fileName: selectedImage.name,
        },
      });
    } catch (error) {
      console.error("Image search error:", error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="image-search">

      {/* UPLOAD BUTTONS */}

      {!preview && (
        <div className="image-search-actions">

          <button
            type="button"
            className="image-search-upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus size={18} />
            <span>Upload Image</span>
          </button>

          <button
            type="button"
            className="image-search-camera-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera size={17} />
          </button>

        </div>
      )}

      {/* FILE INPUT */}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        hidden
      />

      {/* IMAGE PREVIEW */}

      {preview && (
        <div className="image-search-preview">

          <div className="image-search-preview-image">
            <img
              src={preview}
              alt="Selected fashion"
            />

            <button
              type="button"
              className="image-search-remove"
              onClick={handleRemove}
              aria-label="Remove image"
            >
              <X size={15} />
            </button>
          </div>

          <div className="image-search-preview-info">

            <span>
              Image selected
            </span>

            <button
              type="button"
              className="image-search-submit"
              onClick={handleSearch}
              disabled={searching}
            >
              <Search size={15} />

              {searching
                ? "Searching..."
                : "Find Similar Products"}
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default ImageSearch;