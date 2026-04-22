# CATENARTS

CATENARTS is a small web project about visibility, connection, and discoverability in the arts. It started as a straightforward submission map built with Express, MongoDB, and Leaflet. It has since grown into a fuller prototype with a homepage, a creator page, a live map, and a separate profiles directory.

The project is still very much a working prototype. Some parts are backed by MongoDB, and some parts are intentionally lightweight frontend experiments so ideas can be tested quickly.

## What the project is now

Right now the site has four main public-facing areas:

- `Home` (`/`)
  A landing page that frames the project, introduces the network idea, and gives visitors a way to start building a profile.

- `Map` (`/map.html`)
  A live Leaflet map connected to approved submissions from MongoDB. Visitors can browse entries, submit new ones, and see points appear on the map.

- `About the Creator` (`/artist-profile.html`)
  A creator page centered on Diana Simonds. This page also doubles as the template for what a more developed profile page could look like.

- `Profiles` (`/profiles.html`)
  A searchable directory of profiles saved locally in the browser. These are grouped by type and sorted alphabetically.

There is also an admin page:

- `Admin` (`/admin.html` or `/admin`)
  A simple moderation view for listing submissions and deleting them with the admin token.

## What the first version looked like

The first version of this project was much simpler.

It was essentially:

- one Express server
- one MongoDB-backed submission flow
- one interactive Leaflet map
- one admin interface for reviewing and deleting entries

The original focus was the map itself: getting arts professionals, institutions, and organizations onto a shared spatial directory with as little friction as possible.

That early version answered a practical question:

How can people in the arts find one another more easily across geography, discipline, and institutional boundaries?

The newer pages were added later to give the project more context and to test what a fuller ecosystem might feel like beyond map pins alone.

## Current architecture

### Backend

The backend is a small Express app in [server.js](./server.js).

It currently does a few key things:

- serves the static files in `public/`
- connects to MongoDB
- accepts submissions
- returns approved points as GeoJSON
- exposes a small admin endpoint for reviewing approved entries
- supports deleting entries when the admin token is provided

### Frontend

Most of the interface lives in `public/`.

Important files:

- [public/index.html](./public/index.html)
- [public/map.html](./public/map.html)
- [public/artist-profile.html](./public/artist-profile.html)
- [public/profiles.html](./public/profiles.html)
- [public/styles.css](./public/styles.css)
- [public/nav.js](./public/nav.js)

There are also a few small page-specific scripts:

- [public/home-profile-template.js](./public/home-profile-template.js)
  Handles the homepage modal for creating a new profile draft.

- [public/profile-store.js](./public/profile-store.js)
  Stores browser-local profile drafts in `localStorage`.

- [public/profiles-page.js](./public/profiles-page.js)
  Powers the searchable profiles directory.

- [public/artist-profile-data.js](./public/artist-profile-data.js)
  Reads a saved local profile and injects it into the creator/profile page when a `?profile=` slug is present.

- [public/artist-profile-background.js](./public/artist-profile-background.js)
  Runs the animated background on the creator/profile page.

- [public/artist-profile-photo.js](./public/artist-profile-photo.js)
  Provides a local image upload preview on the creator/profile page.

## What is database-backed vs browser-local

This is important, because the project currently uses two different storage ideas.

### MongoDB-backed

The map submissions are real backend records.

These flow through:

- `POST /api/submit`
- `GET /api/points`
- `GET /api/admin/points`
- `DELETE /api/submit/:id`

Map entries are stored in MongoDB and can be shared across sessions and devices.

### Browser-local for now

The profile drafts created from the homepage modal are currently stored in `localStorage`.

That means:

- they are only available in the browser where they were created
- they do not yet live in MongoDB
- they are meant as a prototype for profile structure and browsing, not yet as a production profile system

This is one of the main unfinished seams in the project at the moment.

## Routes and pages

### Public pages

- `/` -> homepage
- `/map.html` or `/map` -> map page
- `/artist-profile.html` or `/artist-profile` -> About the Creator page
- `/profiles.html` -> profiles directory

### Admin page

- `/admin.html` or `/admin` -> admin interface

### API routes

- `POST /api/submit`
- `GET /api/points`
- `GET /api/admin/points`
- `DELETE /api/submit/:id`

## Environment variables

Create a `.env` file at the project root if you want to run the app locally with your own settings.

Example:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/arts-network-map
ADMIN_TOKEN=admintoken
PORT=3000
```

Notes:

- If `MONGODB_URI` is missing, the app falls back to `mongodb://127.0.0.1:27017/arts-network-map`
- If `ADMIN_TOKEN` is missing, it falls back to `admintoken`
- The app defaults to port `3000`

## Running the project locally

Install dependencies:

```bash
npm install
```

Run the server:

```bash
npm start
```

Or, if you want autoreload during development:

```bash
npm run dev
```

Then open:

- `http://localhost:3000`

If the server starts but your browser still says it cannot connect, that is usually a local environment issue rather than an application issue. During development, plain `http://` is the safest option.

## Current strengths

At this point, the project does a few things well:

- it has a clear landing page instead of dropping visitors straight into the map
- the map feels more polished and editorial than the original bare utility version
- the creator page gives the project a human center
- the profiles directory creates a stronger sense of networked participation
- the profile creation flow is easy to test without needing a fully built backend profile system

## Current limitations

There are still some rough edges, and it is worth being honest about them.

- Profile creation is not yet tied to MongoDB
- Uploaded profile pictures are preview-only and are not persisted
- The admin page is functional but visually older than the rest of the site
- The creator page is still serving as both a real page and a template stand-in
- The profiles system and the map submission system are not yet fully unified

In other words, the project currently has two parallel ideas:

1. a live map backed by MongoDB
2. a profile system prototype backed by browser storage

That split is okay for now, but it is probably the next major structural thing to resolve.

## Good next steps

If this project keeps developing, the most logical next moves would be:

- move profile creation from `localStorage` into MongoDB
- connect created profiles directly to map entries
- let profile pages load from real stored data instead of only from the creator page template
- unify the visual style of the admin page with the rest of the site
- decide whether CATENARTS is primarily a map-first project, a profile directory, or a hybrid of both

## Why this README is written this way

This project has changed shape while it was being built, so a README that only described the original map app would be incomplete, and a README that pretended everything is already fully unified would be misleading.

The most accurate description right now is:

CATENARTS began as a map-based directory for arts professionals and has evolved into a broader prototype for how profiles, geography, and discoverability might work together.

That feels truer to the project than pretending it is either finished or still only version one.
