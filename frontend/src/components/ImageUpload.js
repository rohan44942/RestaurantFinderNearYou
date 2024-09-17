import React, { useState } from "react";
import axios from "../services/api";
import "./ImageUpload.css"; // Import the CSS file
// import { post } from "../../../backend/routes/uploadRoutes";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [cuisine, setCuisine] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(""); // State to hold the uploaded image URL

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        console.log(reader.result);
        // Set the image URL for display
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError("Please select an image to upload.");
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("image", image);
    const uploadResponse = await axios.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const filePath = uploadResponse.data.filePath;
    // console.log(filePath);
    try {
      // analysis image
      // const analyzeResponse = await axios.post("/analyze-food", {
      //   filePath,
      // });
      const analyzeResponse = await fetch(
        "http://localhost:5000/api/analyze-food",
        {
          method: "POST", // Use uppercase "POST"
          headers: {
            "Content-Type": "application/json", // Specify JSON content type
          },
          body: JSON.stringify({ filePath }), // Send filePath in request body as JSON
        }
      );
      
      // Extract the JSON response
      const data = await analyzeResponse.json();
      console.log(analyzeResponse,data,"this is data and anaysresp");
      // console.log("http://localhost:5000/api/analyze-food", filePath);
      const detectedCuisine = data.aiResponse;

      // const detectedCuisine = "indian"

      if (detectedCuisine) {
        setCuisine(detectedCuisine);
        console.log("Detected cuisine:", detectedCuisine);
      } else {
        setError("Failed to detect cuisine from image.");
      }
    } catch (error) {
      console.error("Error uploading or analyzing image:", error);
      setError("error in posting on analysis-food");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-upload-container">
      <div className="image-upload-header">Find Restaurant</div>
      <input type="file" onChange={handleImageChange} />
      <button
        className="upload-button"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
      {error && <div className="error-message">{error}</div>}
      {uploadedImage && (
        <img src={uploadedImage} alt="Uploaded" className="uploaded-image" />
      )}
      {cuisine && (
        <div className="detected-cuisine">Detected Cuisine: {cuisine}</div>
      )}
    </div>
  );
};

export default ImageUpload;
