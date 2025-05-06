// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/homepage/homepage";
import ExplorePage from "./components/explorepage/explorepage";
import Signup from "./components/signup/signup";
import CoAI from "./components/coai/coai";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/components/explorepage/explorepage" element={<ExplorePage />} />
        <Route path="/components/signup/signup" element={<Signup />} />
        <Route path="/components/coai/coai" element={<CoAI />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
