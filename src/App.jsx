// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/homepage/homepage";
import ExplorePage from "./components/explorepage/explorepage";
import Signup from "./components/signup/signup";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/components/explorepage/explorepage" element={<ExplorePage />} />
        <Route path="/components/signup/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
