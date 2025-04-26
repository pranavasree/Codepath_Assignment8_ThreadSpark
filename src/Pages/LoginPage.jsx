import React, { useState } from "react";
import { supabase } from "../db/supabaseClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!userId.trim()) {
      toast.error("User ID is required");
      return;
    }

    localStorage.setItem("user_id", userId);

    const { error } = await supabase
      .from("users_session")
      .upsert([{ user_id: userId, is_active: true }], {
        onConflict: ["user_id"],
      });

    if (error) {
      toast.error("Failed to log in");
    } else {
      toast.success("Logged in successfully");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-zinc-300 dark:border-zinc-700">
        {/* ThreadSpark App Name */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-500">
            ThreadSpark 🔥
          </h1>
        </div>

        <h2 className="text-3xl font-bold text-center text-zinc-800 dark:text-white mb-6">
          Login
        </h2>

        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter your User ID"
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
