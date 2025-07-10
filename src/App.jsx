// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/homepage/homepage";
import FeedPage from "./components/feed/feed";
import Signup from "./components/signup/signup";
import CoAI from "./components/coai/coai";
import Login from "./components/login/login";
import CreatePost from "./components/create/create";
import Profile from "./components/profile/profile";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/components/signup/signup" element={<Signup />} />
        <Route path="/components/coai/coai" element={<CoAI />} />
        <Route path="/components/login/login" element={<Login />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
