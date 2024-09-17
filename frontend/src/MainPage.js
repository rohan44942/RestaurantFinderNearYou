import React from "react";
import ImageUpload from "./components/ImageUpload";
import RestaurantList from "./components/RestaurantList";
import Search from "./components/Search";
import ErrorBoundary from "./components/ErrorBoundary";

const MainPage = () => {
  return (
    <ErrorBoundary>
      <div className="main-page">
        <h1>Restaurant Finder</h1>
        <ImageUpload />
        <Search />
        <RestaurantList />
      </div>
    </ErrorBoundary>
  );
};

export default MainPage;
