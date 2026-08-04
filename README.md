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

## Security

This is a small project, but the security choices aren't cosmetic — they follow the same patterns production apps use for auth and data isolation.

- **Passwords are never stored in plain text.** A Mongoose `pre("save")` hook hashes every password with `bcrypt` (10 salt rounds) before it touches the database, and the hash is excluded from every API response (`.select("-password")`).

- **Tokens live in httpOnly cookies, not localStorage.** The access token (15m) and refresh token (7d) are set as `httpOnly` cookies, meaning client-side JavaScript can never read them — even if a malicious script somehow ran on the page, it couldn't steal the session. This closes off the most common XSS-driven token theft vector.

- **Every book query is scoped to its owner.** There's no "get book by ID" endpoint that trusts the ID alone — every read, update, and delete filters by `{ _id, owner: req.user._id }` at the database level. One user can't view, edit, or delete another user's books by guessing or forging an ID.

- **Refresh tokens are single-use and revocable.** Each login stores the current refresh token on the user document; if it doesn't match what's presented, the request is rejected. Logging out clears it server-side, so a stolen refresh token becomes worthless the moment the real user logs out.

- **CORS is locked to one explicit origin**, not wildcarded — only the deployed frontend domain can make credentialed requests to the API.

- **File uploads are constrained, not trusted blindly.** Cover images go through `multer` with a strict image-only MIME filter and a 5MB size cap before ever reaching Cloudinary, and orphaned uploads are cleaned up (both the local temp file and the old Cloudinary asset on replace/delete) so nothing leaks disk space or storage quota over time.

- **Errors don't leak internals in production.** A central error-handling middleware normalizes every thrown error into a consistent shape, and stack traces are only included in the response when `NODE_ENV=development`.

- **Cross-domain cookies are handled correctly, not avoided.** Frontend (Vercel) and backend (Render) live on different domains — a real deployment constraint, not a toy localhost setup. Cookies are configured with `sameSite: "none"; secure: true` in production, and a Next.js rewrite proxies API calls through the frontend's own domain so the browser treats them as first-party rather than third-party — the same reason ad-tracking cookies get blocked by default in modern browsers, sidestepped correctly instead of worked around with a hack.

**Simple on purpose, not simple by accident:** there's no over-engineering here — no microservices, no premature caching layer, no auth library abstracting away what JWTs are actually doing. Every moving part exists because the feature needs it, and every security decision is one a real production auth system would also make.

## Notes
- Access token (15m) and refresh token (7d) are both set as httpOnly cookies on login/signup.
- The frontend axios instance auto-retries once with a silent refresh on a 401.
- Next.js middleware does a lightweight cookie-presence check to gate `/dashboard`; the API still independently verifies the JWT on every request — the middleware is just UX, not the security boundary.
- Book cover images (optional) go through multer (temp local storage) → Cloudinary (`book-manager/covers` folder) → the URL and `public_id` are stored on the Book doc. The old image is deleted from Cloudinary whenever a cover is replaced or a book is deleted. You'll need a free Cloudinary account and its cloud name/API key/API secret in `backend/.env`.
