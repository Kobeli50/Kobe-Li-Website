import React from "react";
import { Link } from "react-router-dom";

const posts = [
  {
    slug: "Blog-Title",
    title: "Coming soon.",
    date: "08/15/2025",
    excerpt: "Coming soon.",
  },
];

const Blogs: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Link to="/" className="inline-block mb-6">
        <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
          ← Back to Home
        </button>
      </Link>
      <h1 className="text-3xl font-bold mb-6">Blogs</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug} className="mb-8 border-b pb-4">
            <h2 className="text-xl font-semibold">
              <Link to={`/blogs/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="text-gray-500 text-sm mb-2">{post.date}</p>
            <p>{post.excerpt}</p>
            <Link
              to={`/blogs/${post.slug}`}
              className="text-blue-600 hover:underline text-sm"
            >
              Read more →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blogs;
