import { Minus, Plus } from "lucide-react";

function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 10,
}) {
  const decrease = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const increase = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="quantity-selector">
      <button
        type="button"
        onClick={decrease}
        disabled={quantity <= min}
      >
        <Minus size={14} />
      </button>

      <span>{quantity}</span>

      <button
        type="button"
        onClick={increase}
        disabled={quantity >= max}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

export default QuantitySelector;