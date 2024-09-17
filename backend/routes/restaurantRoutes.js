const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

// Get Restaurant by ID
router.get("/:id", restaurantController.getRestaurantById);

// Get List of Restaurants
router.get("/", restaurantController.getRestaurants);

// Search Restaurants by Location (Latitude, Longitude, and Radius)
router.get("/search",restaurantController.searchRestaurantsByLocation);
// router.get("/search", async (req, res) => {
//   const { query } = req.query;
//   try {
//     const restaurants = await Restaurant.find({ name: new RegExp(query, "i") }); // Case-insensitive search
//     res.json(restaurants);
//   } catch (err) {
//     res.status(500).send("Error fetching restaurants");
//   }
// });

module.exports = router;
