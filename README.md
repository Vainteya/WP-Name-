# Supraj Nirvee Catalog

Full-stack product catalog.

- `frontend/` - Vite web app
- `backend/` - Node.js / Express / MongoDB API

## Setup

```bash
cd backend && npm install
cd ../frontend && npm install
```

Create `backend/.env` and `frontend/.env` with your own values (these files are not committed).

## Run

```bash
cd backend && node server.js
cd frontend && npm run dev
```

## Deploy to Vercel (free Hobby plan)

The whole app (frontend + API) deploys as one Vercel project from the repo root; `vercel.json` handles the build. The API runs as a serverless function at `/api`, so the frontend needs no `VITE_BACKEND_URL` there.

1. Create a free MongoDB Atlas cluster, add a database user, and under **Network Access** allow `0.0.0.0/0` (Vercel has no fixed IPs). Copy the connection string.
2. On [vercel.com/new](https://vercel.com/new), sign in with GitHub and import this repo. Leave every build setting as detected.
3. Under **Environment Variables** add `MONGO_URI` (the Atlas string) and `JWT_SECRET` (any long random string), then click **Deploy**.
4. In the project, open **Storage → Create → Blob** and connect it to the project. This adds `BLOB_READ_WRITE_TOKEN`, so admin image/PDF uploads are stored in Vercel Blob. Redeploy once afterwards.
5. Create the admin user and starter products by running these locally with `MONGO_URI` pointing at Atlas in `backend/.env`:

   ```bash
   cd backend && node createAdmin.js && node seedProducts.js
   ```

Uploads are limited to 4MB per file, because Vercel functions accept request bodies up to 4.5MB.
