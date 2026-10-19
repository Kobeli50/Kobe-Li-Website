import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PhotoGrid from "@/components/PhotoGrid";
import { albums } from "@/lib/photos";
import NotFound from "./NotFound";

const Album: React.FC = () => {
  const { slug } = useParams();
  const album = albums.find((a) => a.slug === slug);

  // Client-side navigation keeps the old scroll position; start albums at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!album) return <NotFound />;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Link to="/gallery" className="inline-block mb-6">
        <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
          ← Back to Gallery
        </button>
      </Link>

      <h1 className="text-3xl font-bold mb-2">{album.title}</h1>
      <p className="text-gray-600 mb-8">
        {album.photos.length} {album.photos.length === 1 ? "photo" : "photos"}
      </p>

      <PhotoGrid photos={album.photos} />
    </div>
  );
};

export default Album;
