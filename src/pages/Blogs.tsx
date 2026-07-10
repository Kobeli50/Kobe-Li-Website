import React from "react";
import { Link } from "react-router-dom";
import { Rss, ArrowUpRight } from "lucide-react";

const Blogs: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Link to="/" className="inline-block mb-6">
        <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
          ← Back to Home
        </button>
      </Link>

      <h1 className="text-3xl font-bold mb-4">Writing</h1>
      <p className="text-gray-600 mb-8">
        I write essays and notes over on Substack. Subscribe there to get new
        posts in your inbox — the same pieces also go up on Medium.
      </p>

      {/* Primary: Substack */}
      <a
        href="https://substack.com/@kobeli2"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 rounded-lg border border-border p-5 mb-4 transition hover:border-blue-500 hover:shadow-sm"
      >
        <Rss className="h-6 w-6 shrink-0 text-blue-600" />
        <div className="flex-1">
          <div className="flex items-center gap-1 font-semibold">
            Read &amp; subscribe on Substack
            <ArrowUpRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
          </div>
          <p className="text-sm text-gray-500">
            My primary home for writing — new posts land here first.
          </p>
        </div>
      </a>

      {/* Secondary: Medium */}
      <p className="text-sm text-gray-500">
        Also on{" "}
        <a
          href="https://medium.com/@kobeli553"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Medium
        </a>
        .
      </p>
    </div>
  );
};

export default Blogs;
