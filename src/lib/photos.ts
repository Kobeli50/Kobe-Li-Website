// Keep image files in date folders; curate their themes below. See assets/photos/README.md.
export type Photo = {
  src: string;
  thumbnailSrc?: string;
  alt: string;
  date?: string;
  caption?: string;
  href?: string;
  width?: number;
  height?: number;
  id?: string;
};

export type Album = {
  slug: string;
  title: string;
  cover: Photo;
  photos: Photo[];
  date?: string;
};

const albumFiles = import.meta.glob<string>(
  ["/src/assets/photos/albums/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}",
    "!/src/assets/photos/albums/2026-09-06/DSC_6589.*"],
  { eager: true, import: "default" }
);

const previewFiles = import.meta.glob<string>(
  ["/src/assets/photos/previews/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}",
    "!/src/assets/photos/previews/2026-09-06/DSC_6589.*"],
  { eager: true, import: "default" }
);

type PhotoDetails = Pick<Photo, "alt" | "caption" | "href" | "width" | "height">;

// Optional details live here; the date comes from the album folder itself.
const photoDetails: Record<string, PhotoDetails> = {
  "2026-07-02/DSC_4339": {
    alt: "A quiet beach and still water beneath a cloud-filled sky",
    width: 2200,
    height: 1469,
  },
  "2026-07-02/DSC_4750": {
    alt: "Sunlight breaking through clouds over the water and sandy shore",
    width: 2200,
    height: 1469,
  },
  "2026-09-06/DSC_6522": {
    alt: "Kobe smiling in a green shirt in front of bamboo",
    caption: "me",
    width: 2200,
    height: 1469,
  },
  "2026-09-06/DSC_6525": {
    alt: "Kobe and a friend smiling together in front of bamboo",
    caption: "besto friend",
    href: "https://andrew-cheng.com/",
    width: 2200,
    height: 1469,
  },
  "2026-09-06/DSC_6541": {
    alt: "Two otters swimming through a shallow, stony pool",
    width: 2200,
    height: 1469,
  },
  "2026-09-06/DSC_6544": {
    alt: "An otter resting inside a weathered tree stump",
    width: 2200,
    height: 1359,
  },
  "2026-09-06/DSC_6587": {
    alt: "A horned animal balancing on a tree stump",
    width: 2130,
    height: 1704,
  },
  "2026-09-06/DSC_6589": {
    alt: "A horned animal resting on a sunlit rock beneath green trees",
    width: 2200,
    height: 1700,
  },
  "2026-09-06/DSC_6592": {
    alt: "A red panda resting on branches surrounded by leaves",
    width: 2200,
    height: 1700,
  },
};

const albumCovers: Record<string, string> = {
  "2026-07-02": "DSC_4750",
  "2026-09-06": "DSC_6592",
};

const byName = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

const baseName = (path: string) =>
  path.split("/").pop()!.replace(/\.[^.]+$/, "");

const humanize = (name: string) =>
  name.replace(/^\d+[-_ ]+/, "").replace(/[-_]+/g, " ").trim();

const isDateFolder = (folder: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(folder)) return false;
  const parsed = new Date(`${folder}T12:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === folder;
};

export const formatPhotoDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));

const toPhoto = (path: string, files: Record<string, string>): Photo => {
  const parts = path.split("/");
  const folder = parts[parts.length - 2];
  const id = `${folder}/${baseName(path)}`;
  return {
    src: files[path],
    thumbnailSrc: previewFiles[path.replace("/albums/", "/previews/")],
    alt: humanize(baseName(path)),
    date: isDateFolder(folder) ? folder : undefined,
    id,
    ...photoDetails[id],
  };
};

const pathsByFolder = new Map<string, string[]>();
// Retain the files, but omit this frame from every public collection and viewer.
const excludedPhotoIds = new Set(["2026-09-06/DSC_6589"]);
for (const path of Object.keys(albumFiles).sort(byName)) {
  const parts = path.split("/");
  const folder = parts[parts.length - 2];
  if (excludedPhotoIds.has(`${folder}/${baseName(path)}`)) continue;
  pathsByFolder.set(folder, [...(pathsByFolder.get(folder) ?? []), path]);
}

const sortFolders = (a: string, b: string) => {
  if (isDateFolder(a) && isDateFolder(b)) return b.localeCompare(a);
  if (isDateFolder(a)) return -1;
  if (isDateFolder(b)) return 1;
  return byName(a, b);
};

export const albums: Album[] = [...pathsByFolder.keys()].sort(sortFolders).map((folder) => {
  const paths = pathsByFolder.get(folder)!;
  const date = isDateFolder(folder) ? folder : undefined;
  const name = date ? formatPhotoDate(date) : humanize(folder);
  const coverPath =
    paths.find((path) => baseName(path) === albumCovers[folder]) ??
    paths.find((path) => baseName(path).toLowerCase() === "cover") ??
    paths[0];
  return {
    slug: date ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    title: name.charAt(0).toUpperCase() + name.slice(1),
    date,
    cover: toPhoto(coverPath, albumFiles),
    photos: paths.map((path) => toPhoto(path, albumFiles)),
  };
});

const allPhotos = albums.flatMap((album) => album.photos);
const collectionDefinitions = [
  {
    slug: "landscapes",
    title: "Landscapes",
    coverId: "2026-07-02/DSC_4750",
    photoIds: ["2026-07-02/DSC_4339", "2026-07-02/DSC_4750"],
  },
  {
    slug: "people",
    title: "People",
    coverId: "2026-09-06/DSC_6522",
    photoIds: ["2026-09-06/DSC_6522", "2026-09-06/DSC_6525"],
  },
  {
    slug: "animals",
    title: "Animals",
    coverId: "2026-09-06/DSC_6592",
    photoIds: ["2026-09-06/DSC_6541", "2026-09-06/DSC_6544", "2026-09-06/DSC_6587", "2026-09-06/DSC_6592"],
  },
];

export const collections: Album[] = collectionDefinitions.flatMap(({ slug, title, coverId, photoIds }) => {
  const photos = photoIds.flatMap((id) => allPhotos.filter((photo) => photo.id === id));
  if (!photos.length) return [];
  const dates = new Set(photos.map((photo) => photo.date));
  return [{
    slug,
    title,
    cover: photos.find((photo) => photo.id === coverId) ?? photos[0],
    photos,
    date: dates.size === 1 ? photos[0].date : undefined,
  }];
});

// Homepage selection is intentionally independent of the gallery's theme cards.
const favoriteIds = ["2026-07-02/DSC_4750"];
export const favorites: Photo[] = favoriteIds.flatMap((id) => allPhotos.filter((photo) => photo.id === id));

export const portrait: Photo = allPhotos.find((photo) => photo.id === "2026-09-06/DSC_6522")!;
