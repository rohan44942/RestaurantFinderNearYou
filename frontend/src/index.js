import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import RestaurantDetail from "./components/RestaurantDetail"; // Import the RestaurantDetail component
import "./index.css"; // Import your global CSS

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/restaurant/:id" element={<RestaurantDetail />} />
    </Routes>
  </Router>
);
