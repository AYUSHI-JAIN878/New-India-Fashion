import {
  ArrowUpRight,
  Heart,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">

        <div className="footer-top">

          {/* BRAND + ADDRESS */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              New India
              <span>Fashion</span>
            </Link>

            <p>
              Modern Indian fashion, thoughtfully selected
              for every style and every occasion.
            </p>

            <div className="footer-address">
              <MapPin size={15} />
              <span>
                6331 Netaji Gali,<br />
                Gandhi Nagar, Delhi 31
              </span>
            </div>

            <div className="footer-made-with">
              Made with
              <Heart size={12} fill="currentColor" />
              in India
            </div>
          </div>

          {/* SHOP */}
          <div className="footer-links">
            <h3>Shop</h3>

            <Link to="/category/Suits">
              Ladies Suits
            </Link>

            <Link to="/category/Gowns">
              Gowns
            </Link>

            <Link to="/category/Tops">
              Crop Tops
            </Link>

            <Link to="/category/Indo-Western">
              Indo-Western
            </Link>

            <Link to="/category/Bottomwear">
              Palazzo
            </Link>
          </div>

          {/* CUSTOMER */}
          <div className="footer-links">
            <h3>Customer</h3>

            <Link to="/orders">
              My Orders
            </Link>

            <Link to="/wishlist">
              Wishlist
            </Link>

            <Link to="/cart">
              Shopping Bag
            </Link>

            <Link to="/profile">
              My Account
            </Link>

            <Link to="/search?featured=true">
              New Arrivals
            </Link>
          </div>

          {/* CONTACT */}
          <div className="footer-contact">
            <h3>Contact</h3>

            <a href="mailto:newindiafashion105@gmail.com">
              <Mail size={15} />
              <span>
                newindiafashion105@gmail.com
              </span>
            </a>

            <a href="tel:+919711162022">
              <Phone size={15} />
              <span>
                +91 97111 62022
              </span>
            </a>

            <div>
              <MapPin size={15} />
              <span>
                Delhi, India
              </span>
            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="footer-bottom">

          <span>
            © 2026 New India Fashion. All rights reserved.
          </span>

          <button
            type="button"
            onClick={scrollToTop}
            className="footer-top-btn"
          >
            Back to top
            <ArrowUpRight size={14} />
          </button>

        </div>

      </div>
    </footer>
  );
}

export default Footer;