# CommonHands

## Project Overview

- **Project name:** CommonHands
- **Purpose:** Platform connecting NGOs, volunteers (contributors) and donors to manage volunteering tasks and donations.
- **Problem statement:** Streamline NGO onboarding, volunteer applications, time logging, and donation tracking with role-based access.
- **Main features:**
  - User registration & authentication (Admin / NGO / Contributor)
  - NGO registration, document upload and verification
  - Task creation (Volunteer / Funding) and management
  - Volunteer application, hours logging and approval workflow
  - Donation recording (transaction model) and basic fee handling
  - Admin dashboards and management endpoints
- **Technology stack:** Node.js, Express, MongoDB (Mongoose), Cloudinary, React (Vite), Redux Toolkit

## System Architecture

```mermaid
graph TD
  A[Browser / Client] -->|HTTP| B(Frontend - React + Redux)
  B -->|REST API| C(Backend - Express)
  C --> D[(MongoDB)]
  C --> E[Cloudinary]
  C --> F[Razorpay (simulated)]
```

- Frontend: Vite + React, routing in `src/App.jsx`, state with Redux Toolkit and Context for auth.
- Backend: Express server at `Backend/index.js`, routes mounted on `/api/*`.
- Database: MongoDB via Mongoose (`DB_URL` environment variable).
- Third-party services: Cloudinary for uploads, Razorpay simulated transactions for donations.

## User Roles
- **Admin**: Full access to lists, verify NGOs, manage users and tasks.
- **NGO**: Create/manage tasks, upload verification documents, view applications and donations.
- **Contributor**: Register, apply to volunteer, log hours, donate (optional linked account).
- **Donor**: External donors represented in transactions (donorDetails) — may or may not be registered users.

## Business Flows
- **User Registration:** POST `/api/register` → creates User (first user becomes Admin).
- **Authentication:** POST `/api/login` → returns JWT used in `Authorization` header.
- **NGO Verification:** NGO registers and uploads documents; Admin toggles `status` on NGO profile.
- **Volunteer Application:** Contributor applies to volunteer tasks → NGO approves/rejects → hours logged and approved.
- **Donations:** POST `/api/donations/:taskId` (simulated gateway) updates `Transaction` and `Task.currentFund`.
- **Premium Features:** NGOs have `isPremium` and `premiumExpiryDate` fields available for future use.

## Project Structure (high level)
- `Backend/` — Express API, models, controllers, middleware, validations and utils.
- `Frontend/` — React app (Vite), pages under `src/Pages`, components under `src/components`, store under `src/Store`.

## Documentation

- [Backend Documentation](./Backend/README.md)
- [Frontend Documentation](./Frontend/README.md)

## Setup Instructions

1. Clone the repo

```bash
git clone <repo>
cd CommonHands
```

2. Backend

```bash
cd Backend
npm install
```

Create a `.env` (see Backend/README.md for required variables).

Start backend:

```bash
npm start
```

3. Frontend

```bash
cd Frontend
npm install
npm run dev
```

> Frontend default `src/config/axios.jsx` points to `https://commonhands.onrender.com`. Update for local dev.

## Deployment Overview
- Backend: Deploy to Node hosting (Heroku, Render, DigitalOcean). Ensure `DB_URL` and Cloudinary env vars are set.
- Frontend: Build and host static files (Netlify, Vercel, or serve via CDN).
- Database hosting: MongoDB Atlas recommended.

## Future Improvements
- Add proper payment gateway integration (Razorpay live flows)
- Add tests (unit & integration)
- Add CI/CD pipelines and automated deployment
- Improve pagination, filtering and caching for large datasets
