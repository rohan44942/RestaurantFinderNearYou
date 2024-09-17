import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To get the restaurant ID from the URL
import axios from "../services/api";
import "./RestaurantDetail.css"; // Import the CSS file

const RestaurantDetail = () => {
  const { id } = useParams(); // Extract the restaurant ID from the URL
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`/restaurants/${id}`); // Fetch restaurant by ID
        setRestaurant(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch restaurant details");
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]); // Run the effect whenever the ID changes

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!restaurant) {
    return <div className="no-restaurant">No restaurant found</div>;
  }

  return (
    <div className="restaurant-detail-container">
      <h1>{restaurant.name}</h1>
      <p>
        <strong>Description:</strong> {restaurant.description}
      </p>
      <p>
        <strong>Cuisine:</strong> {restaurant.cuisine.join(", ")}
      </p>
      <p>
        <strong>Location:</strong> {restaurant.location.coordinates.join(", ")}
      </p>
      <img
        src={restaurant.image}
        alt={restaurant.name}
        className="restaurant-image"
      />
    </div>
  );
};

export default RestaurantDetail;
