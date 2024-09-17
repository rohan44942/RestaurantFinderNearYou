import React, { useState } from "react";
import axios from "../services/api";
import { Link } from "react-router-dom";
import "./Search.css";

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
    setResults([]);

    if (!lat || !lon || isNaN(lat) || isNaN(lon) || isNaN(distance)) {
      setError("Please enter valid latitude, longitude, and distance values.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("/restaurants", {
        params: {
          lat: lat.trim(),
          lon: lon.trim(),
          maxDistance: distance.trim(),
        },
      });

      if (response.data.data && response.data.data.length > 0) {
        setResults(response.data.data);
      } else {
        setResults([]);
        setError("No restaurants found within the specified area.");
      }
    } catch (error) {
      console.error("Error searching restaurants:", error);
      setError("Failed to fetch restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Search Restaurants by Location</h1>
      <div className="search-bar-container">
        <label htmlFor="lat">Latitude</label>
        <input
          type="text"
          id="lat"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
        />
        <label htmlFor="lon">Longitude</label>
        <input
          type="text"
          id="lon"
          placeholder="Longitude"
          value={lon}
          onChange={(e) => setLon(e.target.value)}
        />
        <label htmlFor="distance">Distance (miles)</label>
        <input
          type="text"
          id="distance"
          placeholder="Distance (miles)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="results-container">
        {loading ? (
          <div>Loading...</div>
        ) : Array.isArray(results) && results.length > 0 ? (
          results.map((restaurant) => (
            <div key={restaurant._id} className="restaurant-card">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="restaurant-image"
              />
              <div className="restaurant-info">
                <Link to={`/restaurant/${restaurant._id}`} className="restaurant-name">
                  {restaurant.name}
                </Link>
                <p className="restaurant-description">{restaurant.description}</p>
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
    </div>
  );
};

export default Search;
