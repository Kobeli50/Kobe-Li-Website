import React from "react";
import { Link } from "react-router-dom";

const posts = [
  {
    slug: "first-post",
    title: "My First Blog Post",
    date: "2024-05-01",
    excerpt: "This is the excerpt for my first blog post.",
  },
];

const Blogs: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
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
