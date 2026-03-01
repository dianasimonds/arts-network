# Arts Network Map

A small Express + MongoDB app that collects arts community submissions and displays them on an interactive Leaflet map.

## Features

- Submitters provide name, email, city, country, latitude, longitude, medium, website, affiliation, and biography.
- Public interactive map showing approved points with popups and links to websites.
- Admin UI (`/admin`) for listing and deleting submissions (protected by optional `ADMIN_TOKEN`).
- Simple API endpoints: `POST /api/submit`, `GET /api/points`, `DELETE /api/submit/:id`.

## Quick start (development)

1. Clone the repo (if you haven't already):

```bash
git clone git@github.com:dianasimonds/arts-network.git
cd arts-network
```

2. Install dependencies:

```bash
npm install
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