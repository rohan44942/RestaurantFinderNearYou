import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RestaurantList from "./components/RestaurantList";
import RestaurantDetail from "./components/RestaurantDetail";
import Search from "./components/Search"; // Updated import for Search component
import "./App.css"; // Import the CSS file

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="header">
          Find Your Restaurant
        </header>
        <div className="main-content">
          <Routes>
            <Route path="/search" element={<Search />} />
            <Route path="/" element={<RestaurantList />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
