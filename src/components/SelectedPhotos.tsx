import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { favorites, formatPhotoDate } from "@/lib/photos";
import type { Photo } from "@/lib/photos";
import "./SelectedPhotos.css";

const PhotoMetadata = ({ photo }: { photo: Photo }) => (
  <div className="favorite-metadata">
    {photo.date && <time dateTime={photo.date}>{formatPhotoDate(photo.date)}</time>}
    {photo.caption && (photo.href
      ? <a href={photo.href} target="_blank" rel="noopener noreferrer">{photo.caption}<ArrowUpRight size={13} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
      : <span>{photo.caption}</span>)}
  </div>
);

const SelectedPhotos = ({ photos = favorites }: { photos?: Photo[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const imageButton = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const frameId = useId();
  const count = photos.length;
  const currentIndex = count ? activeIndex % count : 0;
  const current = photos[currentIndex];
  const hasSlides = count > 1;
  const rotating = hasSlides && !hovered && !focused && !paused && !viewerOpen && !reducedMotion && visible;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(media.matches);
    const syncVisibility = () => setVisible(!document.hidden);
    syncMotion();
    syncVisibility();
    media.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      media.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setTimeout(() => setActiveIndex((index) => (index + 1) % count), 7000);
    return () => window.clearTimeout(timer);
  }, [rotating, activeIndex, count]);

  const step = (direction: number) => {
    if (hasSlides) setActiveIndex((index) => (index + direction + count) % count);
  };

  const handleKeys = (event: KeyboardEvent, fromViewer = false) => {
    if (event.defaultPrevented || !hasSlides || (viewerOpen && !fromViewer)) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      if (fromViewer) event.stopPropagation();
      step(event.key === "ArrowRight" ? 1 : -1);
    }
  };

  if (!current) return null;

  return (
    <section
      className="selected-photos page-width personal-favorites"
      aria-labelledby={titleId}
      aria-roledescription={hasSlides ? "carousel" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
      onKeyDown={handleKeys}
    >
      <div className="personal-favorites__inner">
        <h2 id={titleId} className="personal-favorites__title">Personal favorite</h2>
        <button
          ref={imageButton}
          id={frameId}
          type="button"
          className="favorite-frame"
          aria-label={`View photo: ${current.alt}`}
          aria-haspopup="dialog"
          onClick={() => setViewerOpen(true)}
        >
          {photos.map((photo, index) => (
            <span key={photo.id ?? photo.src} className="favorite-slide" data-active={index === currentIndex} aria-hidden={index !== currentIndex}>
              <img src={photo.src} alt={index === currentIndex ? photo.alt : ""} width={photo.width} height={photo.height} loading="lazy" decoding="async" />
            </span>
          ))}
          <span className="favorite-zoom" aria-hidden="true"><ArrowUpRight size={18} /></span>
        </button>
        <div className="favorite-caption-row">
          <PhotoMetadata photo={current} />
          {hasSlides && (
            <div className="favorite-controls" aria-label="Favorite photo controls">
              {!reducedMotion && (
                <button type="button" className="favorite-control favorite-playback" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Resume automatic slideshow" : "Pause automatic slideshow"} aria-controls={frameId}>
                  {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
                </button>
              )}
              <button type="button" className="favorite-control" onClick={() => step(-1)} aria-label="Previous favorite" aria-controls={frameId}><ChevronLeft size={19} aria-hidden="true" /></button>
              <span className="favorite-count" aria-live={rotating ? "off" : "polite"} aria-atomic="true"><span className="sr-only">Photo </span>{String(currentIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
              <button type="button" className="favorite-control" onClick={() => step(1)} aria-label="Next favorite" aria-controls={frameId}><ChevronRight size={19} aria-hidden="true" /></button>
            </div>
          )}
        </div>
        <div className="personal-favorites__more"><Link to="/gallery" className="text-link">See More <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
      </div>
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent
          className="favorite-lightbox"
          aria-describedby={undefined}
          onKeyDown={(event) => handleKeys(event, true)}
          onCloseAutoFocus={(event) => { event.preventDefault(); imageButton.current?.focus(); }}
        >
          <DialogTitle className="sr-only">{current.alt}</DialogTitle>
          <img className="favorite-lightbox__image" src={current.src} alt={current.alt} width={current.width} height={current.height} />
          <div className="favorite-lightbox__footer">
            <PhotoMetadata photo={current} />
            {hasSlides && (
              <div className="favorite-controls">
                <button type="button" className="favorite-control" onClick={() => step(-1)} aria-label="Previous photo"><ChevronLeft size={20} aria-hidden="true" /></button>
                <span className="favorite-count" aria-live="polite" aria-atomic="true"><span className="sr-only">Photo </span>{currentIndex + 1} / {count}</span>
                <button type="button" className="favorite-control" onClick={() => step(1)} aria-label="Next photo"><ChevronRight size={20} aria-hidden="true" /></button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SelectedPhotos;
