// Photos are picked up automatically from src/assets/photos (see the README there):
//   favorites/<photo>             -> "Favorites" on /gallery
//   albums/<Album Name>/<photo>   -> one gallery per folder, at /gallery/<album-name>

export type Photo = { src: string; alt: string };
export type Album = { slug: string; title: string; cover: Photo; photos: Photo[] };

const favoriteFiles = import.meta.glob<string>(
  "/src/assets/photos/favorites/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}",
  { eager: true, import: "default" }
);

const albumFiles = import.meta.glob<string>(
  "/src/assets/photos/albums/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}",
  { eager: true, import: "default" }
);

const byName = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

const baseName = (path: string) =>
  path.split("/").pop()!.replace(/\.[^.]+$/, "");

// "02-tokyo_2025" -> "tokyo 2025" (a leading number only controls sort order)
const humanize = (name: string) =>
  name.replace(/^\d+[-_ ]+/, "").replace(/[-_]+/g, " ").trim();

const toPhoto = (path: string, files: Record<string, string>): Photo => ({
  src: files[path],
  alt: humanize(baseName(path)),
});

export const favorites: Photo[] = Object.keys(favoriteFiles)
  .sort(byName)
  .map((path) => toPhoto(path, favoriteFiles));

const pathsByFolder = new Map<string, string[]>();
for (const path of Object.keys(albumFiles).sort(byName)) {
  const parts = path.split("/");
  const folder = parts[parts.length - 2];
  pathsByFolder.set(folder, [...(pathsByFolder.get(folder) ?? []), path]);
}

export const albums: Album[] = [...pathsByFolder.keys()].sort(byName).map((folder) => {
  const paths = pathsByFolder.get(folder)!;
  const name = humanize(folder);
  const coverPath = paths.find((p) => baseName(p).toLowerCase() === "cover") ?? paths[0];
  return {
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    title: name.charAt(0).toUpperCase() + name.slice(1),
    cover: toPhoto(coverPath, albumFiles),
    photos: paths.map((p) => toPhoto(p, albumFiles)),
  };
});
