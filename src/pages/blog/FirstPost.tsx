import React from "react";
import { Link } from "react-router-dom";

const FirstPost: React.FC = () => (
  <div className="max-w-2xl mx-auto py-8 px-4">
    <Link to="/blogs" className="inline-block mb-6">
      <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
        ← Back to Blogs
      </button>
    </Link>
    <h1 className="text-3xl font-bold mb-4">My First Blog Post</h1>
    <p className="text-gray-500 text-sm mb-2">2024-05-01</p>
    <div className="prose">
      <p>
        Welcome to my first blog post! This is where you can write your content.
        You can add images, code snippets, and more.
      </p>
    </div>
  </div>
);

export default FirstPost;
