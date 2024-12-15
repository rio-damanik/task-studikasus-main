// src/App.jsx

import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";

function App() {
  const [selectedTag, setSelectedTag] = useState("");

  return (
    <Router>
      <Navbar onCategorySelect={setSelectedTag} />
      <AppRoutes selectedTag={selectedTag} /> {/* Pass selectedTag to AppRoutes */}
    </Router>
  );
}

export default App;
