import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../db/supabaseClient";
import toast from "react-hot-toast";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [repost, setRepost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  const currentUser = localStorage.getItem("user_id");

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, []);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) {
      setPost(data);
      setEditTitle(data.title);
      setEditContent(data.content);
      setEditImageUrl(data.image_url);

      if (data.repost_id) {
        fetchRepost(data.repost_id);
      }
    }
  };

  const fetchRepost = async (repostId) => {
    const { data, error } = await supabase
      .from("posts")
      .select("id, title")
      .eq("id", repostId)
      .single();
    if (!error) setRepost(data);
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", id)
      .order("created_at", { ascending: true });
    if (!error) setComments(data);
  };

  const handleUpvote = async () => {
    const { data, error } = await supabase
      .from("posts")
      .update({ upvotes: post.upvotes + 1 })
      .eq("id", id)
      .select()
      .single();
    if (!error) setPost(data);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const { error } = await supabase.from("comments").insert([
      {
        post_id: id,
        content: newComment,
        user_id: currentUser, // Optional: save user ID
      },
    ]);
    if (!error) {
      setNewComment("");
      fetchComments();
      toast.success("Comment added!");
    }
  };

  const handleEditSubmit = async () => {
    if (currentUser !== post.user_id) {
      toast.error("You're not authorized to edit this post.");
      return;
    }

    const { data, error } = await supabase
      .from("posts")
      .update({
        title: editTitle,
        content: editContent,
        image_url: editImageUrl,
      })
      .eq("id", id)
      .select()
      .single();

    if (!error) {
      setPost(data);
      setIsEditing(false);
      toast.success("Post updated successfully!");
    } else {
      toast.error("Failed to update post.");
    }
  };

  const handleDelete = async () => {
    if (currentUser !== post.user_id) {
      toast.error("You're not authorized to delete this post.");
      return;
    }

    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (!error) {
      toast.success("Post deleted.");
      navigate("/feed");
    } else {
      toast.error("Error deleting post.");
    }
  };

  if (!post) return <p className="text-center p-4">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto mt-28 px-4 flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-2/3 bg-white dark:bg-zinc-900 p-6 rounded shadow">
        {repost && (
          <div className="mb-4 p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-zinc-800">
            <p className="text-sm text-zinc-300">
              🔁 Repost of:{" "}
              <a
                href={`/posts/${repost.id}`}
                className="text-blue-400 hover:underline font-semibold"
              >
                {repost.title}
              </a>
            </p>
          </div>
        )}

        {isEditing ? (
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-blue-600">✏️ Edit Post</h2>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white"
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white"
            />
            <input
              type="url"
              value={editImageUrl}
              onChange={(e) => setEditImageUrl(e.target.value)}
              className="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white"
            />
            <div className="flex gap-3">
              <button
                onClick={handleEditSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                ✅ Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-blue-600">{post.title}</h2>
            <p className="text-zinc-700 dark:text-zinc-200 mt-2">
              {post.content}
            </p>
            {post.image_url && (
              <div className="mt-4">
                <img
                  src={post.image_url}
                  alt="Post"
                  className="w-full h-64 object-cover rounded shadow"
                />
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={handleUpvote}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                👍 Upvote
              </button>
              <span className="text-zinc-800 dark:text-zinc-200 font-semibold">
                {post.upvotes} upvotes
              </span>

              {currentUser === post.user_id && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    🗑️ Delete
                  </button>
                </>
              )}

              {!isEditing && (
                <button
                  onClick={() => navigate(`/new?repost_id=${post.id}`)}
                  className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 text-white"
                >
                  🔁 Repost
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Comments */}
      <div className="w-full md:w-1/3 bg-white dark:bg-zinc-900 p-6 rounded shadow">
        <h3 className="text-xl font-semibold text-blue-500 mb-4">
          💬 Comments
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded"
              >
                <p className="text-zinc-700 dark:text-zinc-200">
                  {comment.content}
                </p>
                <p className="text-sm text-zinc-500">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-zinc-500 italic">No comments yet.</p>
          )}
        </div>

        <div className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Leave a comment..."
            className="w-full p-3 border rounded dark:bg-zinc-800 dark:text-white"
          />
          <button
            onClick={handleAddComment}
            className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
          >
            ➕ Add Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
