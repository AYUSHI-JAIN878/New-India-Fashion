import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function CategoryCard({
  name,
  description,
  path,
  icon,
}) {
  return (
    <Link
      to={path}
      className="category-card"
    >
      <div className="category-circle">
        {icon}
      </div>

      <div className="category-card-content">
        <h3>{name}</h3>

        <p>
          {description}
        </p>

        <ArrowUpRight
          size={17}
          style={{
            marginTop: "12px",
          }}
        />
      </div>
    </Link>
  );
}

export default CategoryCard;