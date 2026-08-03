# Personal Book Manager (MERN + Next.js)

Full-stack app to sign up, log in, and manage a personal book collection.

## Structure
- `backend/` — Express + MongoDB (Mongoose) API, JWT auth via httpOnly cookies
- `frontend/` — Next.js 14 (App Router) + Tailwind CSS

## Quick start

### 1. Backend
```
cd backend
npm install
cp .env.example .env   # fill in MONGODB_URI, JWT secrets, and Cloudinary credentials
npm run dev             # runs on http://localhost:8000
```

### 2. Frontend
```
cd frontend
npm install
cp .env.local.example .env.local
npm run dev              # runs on http://localhost:3000
```

Open http://localhost:3000, sign up, and start tracking books.

## Notes
- Access token (15m) and refresh token (7d) are both set as httpOnly cookies on login/signup.
- The frontend axios instance auto-retries once with a silent refresh on a 401.
- Next.js middleware does a lightweight cookie-presence check to gate `/dashboard`; the API still independently verifies the JWT on every request — the middleware is just UX, not the security boundary.
- Book cover images (optional) go through multer (temp local storage) → Cloudinary (`book-manager/covers` folder) → the URL and `public_id` are stored on the Book doc. The old image is deleted from Cloudinary whenever a cover is replaced or a book is deleted. You'll need a free Cloudinary account and its cloud name/API key/API secret in `backend/.env`.
