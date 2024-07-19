import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import "./App.css";
import Login from "./pages/Login";
import BeePicker from "./pages/BeePicker";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Sidebar is initially open
  const [isSidebarExpanded, setSidebarExpanded] = useState(false); // Sidebar is initially minimized

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleSidebarToggleExpand = () => {
    setSidebarExpanded((prev) => !prev);
  };

  return (
    <Router>
      <div className="App">
        <CssBaseline />
        <Sidebar
          open={isSidebarOpen}
          onClose={handleSidebarClose}
          expanded={isSidebarExpanded}
          onToggleExpand={handleSidebarToggleExpand}
        />
        <div
          className="App-body"
          style={{
            marginLeft: isSidebarExpanded ? "240px" : "60px",
            transition: "margin-left 0.3s",
          }}
        >
          <Header />
          <main className="App-main">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/beePicker" element={<BeePicker />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
