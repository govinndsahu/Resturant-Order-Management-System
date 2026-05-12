# Cafeteria Menu Ordering App

A polished full-stack cafeteria menu ordering application built with React, Express, MongoDB, and real-time push notification support. This setup is designed for real-time order printing, where each incoming order is printed through a Bluetooth thermal printer for fast kitchen and counter handling.

Repository: https://github.com/govinndsahu/Order-Printer-Setup

## 🚀 Project Overview

This application is designed to showcase a complete modern web product with:

- A responsive React front-end powered by Vite
- A RESTful Express API server with secure route handling
- MongoDB data persistence using Mongoose
- Location-aware order validation
- Authentication, staff-only admin controls, and session cookie management
- Push notification setup and service worker support for PWA capabilities

## ✨ Key Features

- **Customer-facing storefront** with product categories, selection, and cart flow
- **Order creation** with table number, buyer details, product totals, and form validation
- **Location validation** validating user's location to prevent fake orders user should be inside the place.
- **Admin dashboard** for managing categories, products, orders, histories, and users
- **Protected API routes** using middleware for authentication and staff access
- **Web Push Notifications** integration via VAPID key setup
- **Client-side performance optimization** with route-based lazy loading so admin/auth code and homepage-specific CSS load only when needed
- **CORS-safe server** with allowed origin handling and global error handling
- **Modern frontend architecture** with React Context for cart state
- **Service worker registration** for offline-friendly experience

## 🧩 Tech Stack

- Frontend: `React`, `Vite`, `React Router`, `GSAP`, `Tailwind CSS`
- Backend: `Express`, `Mongoose`, `Helmet`, `cors`, `cookie-parser`
- Data Validation: `Zod`
- Notifications: `web-push`
- Database: `MongoDB`
- Tooling: `Vite`, `npm`

## 📁 Project Structure

- `client/` — React frontend application
  - `src/` — main UI components, pages, hooks, context, and APIs
  - `public/` — static assets and service worker files
- `server/` — Express backend API
  - `controllers/` — request handling logic
  - `routes/` — API route definitions
  - `models/` — Mongoose schemas and data models
  - `middlewares/` — validation, authentication, and location middleware
  - `config/` — database and web-push configuration
  - `utils/` — shared utilities, CORS, error handling, and helpers

## ⚙️ Setup & Run Locally

### Prerequisites

- Node.js `>=20`
- npm
- MongoDB instance

### 1. Install backend dependencies

```bash
cd server
npm install
```

### 2. Install frontend dependencies

```bash
cd ../client
npm install
```

### 3. Configure environment variables

Create a `.env` file in `server/` with the following values:

```env
PORT=5000
MONGODB_CONNECTION_URL=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
COOKIE_PARSER_SESSION_KEY=your_cookie_secret
WEB_PUSH_PUBLIC_KEY=your_vapid_public_key
WEB_PUSH_PRIVATE_KEY=your_vapid_private_key
```

### 4. Run the backend

```bash
cd ../server
npm run dev
```

### 5. Run the frontend

```bash
cd ../client
npm run dev
```

## 🧠 Notes for Reviewers

- The backend uses `Zod` schemas to validate user input before saving orders
- The frontend uses React Context for shared cart state management
- The app is designed to support staff-only admin pages and user verification

## 🙌 Summary

This repository demonstrates a strong end-to-end application with a modern React frontend, REST API backend, database integration, notification setup, and admin management workflows. The README is now structured to communicate the app clearly, support easy local setup, and highlight the technical capabilities effectively.
