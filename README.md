# SparkIT — Ecommerce Platform

This repository contains a full-stack ecommerce reference implementation with a Node.js backend and a React frontend. It demonstrates a production-oriented architecture that includes authentication, role-based access control, catalog and order management, media uploads, and administrative workflows.

## Contents

- `backend/` — API server with database integration, business logic, and middleware.
- `frontend/` — React application built with Vite, Tailwind CSS, and client-side state management.
- `images/` — sample product media used by the frontend and seed data.

## Highlights

- Role-based access control for customers, vendors, and administrators.
- RESTful API built with Express and Drizzle ORM (PostgreSQL compatible).
- Cloudinary integration for product media uploads.
- Frontend with Vite, React, Tailwind CSS, React Router, Zustand, and React Query.
- Request validation with Zod and centralized API error handling.

## Prerequisites

- Node.js 18 or later
- npm 10 or later
- PostgreSQL compatible database or NeonDB
- Cloudinary account for media uploads (optional for local testing)

## Quickstart

1. Backend

   ```powershell
   cd project/backend
   npm install
   cp .env.example .env
   # edit .env to set DATABASE_URL, JWT_SECRET, REFRESH_TOKEN_SECRET, CLOUDINARY_*, CLIENT_URL
   npm run dev
   ```

2. Frontend

   ```powershell
   cd project/frontend
   npm install
   cp .env.sample .env
   # edit .env to set VITE_API_URL if required
   npm run dev
   ```

## Environment Variables

- Backend: `PORT`, `NODE_ENV`, `DATABASE_URL`, `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLIENT_URL`
- Frontend: `VITE_API_URL`

## Common Scripts

- Backend: `npm run dev`, `npm start`, `npm run seed`, `npm run db:generate`, `npm run db:push`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`

## Development Guidance

- Keep secret values out of source control using local `.env` files.
- Use clear, stable branch names and add descriptive pull request summaries.
- Run linters and validations before merging changes.

## Deployment Notes

- Build the frontend and deploy static assets to a CDN or web server.
- Deploy the backend to a Node-compatible environment and use secure environment management.
- Enable HTTPS and restrict CORS to trusted origins.

## Contributing

Contributions are welcome. Follow the existing project structure, document configuration changes, and keep new features isolated.

## License and Contact

This repository is provided as a reference implementation. Refer to the project maintainers for licensing and support details.
