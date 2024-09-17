const express = require("express");
const axios = require("axios");
const router = express.Router();
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

// Replace with your Gemini API endpoint and API key
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const GEMINI_API_KEY = "AIzaSyCnix898QB0evEQDUIhSW7d3a7ee8XNbS8";

// Route for analyzing food image and getting cuisine
router.post("/analyze-food", async (req, res) => {
  const { filePath } = req.body;

  const prompt = "find the cuisine(continent) from the image";
  console.log("this is coming from cuisineRoutes");

  // console.log("this is the filePath from cuisineRoutes",filePath);
  if (!filePath) {
    return res.status(400).json({ message: "No file path provided." });
  }

  try {
    // Dynamically construct the image path based on the uploads directory
    const imagePath = path.join(__dirname, "..", filePath);
    console.log(imagePath);
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: "Image file not found." });
    }

    const form = new FormData();
    form.append("file", fs.createReadStream(imagePath));
    console.log("before imageResponse");
    // Send image to the Gemini API to get cuisine information
    // const imageResponse = await axios.post(GEMINI_API_URL, form, {
    //   headers: {
    //     ...form.getHeaders(),
    //     Authorization: `Bearer ${GEMINI_API_KEY}`,
    //   },
    // });
    console.log("after imageResponse and before detectCuisine");
    // const imageResponse = "rohan";
    // Extract cuisine information from the image response
    // const detectedCuisine =
    //   imageResponse.data.cuisine || "Cuisine not detected";

    // If a prompt is provided, get a response from Gemini AIcl
    // console.log("this is prompt", prompt);
    if (prompt) {
      const genAI = new (require("@google/generative-ai").GoogleGenerativeAI)(
        "AIzaSyCnix898QB0evEQDUIhSW7d3a7ee8XNbS8"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();

      res.json({ cuisine: "fake added cuisine", aiResponse: responseText });
    } else {
      res.json({ cuisine: "detectedCuisine" });
    }
  } catch (error) {
    console.error("Error analyzing food image or getting AI response:", error);
    res.status(500).json({ message: "Failed to process request." });
  }
});

module.exports = router;
