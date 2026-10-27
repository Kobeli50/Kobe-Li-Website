# Photo collection

The gallery is organized by subject, while photo files stay in date folders.
There are eight visible photos across three collections:

- **Landscapes** — DSC_4339 and DSC_4750, July 2, 2026.
- **People** — DSC_6522 and DSC_6525, September 6, 2026.
- **Animals** — DSC_6541, DSC_6544, DSC_6587, and DSC_6592, September 6, 2026.

DSC_6589 is excluded from all gallery views. Its website copies and original
Desktop photo remain intact. The homepage selection contains only DSC_4750.
Original camera photos on the Desktop are unchanged; files here are optimized
website copies.

## Add more photos

1. Put website-ready images in `albums/YYYY-MM-DD/`, using the date they were taken.
   For example, add more September 6 photos to `albums/2026-09-06/`, or create
   `albums/2026-10-27/` for a new day. This date is used in the photo captions.
2. Keep images around 2200 pixels on their longest side. Export JPEG files at
   around 80% quality. Don't overwrite your original camera files.
3. Optionally add a smaller copy, around 1000 pixels wide, in
   `previews/YYYY-MM-DD/` with the **exact same filename and extension**. The gallery
   uses this copy in its grid and loads the larger copy in the viewer.
4. In `src/lib/photos.ts`, add the photo's ID to the appropriate `photoIds` list in
   `collectionDefinitions`. An ID is the folder and filename without its extension,
   for example `2026-09-06/DSC_6525`. The list also controls the display order.
5. Run `npm run dev` to preview, or `npm run build` to produce the website.

To add a new subject, add another entry to `collectionDefinitions` with a unique
`slug`, a `title`, a `coverId`, and a list of `photoIds`. It automatically receives
its own `/gallery/<slug>` route and a card on the gallery page. A collection with
photos from several dates keeps the date on each individual photo.

Date-based archive routes still work, including `/gallery/2026-07-02` and
`/gallery/2026-09-06`. New date folders create archive routes automatically, even
before you add their photos to a subject. Archive photos are sorted by filename.

Supported extensions: `.jpg`, `.jpeg`, `.png`, `.webp`, and `.avif` (including
uppercase versions). Export HEIC images as JPEG first.

## Captions, descriptions, and covers

Optional details are in `src/lib/photos.ts`, in `photoDetails`. For example:

```ts
"2026-09-06/DSC_6525": {
  alt: "Kobe and a friend smiling together in front of bamboo",
  caption: "besto friend",
  href: "https://andrew-cheng.com/",
  width: 2200,
  height: 1469,
},
```

`alt` is the image description for accessibility. Only add `caption` when you want
visible words besides the date. `href` turns the caption into a link. `width` and
`height` describe the larger website copy and help reserve space as it loads.

Each subject's `coverId` selects its gallery cover. Date archives use the separate
`albumCovers` map, then a file named `cover`, then the first image as a fallback.

## Homepage favorites and hidden photos

The `favoriteIds` list in `src/lib/photos.ts` controls the homepage selection. It
currently includes only `2026-07-02/DSC_4750`. Favorites reference existing album
photos, so no duplicate image files are needed. The old `favorites/` folder is
not read automatically.

The `excludedPhotoIds` set hides a frame from all collections, archive routes,
and homepage favorites without deleting the files. It currently excludes
`2026-09-06/DSC_6589`.
That frame is also excluded by the album and preview import patterns, so its
files are retained locally but are not included in the production build.
