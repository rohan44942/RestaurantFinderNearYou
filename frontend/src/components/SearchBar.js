import React, { useState } from "react";
import axios from "../services/api";
import "./SearchBar.css";
const Search = () => {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [distance, setDistance] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/restaurants", {
        params: {
          lat: lat.trim(), // Trim to remove any extra spaces
          lon: lon.trim(),
          maxDistance: distance.trim(),
        },
      });
      console.log("Search Results:", response.data.data); // Log response data for debugging
      setResults(response.data.data); // Assuming response.data is an array of restaurants
    } catch (error) {
      console.error("Error searching restaurants:", error);
      setError("Failed to fetch restaurants");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Search Restaurants form</h1>
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
        />
        <input
          type="text"
          placeholder="Longitude"
          value={lon}
          onChange={(e) => setLon(e.target.value)}
        />
        <input
          type="text"
          placeholder="Distance (miles)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <div>{error}</div>}
      <ul>
        <div className="results-container">
          {Array.isArray(results) && results.length > 0 ? (
            results.map((restaurant) => (
              <div key={restaurant._id} className="restaurant-card">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="restaurant-image"
                />
                <div className="restaurant-info">
                  <h2 className="restaurant-name">{restaurant.name}</h2>
                  <p className="restaurant-description">
                    {restaurant.description}
                  </p>
                  <p className="restaurant-cuisine">
                    Cuisine: {restaurant.cuisine.join(", ")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">No results found</div>
          )}
        </div>
      </ul>
    </div>
  );
};

export default Search;
