# Kobe Li — Personal Website

My personal website: a place for projects, writing, and a photo journal.

**Live site:** [kobe-li.com](https://kobe-li.com)

## Built with

- React and TypeScript
- Vite
- Tailwind CSS and shadcn/ui
- EmailJS for the contact form
- Vercel for hosting

## Run locally

Install Node.js and npm, then run:

```sh
git clone https://github.com/Kobeli50/Kobe-Li-Website.git
cd Kobe-Li-Website
npm ci
npm run dev
```

Open [localhost:8080](http://localhost:8080).

## Build

```sh
npm run build
npm run preview
```

The production build is generated in `dist/`. Updates pushed to `main` are
automatically deployed through Vercel.

## Photo journal

Photos are grouped into Landscapes, Architecture, People, and Animals, with dates shown inside
each collection. See the [photo collection guide](src/assets/photos/README.md)
for adding photos, changing captions, and choosing homepage favorites.
