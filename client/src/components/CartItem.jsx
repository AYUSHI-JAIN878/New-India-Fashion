import { Trash2 } from "lucide-react";
import QuantitySelector from "./QuantitySelector";
import { useCart } from "../context/CartContext";

function CartItem({ item }) {
  const { updateCartItem, removeFromCart } = useCart();

  const product = item?.product;

  if (!product) return null;

  const image = product.images?.[0];

  const itemTotal = product.price * item.quantity;

  const handleQuantityChange = async (quantity) => {
    if (quantity < 1) return;

    await updateCartItem(item._id, quantity);
  };

  const handleRemove = async () => {
    await removeFromCart(item._id);
  };

  return (
    <article className="cart-item">

      {/* PRODUCT IMAGE */}
      <div className="cart-item-image">

        {image ? (
          <img
            src={image}
            alt={product.name}
          />
        ) : (
          <div className="cart-image-placeholder">
            <span>NEW INDIA</span>
            <small>FASHION</small>
          </div>
        )}

      </div>

      {/* PRODUCT DETAILS */}
      <div className="cart-item-details">

        <span className="cart-item-category">
          {product.subCategory || product.category}
        </span>

        <h3 className="cart-item-name">
          {product.name}
        </h3>

        <div className="cart-item-variants">

          {item.size && (
            <span>
              <strong>Size:</strong> {item.size}
            </span>
          )}

          {item.color && (
            <span>
              <strong>Color:</strong> {item.color}
            </span>
          )}

        </div>

        <div className="cart-item-price">
          ₹{product.price.toLocaleString("en-IN")}
        </div>

        <div className="cart-item-actions">

          <QuantitySelector
            quantity={item.quantity}
            max={product.stock || 10}
            onChange={handleQuantityChange}
          />

          <button
            type="button"
            className="remove-cart-btn"
            onClick={handleRemove}
          >
            <Trash2 size={15} />
            <span>Remove</span>
          </button>

        </div>

      </div>

      {/* TOTAL */}
      <div className="cart-item-total-wrapper">

        <span className="cart-total-label">
          Total
        </span>

        <div className="cart-item-total">
          ₹{itemTotal.toLocaleString("en-IN")}
        </div>

      </div>

    </article>
  );
}

export default CartItem;