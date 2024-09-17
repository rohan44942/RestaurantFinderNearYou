// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const restaurantRoutes = require('./routes/restaurantRoutes');
// const uploadRoutes = require('./routes/uploadRoutes'); // Import the upload routes
// const cuisineRoutes = require('./routes/cuisineRoutes'); // Import the new routes

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/restaurants', restaurantRoutes);
// app.use('/api', cuisineRoutes);
// app.use('/api', uploadRoutes); // Use the upload routes

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // Use the new routes
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const restaurantRoutes = require("./routes/restaurantRoutes");
const uploadRoutes = require("./routes/uploadRoutes"); // Import the upload routes
const cuisineRoutes = require("./routes/cuisineRoutes"); // Import the new routes

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors()
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this if you are handling URL-encoded payloads

// Static file serving (optional, if needed)
// app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/restaurants", restaurantRoutes);
app.use("/api", uploadRoutes); // Adjust this if needed
app.use("/api", cuisineRoutes); // Ensure this is correctly placed based on your route hierarchy

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
