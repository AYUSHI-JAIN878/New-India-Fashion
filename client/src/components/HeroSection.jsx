import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

function HeroSection() {
  return (
    <section className="fashion-hero">

      {/* LEFT CONTENT */}
      <div className="hero-content">

        <span className="hero-eyebrow">
          <Sparkles size={14} />
          New India Fashion
        </span>

        <h1>
          Style that
          <span>feels like you.</span>
        </h1>

        <p>
          Discover elegant Indian fashion, everyday essentials
          and statement pieces curated for every occasion.
        </p>

        <div className="hero-actions">

          <Link
            to="/search?featured=true"
            className="hero-primary-btn"
          >
            Explore Collection
            <ArrowRight size={17} />
          </Link>

          <Link
            to="/search"
            className="hero-secondary-btn"
          >
            Shop New Arrivals
          </Link>

        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="hero-image-wrapper">

        <div className="hero-image-card">

          <img
            src="/images/New_India_Fashion.jpg"
            alt="New India Fashion Collection"
            className="hero-image"
          />

          <div className="hero-image-overlay"></div>

        </div>

        {/* FLOATING CARD */}
        <div className="hero-floating-card">

          <span>NEW</span>

          <strong>
            Season Collection
          </strong>

          <small>
            Fresh styles • Indian elegance
          </small>

        </div>

      </div>

    </section>
  );
}

export default HeroSection;