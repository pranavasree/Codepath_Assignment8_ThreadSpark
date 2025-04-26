import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { supabase } from "../db/supabaseClient";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "View Posts", path: "/feed" },
    { label: "Create Post", path: "/create" },
    { label: "Preferences", path: "/settings" }, // ✅ NEW
  ];

  const handleLogout = async () => {
    const userId = localStorage.getItem("user_id");

    if (userId) {
      await supabase
        .from("users_session")
        .update({ is_active: false })
        .eq("user_id", userId);

      localStorage.removeItem("user_id");
      navigate("/login");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 tracking-tight"
        >
          ThreadSpark 🔥
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive
                    ? "text-blue-600 underline"
                    : "text-zinc-700 dark:text-zinc-300 hover:text-blue-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600"
          >
            Logout
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-zinc-700 dark:text-zinc-300"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-3 space-y-2 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block py-2 text-sm font-medium ${
                  isActive
                    ? "text-blue-600 underline"
                    : "text-zinc-700 dark:text-zinc-300 hover:text-blue-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="block py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
