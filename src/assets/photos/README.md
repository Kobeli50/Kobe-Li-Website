# Photos

Drop photos in here and they show up on /gallery automatically.

- `favorites/` — your personal favorites, shown at the top of the gallery.
- `albums/<Album Name>/` — one folder per gallery. The folder name becomes the
  title (e.g. `albums/Tokyo 2025/` → "Tokyo 2025" at /gallery/tokyo-2025).
  Name a photo `cover.jpg` to make it the album's cover; otherwise the first photo is used.

Photos are sorted by filename. To control order, prefix with numbers:
`01-sunset.jpg`, `02-street.jpg` (the number isn't shown). Same for album folders.

Supported: .jpg .jpeg .png .webp .avif. iPhone .HEIC files won't display in most
browsers, so export them as JPEG first.

Keep files small so the page loads fast: about 2000px on the long side is plenty.
On a Mac you can shrink a whole folder in place with:

    sips -Z 2000 *.jpg
