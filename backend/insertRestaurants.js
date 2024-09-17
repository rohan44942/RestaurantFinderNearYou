const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Restaurant = require("./models/restaurantModel"); // Adjust model path

// Get the file name from command-line arguments
const fileName = process.argv[2]; // The third argument in the command line
if (!fileName) {
  console.error(
    "Please provide the JSON file name as a command-line argument."
  );
  process.exit(1);
}

// Path to your JSON file
const jsonFilePath = path.join(__dirname, "data", fileName);
console.log("Looking for JSON file at:", jsonFilePath); // Print the path to verify

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/restaurants", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    insertRestaurantsFromFile(); // Start the data insertion after connection
  })
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Function to insert restaurant data into MongoDB
const insertRestaurant = async (restaurant) => {
  try {
    const newRestaurant = new Restaurant({
      name: restaurant.name,
      location: {
        type: "Point",
        coordinates: [
          parseFloat(restaurant.location.longitude),
          parseFloat(restaurant.location.latitude),
        ],
      },
      cuisine: restaurant.cuisines.split(", "), // Split cuisines into an array
      image: restaurant.featured_image,
      description: restaurant.user_rating.rating_text, // Using rating text as description for simplicity
    });

    await newRestaurant.save();
    console.log("Restaurant inserted successfully:", newRestaurant.name);
  } catch (error) {
    console.error("Error inserting restaurant:", error);
  }
};

// Function to read JSON data from the file and insert each restaurant
const insertRestaurantsFromFile = () => {
  fs.readFile(jsonFilePath, "utf8", async (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);

      // Loop over each result (if there are multiple), and handle restaurants array
      for (const result of jsonData) {
        if (Array.isArray(result.restaurants)) {
          for (const item of result.restaurants) {
            await insertRestaurant(item.restaurant);
          }
        } else {
          console.log("No restaurants found in the JSON data.");
        }
      }
    } catch (err) {
      console.error("Error parsing JSON:", err);
    } finally {
      mongoose.connection.close(); // Close the MongoDB connection
    }
  });
};

// Start the process
