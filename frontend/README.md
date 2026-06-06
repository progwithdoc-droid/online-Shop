# Frontend Application

A modern React frontend built with Vite and Tailwind CSS for a full-stack ecommerce experience. This application provides role-aware views, authenticated navigation, and an API-driven architecture for customers, vendors, and administrators.

## Overview

The frontend is designed for a scalable production application, with clear separation between page views, reusable UI components, layout structure, and API integration. It consumes the backend API and provides dynamic product browsing, cart and order workflows, user profiles, vendor dashboards, and admin management panels.

## Key Features

- Role-based route protection for customer, vendor, and admin access
- Responsive interface with Tailwind CSS
- API communication through a centralized Axios instance
- Form handling with React Hook Form and Zod validation
- Client state management via Zustand and React Query
- Dashboard and product management flows for vendors and admins

## Technology Stack

- React 19
- Vite
- Tailwind CSS
- React Router DOM
- React Hook Form
- React Query
- Zod validation
- Axios for HTTP requests
- Zustand for lightweight state management

## Project Structure

- `src/main.jsx` - application entry point
- `src/App.jsx` - top-level application router and layout wrapper
- `src/pages/` - page components grouped by role and feature
- `src/components/layout/` - shared layout components and route guards
- `src/api/axios.js` - base API client configuration
- `src/store/` - client-side state stores
- `src/utils/formatters.js` - reusable presentation utilities

## Prerequisites

- Node.js 18 or later
- npm 10 or later
- Backend API running locally or in the configured environment

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create the environment file:
   ```bash
   cp .env.sample .env
   ```
4. Update `.env` if necessary. By default, the API URL is configured for local backend development.

## Running Locally

- Start the development server:
  ```bash
  npm run dev
  ```
- Build production-ready assets:
  ```bash
  npm run build
  ```
- Preview the production build locally:
  ```bash
  npm run preview
  ```
- Run lint checks:
  ```bash
  npm run lint
  ```

## Environment Variables

- `VITE_API_URL` - base API endpoint used by the frontend for backend requests

## Best Practices

- Keep frontend API URL configuration in `.env` for local and deployment environments
- Use linting to maintain code consistency and catch issues early
- Keep reusable logic in `src/utils` and `src/components` to reduce duplication
- Maintain separate route guards for authenticated and role-based pages
- Use production builds for deployment to ensure optimized assets

## Extending the Frontend

This frontend is structured to support additional ecommerce capabilities:

- product search, filtering, and sorting
- advanced analytics and reporting dashboards
- real-time order status and notifications
- multi-language support and localization
- payment and checkout enhancements
