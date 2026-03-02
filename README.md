# Arts Network Map

A small Express + MongoDB app that collects arts community submissions and displays them on an interactive Leaflet map.

# Arts Network Map

## Tagline

An interactive, community-driven map to discover arts practitioners and organizations globally.

## Project Description

Arts Network Map is an Express + MongoDB application that collects submissions from artists, curators, galleries, and collectives and displays approved entries as interactive points on a Leaflet map. Submissions include location and profile details; a separate admin interface allows moderation and deletion.

## Features
- Public interactive Leaflet map with popups and website links
- Submission form capturing name, email (stored, not public), location, medium, website, affiliation, and biography
- Admin UI (`/admin`) for listing and deleting submissions
- REST API endpoints: `POST /api/submit`, `GET /api/points`, `DELETE /api/submit/:id`

## Target Audience

- Artists, curators, galleries, and collectives seeking visibility
- Event organizers and researchers exploring arts activity geographically
- Community builders and local arts networks


- Community mapping projects
- Arts directories and discovery tools

- Submitters provide name, email, city, country, latitude, longitude, medium, website, affiliation, and biography.

This project was created to provide a low-friction way for arts practitioners to list themselves on a shared, discoverable map. It aims to:
- Lower barriers for listing arts activity with a minimal submission form
- Provide a spatial overview to help discovery and local collaboration
- Offer lightweight moderation capabilities via an admin interface

Research questions explored:
- How can location-aware listings improve community discovery and collaboration?
- What minimal metadata supports useful discovery without overburdening contributors?

- Public interactive map showing approved points with popups and links to websites.

- Admin UI (`/admin`) for listing and deleting submissions (protected by optional `ADMIN_TOKEN`).
- Affordances: labeled form fields, clear submit button, map interactivity (click markers to open popups), and an obvious admin interface for moderation.
- Anti-affordances: submitter emails are intentionally not displayed on the public map to protect privacy; delete functionality is gated.

- Simple API endpoints: `POST /api/submit`, `GET /api/points`, `DELETE /api/submit/:id`.
- Required fields (`*`) signal necessary inputs.
- Admin token input and red delete buttons indicate restricted administrative actions.


- Marker color/size and clustered layout (future) support scanning; popups provide structured details and direct website links.

## Quick start (development)
- Visual feedback: submission success/error messages, popup confirmations, and status text showing entry count.
- Feedback loops: the client polls for new submissions so contributors see updates shortly after posting.



1. Clone the repo (if you haven't already):
- Node.js (v14+ recommended)
- npm
- MongoDB (local or hosted)



```bash
git clone git@github.com:dianasimonds/arts-network.git
cd arts-network
npm install
```

Create a `.env` file (optional):

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/arts-network-map
# ADMIN_TOKEN defaults to 'admintoken' if not set
ADMIN_TOKEN=admintoken
PORT=3000
```

Start the app in development:

```bash
npm run dev
```

Open `http://localhost:3000` for the public map and `http://localhost:3000/admin` for administration.

```bash

git clone git@github.com:dianasimonds/arts-network.git

cd arts-network
- Fill the submission form with required fields (including email) and optional profile details, then click **Add to Map**.
- Approved entries appear on the map and show popups with details and website links.

```
- Visit `/admin` to view entries.
- Provide `ADMIN_TOKEN` (default `admintoken` if not configured) to authorize deletions; use the Delete button to remove entries.



2. Install dependencies:

This project is released under the MIT License. See [LICENSE](LICENSE) for details.



- Built with Node.js, Express, MongoDB, Mongoose, and Leaflet.
- Inspired by community mapping and open data efforts.

```bash

Planned features:
- Moderation workflow (pending → approved)
- Admin authentication and role management
- Spam protection (reCAPTCHA) and rate-limiting
- Marker clustering and filtering

Future improvements:
- Production deployment with HTTPS and CI/CD
- Accessibility and localization enhancements


If you'd like screenshots, diagrams, or expanded HCD analysis, tell me where to add them and I'll update the README.
```

3. Create a `.env` file at the project root (optional):

```
# .env
MONGODB_URI=mongodb://127.0.0.1:27017/arts-network-map
ADMIN_TOKEN=your_admin_token_here
PORT=3000
```

- If `MONGODB_URI` is not provided the app will attempt to connect to a local MongoDB instance.
- If `ADMIN_TOKEN` is set, delete requests require that token (sent as `?token=...` or `X-Admin-Token` header).

4. Run the app:

```bash
npm run dev
```

Open `http://localhost:3000` to view the map, or `http://localhost:3000/admin` to manage submissions.

Important: run the site in `http://` (plain HTTP) while developing. If you load the page via `https://` your browser may block requests to the HTTP backend.

## API

- `POST /api/submit` — accepts JSON body with required fields: `type`, `name`, `email`, `city`, `country`, `lat`, `lng`. Optional: `website`, `medium`, `affiliation`, `biography`, `disciplines`, `tags`, `description`.
- `GET /api/points` — returns GeoJSON FeatureCollection of approved points for the map.
- `DELETE /api/submit/:id` — deletes a submission by id. If `ADMIN_TOKEN` is set on the server, include `?token=...` or `X-Admin-Token` header.

## Notes & next steps

- The public API does not expose submitter emails — email is stored but only displayed in the admin UI.
- For production: set a proper `MONGODB_URI`, enable HTTPS (or proxy behind an HTTPS-enabled server), add a `.env` for secrets, and add a proper Content Security Policy or bundle external assets locally.
- Recommended enhancements: spam protection (reCAPTCHA), admin authentication, moderation queue (default `status:pending`), and server-side input sanitization.

## .gitignore suggestion

Make sure `node_modules/`, `.env`, and any sensitive files are excluded in `.gitignore`.

---

If you'd like, I can also add a `.gitignore` and commit it now. Do you want me to add that and finish the README TODO?