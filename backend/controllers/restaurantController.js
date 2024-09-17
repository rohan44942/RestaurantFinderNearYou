const Restaurant = require('../models/restaurantModel');

// Get List of Restaurants (With Pagination Support)
// Get List of Restaurants (With Pagination Support)
exports.getRestaurants = async (req, res) => {
  const page = parseInt(req.query.page) || 1;  // Get the page number from the query, default is 1
  const limit = parseInt(req.query.limit) || 10; // Limit per page, default 10
  const skip = (page - 1) * limit;

  try {
    const restaurants = await Restaurant.find().skip(skip).limit(limit); 
    const totalRestaurants = await Restaurant.countDocuments();
    
    res.json({
      page,
      limit,
      totalRestaurants,
      totalPages: Math.ceil(totalRestaurants / limit),
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants", error });
  }
};


// Get Restaurant by ID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurant", error });
  }
};


// Search Restaurants by Location (within a radius)
exports.searchRestaurantsByLocation = async (req, res) => {
  const { lat, lon, radius } = req.query;
  const maxDistance = radius * 1000; // Convert radius from km to meters

  try {
    const restaurants = await Restaurant.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lon), parseFloat(lat)],
          },
          $maxDistance: maxDistance,
        },
      },
    }).select('name description cuisine image location'); // Select the required fields

    res.json({
      page: 1,
      limit: restaurants.length,
      totalRestaurants: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({ message: "Error searching restaurants by location", error });
  }
};


