import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "../services/api";
import SearchBar from "./SearchBar"; // Import SearchBar component
import "./RestaurantList.css"; // Import the CSS file

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true); // To track if more data is available for infinite scroll

  // Search parameters
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [distance, setDistance] = useState("");
  const [query, setQuery] = useState(""); // Add query to search across database

  const observer = useRef(); // For infinite scroll

  const fetchRestaurants = async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = {
        lat: lat || undefined, // Latitude for location-based search
        lon: lon || undefined, // Longitude for location-based search
        maxDistance: distance || undefined, // Distance in kilometers
        page: pageNum, // Pagination page
        limit: 10, // Limit of restaurants per page
      };
  
      const response = await axios.get("/restaurants", { params });
  
      if (pageNum === 1) {
        setRestaurants(response.data.data); // First page or new search
      } else {
        setRestaurants((prevRestaurants) => [
          ...prevRestaurants,
          ...response.data.data,
        ]); // Append new restaurants for infinite scroll
      }
  
      setHasMore(response.data.data.length > 0); // Check if more restaurants are available
    } catch (err) {
      setError("Failed to fetch restaurants");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchRestaurants(page); // Fetch the first page of data initially
  }, [lat, lon, distance, query, page]); // Fetch data again if search parameters or page change

  const handleSearch = () => {
    setPage(1); // Reset to the first page on new search
    fetchRestaurants(1); // Trigger a new search
  };

  // Infinite Scroll: Check when the user scrolls near the bottom of the page
  const lastRestaurantRef = useRef();
  useEffect(() => {
    const observerCallback = (entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const observerInstance = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
    });

    if (lastRestaurantRef.current) {
      observerInstance.observe(lastRestaurantRef.current);
    }

    return () => {
      if (lastRestaurantRef.current) {
        observerInstance.unobserve(lastRestaurantRef.current);
      }
    };
  }, [hasMore, loading]);

  if (loading && page === 1) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="restaurant-list-container">
      {/* <SearchBar
        lat={lat}
        setLat={setLat}
        lon={lon}
        setLon={setLon}
        distance={distance}
        setDistance={setDistance}
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
      /> */}
      <h1>Restaurant List</h1>
      <div className="restaurant-list">
        {restaurants.map((restaurant, index) => (
          <div
            key={restaurant._id}
            className="restaurant-card"
            ref={index === restaurants.length - 1 ? lastRestaurantRef : null}
          >
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="restaurant-image"
            />
            <div className="restaurant-info">
              <Link
                to={`/restaurant/${restaurant._id}`}
                className="restaurant-name"
              >
                {restaurant.name}
              </Link>
              <p className="restaurant-description">
                {restaurant.description}
              </p>
              <p className="restaurant-cuisine">
                Cuisine: {restaurant.cuisine.join(", ")}
              </p>
            </div>
          </div>
        ))}
        {loading && page > 1 && <p>Loading more restaurants...</p>}
      </div>
      {!hasMore && <p>No more restaurants to show</p>}
    </div>
  );
};

export default RestaurantList;
