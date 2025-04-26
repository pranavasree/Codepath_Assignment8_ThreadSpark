import React, { useEffect, useState } from "react";
import { supabase } from "../db/supabaseClient";
import { Link } from "react-router-dom";

const PostsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [sortOption, setSortOption] = useState("created_at");
  const [searchQuery, setSearchQuery] = useState("");
  const [preferences, setPreferences] = useState({
    theme: "dark",
    show_content: true,
    show_images: true,
  });

  // Get current logged in user_id
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserIdAndPrefs = async () => {
      const { data: sessionData } = await supabase
        .from("users_session")
        .select("user_id")
        .single();

      if (sessionData) {
        setUserId(sessionData.user_id);

        const { data: prefData } = await supabase
          .from("users_preferences")
          .select("*")
          .eq("user_id", sessionData.user_id)
          .maybeSingle();

        if (prefData) {
          setPreferences(prefData);
        }
      }
    };

    fetchUserIdAndPrefs();
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, created_at, upvotes, content, image_url")
        .order(sortOption, { ascending: false });

      if (!error) setPosts(data);
    };

    loadPosts();
  }, [sortOption]);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isDark = preferences.theme === "dark";

  return (
    <div
      className={`max-w-4xl mx-auto px-4 py-8 ${
        isDark ? "text-gray-300" : "text-gray-800"
      }`}
    >
      {/* Heading */}
      <div className="text-center mb-10 mt-14">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Explore the Feed
        </h1>
        <p className="mt-2 text-sm">
          Browse recent posts, discover trending topics, and search by title.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <input
          type="text"
          placeholder="Search posts by title..."
          className={`w-full md:w-1/2 px-4 py-2 border rounded-md ${
            isDark
              ? "bg-zinc-800 text-gray-100 border-zinc-700 placeholder-gray-400"
              : "bg-gray-100 text-gray-800 border-gray-300 placeholder-gray-500"
          }`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className={`w-full md:w-48 px-4 py-2 border rounded-md ${
            isDark
              ? "bg-zinc-800 text-gray-100 border-zinc-700"
              : "bg-gray-100 text-gray-800 border-gray-300"
          }`}
        >
          <option value="created_at">🕒 Newest</option>
          <option value="upvotes">🔥 Most Upvoted</option>
        </select>
      </div>

      {/* Posts */}
      {filteredPosts.length > 0 ? (
        <ul className="space-y-5">
          {filteredPosts.map((post) => (
            <li
              key={post.id}
              className={`p-5 border rounded-lg shadow hover:shadow-lg transition ${
                isDark
                  ? "bg-zinc-900 border-zinc-800"
                  : "bg-white border-gray-200"
              }`}
            >
              <Link to={`/posts/${post.id}`}>
                <h2
                  className={`text-xl font-semibold hover:underline ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {post.title}
                </h2>
              </Link>
              <p className="text-sm mt-1">
                Posted on {new Date(post.created_at).toLocaleString()}
              </p>
              <p className="text-sm mt-1">👍 {post.upvotes} upvotes</p>

              {preferences.show_content && post.content && (
                <p className="mt-3 text-sm">
                  {post.content.length > 200
                    ? post.content.slice(0, 200) + "..."
                    : post.content}
                </p>
              )}

              {preferences.show_images && post.image_url && (
                <img
                  src={post.image_url}
                  alt="Post visual"
                  className="mt-3 rounded-lg max-h-64 object-cover"
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 mt-12">No posts found.</p>
      )}
    </div>
  );
};

export default PostsFeed;
