import { Search, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) {
      navigate("/search");
      return;
    }

    navigate(`/search?search=${encodeURIComponent(value)}`);
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search suits, gowns, tops..."
        aria-label="Search products"
      />

      {search ? (
        <button
          type="button"
          className="search-icon"
          onClick={clearSearch}
          aria-label="Clear search"
        >
          <X size={17} />
        </button>
      ) : (
        <button
          type="submit"
          className="search-icon"
          aria-label="Search"
        >
          <Search size={17} />
        </button>
      )}
    </form>
  );
}

export default SearchBar;