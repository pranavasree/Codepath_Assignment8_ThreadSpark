import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import CreatePost from "./Pages/CreatePost";
import PostsFeed from "./Pages/PostsFeed";
import PostDetails from "./Pages/PostDetails";
import Dashboard from "./Pages/Dashboard";
import LoginPage from "./Pages/LoginPage";
import SettingsPage from "./Pages/SettingsPage"; // ✅ NEW
import Navbar from "./components/Navbar";

const AppRoutes = () => {
  const location = useLocation();
  const hideNavbarOn = ["/login"];
  const showNavbar = !hideNavbarOn.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <div className={showNavbar ? "pt-19" : ""}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/feed" element={<PostsFeed />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/settings" element={<SettingsPage />} /> {/* ✅ NEW */}
          <Route
            path="/new"
            element={<Navigate to={`/create${location.search}`} replace />}
          />
        </Routes>
      </div>
    </>
  );
};

export default AppRoutes;
