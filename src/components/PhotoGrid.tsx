import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Photo } from "@/lib/photos";

// Masonry grid of photos; clicking one opens it full-size with prev/next.
const PhotoGrid: React.FC<{ photos: Photo[] }> = ({ photos }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const current = openIndex === null ? null : photos[openIndex];

  const step = (delta: number) =>
    setOpenIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  };

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="mb-4 block w-full overflow-hidden rounded-lg break-inside-avoid focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="w-full h-auto transition duration-300 hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      <Dialog open={current !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <DialogContent
          aria-describedby={undefined}
          onKeyDown={handleKeyDown}
          className="max-w-6xl w-[calc(100vw-2rem)] border-none bg-transparent p-0 pt-10 shadow-none text-white"
        >
          <DialogTitle className="sr-only">{current?.alt || "Photo"}</DialogTitle>
          {current && (
            <img
              src={current.src}
              alt={current.alt}
              className="mx-auto max-h-[80vh] w-auto max-w-full rounded object-contain"
            />
          )}

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 transition hover:bg-black/70"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 transition hover:bg-black/70"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <p className="text-center text-sm text-white/70">
                {openIndex! + 1} / {photos.length}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoGrid;
