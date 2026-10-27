import React, { useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Photo } from "@/lib/photos";

type PhotoGridProps = {
  photos: Photo[];
  layout?: "editorial" | "compact";
  showDates?: boolean;
};

// An explicit UTC date keeps a collection on the same day in every timezone.
const formatDate = (date: string) => {
  const value = new Date(`${date}T12:00:00Z`);
  return Number.isNaN(value.getTime())
    ? date
    : value.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      });
};

const PhotoCaption = ({ photo }: { photo: Photo }) =>
  photo.caption ? (
    photo.href ? (
      <a
        href={photo.href}
        target="_blank"
        rel="noopener noreferrer"
        className="photo-caption inline-flex items-center gap-1 underline underline-offset-4 transition-opacity hover:opacity-70"
      >
        {photo.caption}
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    ) : (
      <span className="photo-caption">{photo.caption}</span>
    )
  ) : null;

const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  layout = "editorial",
  showDates = true,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const current = openIndex === null ? null : photos[openIndex] ?? null;

  const step = (delta: number) => {
    if (photos.length < 2) return;
    setOpenIndex((index) =>
      index === null ? index : (index + delta + photos.length) % photos.length
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      step(event.key === "ArrowRight" ? 1 : -1);
    }
  };

  return (
    <>
      <div className={`photo-grid photo-grid--${layout}`}>
        {photos.map((photo, index) => (
          <figure
            key={photo.id ?? photo.src}
            className={`photo-item${layout === "editorial" && photos.length > 3 && index === 0 ? " photo-item--featured" : ""}`}
          >
            <button
              type="button"
              aria-label={`View photo: ${photo.alt}`}
              aria-haspopup="dialog"
              onClick={(event) => {
                opener.current = event.currentTarget;
                setOpenIndex(index);
              }}
              className="photo-open block w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
            >
              <img
                src={photo.thumbnailSrc ?? photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                decoding="async"
                className="photo-image block h-auto w-full"
              />
            </button>
            {(photo.caption || (showDates && photo.date)) && (
              <figcaption className="photo-meta">
                <PhotoCaption photo={photo} />
                {showDates && photo.date && (
                  <time className="photo-date" dateTime={photo.date}>
                    {formatDate(photo.date)}
                  </time>
                )}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <Dialog open={current !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <DialogContent
          aria-describedby={undefined}
          onKeyDown={handleKeyDown}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            opener.current?.focus();
          }}
          className="photo-lightbox max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-6xl gap-0 overflow-y-auto border-0 bg-[#171a16] px-3 pb-4 pt-14 text-white shadow-2xl sm:px-6 sm:pb-5 [&>button]:right-3 [&>button]:top-2 [&>button]:flex [&>button]:h-11 [&>button]:w-11 [&>button]:items-center [&>button]:justify-center [&>button]:text-white"
        >
          <DialogTitle className="sr-only">{current?.alt || "Photo viewer"}</DialogTitle>
          {current && (
            <>
              <div className="photo-lightbox-image flex min-h-0 items-center justify-center">
                <img
                  src={current.src}
                  alt={current.alt}
                  width={current.width}
                  height={current.height}
                  className="mx-auto max-h-[65dvh] w-auto max-w-full object-contain sm:max-h-[72dvh]"
                />
              </div>
              <div className="mt-4 flex min-h-11 items-center justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1 text-sm">
                  <PhotoCaption photo={current} />
                  {current.date && (
                    <time dateTime={current.date} className="text-white/65">
                      {formatDate(current.date)}
                    </time>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1 sm:gap-3">
                  {photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label="Previous photo"
                      className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                  )}
                  <p className="min-w-10 text-center text-xs tabular-nums text-white/70" aria-live="polite" aria-atomic="true">
                    <span className="sr-only">Photo </span>{openIndex! + 1} / {photos.length}
                  </p>
                  {photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Next photo"
                      className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                    >
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoGrid;
