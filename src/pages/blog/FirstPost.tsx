import React from "react";
import { Link } from "react-router-dom";

const FirstPost: React.FC = () => (
  <div className="max-w-2xl mx-auto py-8 px-4">
    <Link to="/blogs" className="inline-block mb-6">
      <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
        ← Back to Blogs
      </button>
    </Link>
    <h1 className="text-3xl font-bold mb-4">Coming soon.</h1>
  </div>
);

export default FirstPost;
