# EstateHub — Real Estate Listing Portal

A full-stack starter project for your Project 8 assignment. It includes a React frontend, Node.js/Express REST API, MongoDB models, JWT authentication, property search/filtering, favorites, saved searches, agent inquiries, and admin listing approval.

## Tech stack
- Frontend: React + Vite + React Router + Axios
- Map: Leaflet + React Leaflet + OpenStreetMap tiles
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT + bcryptjs

## Requirements
- Node.js 18+
- MongoDB Community Server or MongoDB Atlas account

## 1. Run the backend
Open a terminal in `server`:

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Update `.env` with your MongoDB connection string and a strong JWT secret. API runs at `http://localhost:5000`.

## 2. Run the frontend
Open a second terminal in `client`:

```bash
cd client
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## 3. Create an admin account
Register a normal account from the website. Then, in MongoDB Compass or `mongosh`, update that user's role:

```js
db.users.updateOne({ email: "your-email@example.com" }, { $set: { role: "admin" } })
```

Log out and log in again so the new role is included in your JWT.

## Main API routes
- `GET /api/properties` — public listings with filters
- `GET /api/properties/:id` — property detail
- `POST /api/properties` — authenticated agent/admin creates a pending listing
- `PUT /api/properties/:id` — owner/admin updates listing
- `DELETE /api/properties/:id` — owner/admin deletes listing
- `GET /api/admin/properties/pending` — admin queue
- `PATCH /api/admin/properties/:id/approve` — admin approves listing
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `POST /api/users/favorites/:propertyId` — toggle favorite
- `GET /api/users/favorites`
- `POST /api/saved-searches`, `GET /api/saved-searches`
- `POST /api/inquiries` — send agent inquiry

## Project structure
```text
client/   React application
server/   Express API and MongoDB models
```

## Notes before submission
This is a clean, extensible starter rather than a production deployment. Before going live, add email verification/password reset, image upload storage (Cloudinary/S3), rate limiting, stronger validation, automated tests, and deployment configuration. Map markers use OpenStreetMap and do not require a Google Maps key. You can switch to Google Maps later if your project rubric requires it.
