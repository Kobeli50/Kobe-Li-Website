import React from "react";
import { Link } from "react-router-dom";
import PhotoGrid from "@/components/PhotoGrid";
import { albums, favorites } from "@/lib/photos";

const Gallery: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Link to="/" className="inline-block mb-6">
        <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
          ← Back to Home
        </button>
      </Link>

      <h1 className="text-3xl font-bold mb-4">Gallery</h1>
      <p className="text-gray-600 mb-10">
        Shooting with a Nikon Z6III.
      </p>

      {favorites.length === 0 && albums.length === 0 && (
        <p className="text-gray-500">Photos coming soon.</p>
      )}

      {favorites.length > 0 && (
        <section className="mb-14">
          <h2 className="text-xl font-semibold mb-4">Favorites</h2>
          <PhotoGrid photos={favorites} />
        </section>
      )}

      {albums.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Galleries</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <Link key={album.slug} to={`/gallery/${album.slug}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                  <img
                    src={album.cover.src}
                    alt={album.cover.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3 font-semibold">{album.title}</div>
                <p className="text-sm text-gray-500">
                  {album.photos.length} {album.photos.length === 1 ? "photo" : "photos"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Gallery;
