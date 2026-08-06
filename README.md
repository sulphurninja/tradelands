# TradeLands.IND

India's premium Agriculture Land & NA Villa Plot investment portal.

## Stack

- **Frontend:** Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion
- **Backend:** Next.js Route Handlers
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (httpOnly cookie via `jose` + `bcryptjs`)

## Getting started

```bash
npm install
cp .env.example .env.local
# Add your Atlas MONGODB_URI, then:
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for signing auth tokens |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`) |
| `NEXT_PUBLIC_APP_URL` | Public site URL |

All projects, concepts, blogs, and reviews load from MongoDB. Run `npm run seed` to populate Indian demo inventory and demo users.

### Demo logins (after seed)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `superadmin@tradelands.ind` | `Super@12345` |
| Admin | `admin@tradelands.ind` | `Admin@12345` |
| Sales | `sales@tradelands.ind` | `Sales@12345` |
| Customer | `investor@tradelands.ind` | `Investor@12345` |

- `/login` → JWT cookie session
- Customers → `/dashboard`
- Admin / Super Admin → `/admin` (full CMS for projects, blogs, concepts, media, reviews, leads, visits)
- Sales → leads & site visits APIs (CRM UI expanding)

### Cloudinary (admin uploads)

Add to `.env.local`:

```
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Without these, admins can still paste image/doc URLs. With them, file upload works for images, PDFs, and videos.

## What's included

- Premium marketing site (Home → modules → project detail)
- Agriculture / NA Villa / Farm House category hubs
- AVENZA · ORLANE · FLORAVE investment concepts
- Property search, compare, knowledge, media, legal downloads
- Site visit booking + enquiry APIs
- JWT register / login / session + customer dashboard shell
- Admin panel shell (role-gated)
- Investment calculators (`/tools`)

## Scripts

```bash
npm run dev      # development
npm run build    # production build
npm run start    # start production server
npm run lint     # eslint
```
