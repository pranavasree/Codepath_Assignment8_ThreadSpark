import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../db/supabaseClient";
import toast from "react-hot-toast";

const CreatePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [repost, setRepost] = useState(null);

  const userId = localStorage.getItem("user_id");

  const searchParams = new URLSearchParams(location.search);
  const repostId = searchParams.get("repost_id");

  useEffect(() => {
    const fetchRepost = async () => {
      if (repostId) {
        const { data, error } = await supabase
          .from("posts")
          .select("id, title, content, image_url")
          .eq("id", repostId)
          .single();

        if (!error && data) {
          setRepost(data);
        }
      }
    };

    fetchRepost();
  }, [repostId]);

  const handleCreatePost = async () => {
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    const { error } = await supabase.from("posts").insert([
      {
        title,
        content,
        image_url: imageUrl || null,
        user_id: userId,
        repost_id: repostId || null,
        upvotes: 0,
      },
    ]);

    if (!error) {
      toast.success("Post created successfully!");
      navigate("/feed");
    } else {
      toast.error("Failed to create post.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-28 p-6 bg-white dark:bg-zinc-900 rounded shadow">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">
        ✍️ Create a New Post
      </h1>

      {repost && (
        <div className="mb-6 p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-zinc-800 rounded">
          <p className="text-sm text-zinc-300 mb-1">🔁 Reposting:</p>
          <a
            href={`/posts/${repost.id}`}
            className="text-lg font-semibold text-blue-500 hover:underline"
          >
            {repost.title}
          </a>
          <p className="text-zinc-700 dark:text-zinc-200 mt-1">
            {repost.content}
          </p>
          {repost.image_url && (
            <img
              src={repost.image_url}
              alt="Repost preview"
              className="mt-3 max-h-48 w-full object-cover rounded"
            />
          )}
        </div>
      )}

      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          className="w-full p-3 border rounded dark:bg-zinc-800 dark:text-white"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something..."
          rows={5}
          className="w-full p-3 border rounded dark:bg-zinc-800 dark:text-white"
        />
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Optional Image URL"
          className="w-full p-3 border rounded dark:bg-zinc-800 dark:text-white"
        />
        <button
          onClick={handleCreatePost}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          ➕ Publish Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
