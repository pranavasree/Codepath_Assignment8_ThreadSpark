// src/pages/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 p-6">
      <div className="max-w-4xl mx-auto text-center ">
        <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-200 mt-32 mb-12">
          A community-driven forum where you can create posts, share ideas,
          leave comments, and upvote the best content.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-300 dark:border-zinc-700">
            <h2 className="text-xl font-semibold text-blue-500 mb-2">
              🚀 Project Features
            </h2>
            <ul className="list-disc list-inside text-zinc-700 dark:text-zinc-200 text-left space-y-1">
              <li>Create and view posts</li>
              <li>Supports image URLs</li>
              <li>Upvote posts you like</li>
              <li>Comment and engage in discussions</li>
              <li>Secure Supabase backend (auth + database)</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-300 dark:border-zinc-700">
            <h2 className="text-xl font-semibold text-blue-500 mb-2">
              🛠️ Technologies Used
            </h2>
            <ul className="list-disc list-inside text-zinc-700 dark:text-zinc-200 text-left space-y-1">
              <li>React + Vite</li>
              <li>Tailwind CSS</li>
              <li>Supabase (Database + Auth)</li>
              <li>React Router</li>
              <li>React Hot Toast</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link
            to="/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition shadow"
          >
            ➕ Create a Post
          </Link>
          <Link
            to="/feed"
            className="bg-zinc-800 text-white px-6 py-3 rounded-full hover:bg-zinc-900 transition shadow"
          >
            📬 View Posts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
