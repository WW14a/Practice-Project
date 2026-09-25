# Practice Application

A full-stack todo application built to practice modern React patterns, REST API development, authentication, validation, and server-state management.

## Technology Stack

### Frontend

- React 19 with Vite
- React Router for client-side routing
- React Hook Form for form state and client-side validation
- TanStack Query for server-state fetching, mutations, caching, stale-time configuration, and optimistic local updates
- Redux Toolkit and React Redux for application state
- Axios for API requests
- Tailwind CSS and reusable UI components
- React Error Boundary and route-level error elements for error recovery

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcrypt password hashing
- Zod request validation
- CORS and dotenv configuration

## Frontend Features

- Login and registration flows
- Access-token and refresh-token handling through Axios interceptors
- Automatic access-token refresh and retry of failed authenticated requests
- Protected routes that redirect unauthenticated users to login and preserve the requested location
- React Hook Form validation and field-level error messages
- Lazy-loaded pages with `React.lazy` and `Suspense` loading states
- React Router data loader for preloading todo data before a route renders
- Route-level error handling with fallback UI
- Todo creation, viewing, editing, completion, and deletion
- Separate completed and pending todo views
- Search and paginated todo lists
- A regular pagination implementation for comparison
- TanStack Query pagination using `keepPreviousData`
- TanStack Query caching with configurable `staleTime`
- Loading, empty, and error states
- Toast notifications for user feedback
- Responsive sidebar navigation and profile page
- TanStack React Query Devtools for inspecting cached queries

## Backend Features

- Authentication module with register, login, refresh-token, and logout flows
- Short-lived access tokens and long-lived refresh tokens
- Password hashing with bcrypt
- Authentication middleware for protected API routes
- Zod schemas for register, login, user update, password update, todo creation, and todo update requests
- Reusable schema-validation middleware with structured field errors
- `wrapasync` utility for forwarding asynchronous controller errors
- Centralized Express error handling and 404 handling
- Todo module with CRUD operations
- User module for profile and account operations
- Auth module for authentication operations
- Service and controller separation
- Mongoose models for users and todos
- User-scoped todo queries
- Server-side pagination, search, sorting, and total-count responses
- Mongoose validation and relationships between users and todos
- CORS configured for the Vite development server
- JSON and URL-encoded request body parsing

## Project Structure

```text
frontend/
	src/
		components/    Reusable UI, loading, and error components
		context/       User authentication context
		layout/        Main authenticated application layout
		lib/           Axios client and shared utilities
		page/          Application pages and auth pages
		provider/      React Query, Redux, and user providers
		redux/         Redux store and todo slice
		routes/        Protected route wrapper

backend/
	src/
		config/        Database connection
		controller/    Request handlers
		middleware/    Auth, validation, todo, and error middleware
		models/        Mongoose models
		routes/        Auth, user, and todo routes
		schemas/       Zod validation schemas
		services/      Business logic
		utlis/         Error, token, and async helper utilities
```

## Running Locally

### Prerequisites

- Node.js
- MongoDB running locally

### Backend

```bash
cd backend
npm install
npm start
```

The backend listens on port `3000` by default. The backend package currently has no `start` script, so run the server directly with:

```bash
node server.js
```

For automatic restarts during development:

```bash
npx nodemon server.js
```

Create a `backend/.env` file with the JWT secrets:

```env
JWT_SECRET=your_access_token_secret
JWT_REFRESHED_SECRET=your_refresh_token_secret
PORT=3000
```

The current database connection uses `mongodb://localhost:27017/mydatabase` in `backend/src/config/db.js`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite development server runs at `http://localhost:5173` and the Axios client expects the API at `http://localhost:3000/api`.

Useful frontend commands:

```bash
npm run build
npm run lint
npm run preview
```

## API Modules

- `/api/auth` - register, login, refresh token, and logout
- `/api/user` - protected user profile and account operations
- `/api/todo` - protected todo CRUD, pagination, and search

## Current Notes

- The login page uses the project backend API.
- The current registration page still submits to the DummyJSON example API and should be connected to `/api/auth/register` for end-to-end project registration.
- Access and refresh tokens are currently stored in browser cookies by the frontend Axios utility.
