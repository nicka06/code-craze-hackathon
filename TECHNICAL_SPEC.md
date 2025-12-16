# Instagram Content Submission Platform - Technical Specification

## Architecture

### System Components
- **Public Site (domain.com)**: Mobile-optimized submission portal
- **Admin Site (admin.domain.com)**: Desktop-optimized moderation dashboard
- **Backend API**: Node.js/Express with TypeScript
- **Database**: PostgreSQL + Redis
- **Storage**: Google Cloud Storage
- **Scheduler**: Google Cloud Scheduler (30-minute intervals)
- **External APIs**: Meta API (Instagram/Facebook), SendGrid

### Tech Stack
- Frontend: Next.js 14 (App Router) + TypeScript + react-easy-crop
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL (data) + Redis (sessions)
- File Storage: Google Cloud Storage
- Email: SendGrid
- Auth: JWT tokens in Redis, bcrypt password hashing

### Data Flow
1. User uploads content → Backend API → GCS (files) + PostgreSQL (metadata)
2. Admin reviews → Approve/Decline → Email notification
3. Scheduler (every 30min) → Check approved posts → Post to Meta API → Mark as posted
4. Emails sent at: submission, approval, decline, posting success, posting failure

---

## Database Schema

### posts
```sql
id                 SERIAL PRIMARY KEY
account_id         INTEGER NOT NULL REFERENCES accounts(id)
caption            TEXT NOT NULL
media              TEXT[] NOT NULL           -- Original URLs in GCS
email              VARCHAR(255) NOT NULL
instagram_username VARCHAR(255)              -- Optional shoutout
status             VARCHAR(20) DEFAULT 'pending'  -- pending|approved|declined|posted|failed
created_at         TIMESTAMP DEFAULT NOW()
posted_at          TIMESTAMP
declined_message   TEXT
error_message      TEXT
retry_count        INTEGER DEFAULT 0

INDEX idx_account_status (account_id, status)
INDEX idx_created_at (created_at)
```

### accounts
```sql
id                 SERIAL PRIMARY KEY
slug               VARCHAR(100) UNIQUE NOT NULL  -- URL slug
instagram_username VARCHAR(100) NOT NULL
instagram_id       VARCHAR(255) NOT NULL
facebook_id        VARCHAR(255) NOT NULL
access_token       TEXT NOT NULL
is_active          BOOLEAN DEFAULT true
```

### admins
```sql
id          SERIAL PRIMARY KEY
username    VARCHAR(100) UNIQUE NOT NULL
password    VARCHAR(255) NOT NULL      -- bcrypt hash
account_ids INTEGER[] NOT NULL          -- PostgreSQL array
```

### admin_requests
```sql
id         SERIAL PRIMARY KEY
email      VARCHAR(255) NOT NULL
message    TEXT NOT NULL
created_at TIMESTAMP DEFAULT NOW()
```

---

## Project Structure (Separate Projects)

```
/
├── .gitignore                            # Git ignore rules
├── README.md
│
├── frontend/                             # Next.js Frontend (independent project)
│   ├── package.json                      # Frontend dependencies
│   ├── tsconfig.json                     # TypeScript config
│   ├── next.config.js                    # Next.js config
│   ├── tailwind.config.js                # Tailwind CSS config (optional)
│   ├── .env.local                        # Local environment variables (gitignored)
│   ├── middleware.ts                     # Subdomain routing (admin.domain.com vs domain.com)
│   │
│   ├── app/
│   │   ├── layout.tsx                    # Root layout (html, body)
│   │   ├── not-found.tsx                 # Global 404 page
│   │   │
│   │   ├── (public)/
│   │   │   ├── not-found.tsx             # Public 404 page
│   │   │   ├── page.tsx                  # Homepage
│   │   │   ├── accounts/page.tsx         # Accounts list
│   │   │   ├── [slug]/page.tsx           # Upload page (uses MobileFrame)
│   │   │   ├── terms/page.tsx            # Terms of Service
│   │   │   └── privacy/page.tsx          # Privacy Policy
│   │   │
│   │   └── admin/
│   │       ├── layout.tsx                # Admin layout (nav + ProtectedRoute)
│   │       ├── not-found.tsx             # Admin 404 page
│   │       ├── page.tsx                  # Admin home (login/request buttons)
│   │       ├── login/page.tsx            # Login page
│   │       ├── request-access/page.tsx   # Request access form
│   │       └── dashboard/
│   │           ├── pending/page.tsx      # Pending posts table
│   │           └── history/page.tsx      # History page
│   │
│   ├── components/
│   │   ├── public/
│   │   │   ├── MobileFrame.tsx           # Phone viewport wrapper
│   │   │   ├── ImageUploader.tsx         # 1-10 image upload
│   │   │   ├── VideoUploader.tsx         # Video upload (Reels)
│   │   │   ├── ImageCropper.tsx          # Instagram-style crop interface
│   │   │   └── AspectRatioSelector.tsx   # 1:1, 4:5, 1.91:1 selector
│   │   │
│   │   └── admin/
│   │       ├── PostsTable.tsx            # Pending posts table (oldest to newest)
│   │       ├── MediaModal.tsx            # Media carousel modal
│   │       ├── DeclineModal.tsx          # Decline reason form
│   │       └── ProtectedRoute.tsx        # Auth wrapper component
│   │
│   └── lib/
│       ├── api.ts                        # API client functions
│       ├── auth.ts                       # Auth helpers (tokens, login, logout)
│       └── types.ts                      # TypeScript types (duplicated from backend)
│
├── backend/                              # Express Backend (independent project)
│   ├── package.json                      # Backend dependencies
│   ├── tsconfig.json                     # TypeScript config
│   ├── .env                              # Environment variables (gitignored)
│   │
│   └── src/
│       ├── types.ts                      # TypeScript types (duplicated from frontend)
│       ├── config/
│       │   ├── database.ts               # PostgreSQL connection
│       │   ├── redis.ts                  # Redis connection
│       │   ├── storage.ts                # Google Cloud Storage config
│       │   └── email.ts                  # SendGrid setup
│       │
│       ├── routes/
│       │   ├── submissions.ts            # POST /api/submissions
│       │   ├── auth.ts                   # POST /api/auth/login
│       │   ├── admin.ts                  # GET/PATCH /api/admin/posts
│       │   └── access-requests.ts        # POST /api/access-requests
│       │
│       ├── middleware/
│       │   ├── auth.ts                   # JWT verification
│       │   └── errorHandler.ts           # Global error handler
│       │
│       ├── services/
│       │   ├── storage.service.ts        # GCS upload/download
│       │   ├── image.service.ts          # Image processing/validation
│       │   ├── email.service.ts          # Email templates & sending
│       │   ├── instagram.service.ts      # Meta API (Instagram/Facebook)
│       │   └── scheduler.service.ts      # Posting logic
│       │
│       ├── models/
│       │   ├── Post.ts                   # Post model
│       │   ├── Account.ts                # Account model
│       │   ├── Admin.ts                  # Admin model
│       │   └── AdminRequest.ts           # Admin request model
│       │
│       ├── scheduler/
│       │   └── post-scheduler.ts         # Cloud Scheduler endpoint (every 30min)
│       │
│       └── index.ts                      # Express app entry point
│
└── database/                             # Database scripts (can live in backend/)
    ├── migrations/                       # SQL migration files
    │   ├── 001_create_accounts.sql
    │   ├── 002_create_admins.sql
    │   ├── 003_create_posts.sql
    │   └── 004_create_admin_requests.sql
    │
    └── seeds/                            # Seed data for development
        ├── 001_accounts.sql              # Initial accounts
        ├── 002_admins.sql                # Initial admin users
        └── 003_posts.sql                 # Sample posts (optional)
```

---

## Configuration Files

### Frontend `middleware.ts` (Subdomain Routing)
```typescript
// Handles routing between domain.com and admin.domain.com
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // Admin subdomain - route to /admin
  if (hostname.includes('admin.')) {
    if (!request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.rewrite(new URL('/admin' + request.nextUrl.pathname, request.url));
    }
  }
  // Public domain - block admin routes
  else {
    if (request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### Frontend `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['storage.googleapis.com'], // Allow GCS images
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
};

module.exports = nextConfig;
```

### Frontend `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### Backend `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### `.gitignore`
```
# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.production

# Build outputs
dist/
build/
.next/

# OS files
.DS_Store

# IDE
.vscode/
.idea/

# Logs
*.log
```

### `.env.example`
```bash
# Copy to .env and fill in your values

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/tattle_news
REDIS_URL=redis://localhost:6379

# Google Cloud Storage
GCS_BUCKET_NAME=tattle-news-uploads
GCS_PROJECT_ID=your-gcp-project-id
GCS_KEYFILE_PATH=./gcs-credentials.json

# SendGrid
SENDGRID_API_KEY=SG.your_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@tattle.social

# JWT
JWT_SECRET=your_secure_random_secret_key_here
JWT_EXPIRY=24h

# Cloud Scheduler
SCHEDULER_API_KEY=your_scheduler_secret_key

# Admin Email
ADMIN_EMAIL=admin@tattle.social

# URLs
PUBLIC_SITE_URL=https://tattle.social
ADMIN_SITE_URL=https://admin.tattle.social
BACKEND_URL=https://api.tattle.social
```

---

## Development & Deployment

### Local Development
```bash
# Terminal 1 - Frontend
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000

# Terminal 2 - Backend
cd backend
npm install
npm run dev
# Runs on http://localhost:4000
```

### Deployment

**Frontend → Vercel:**
```bash
cd frontend
vercel deploy

# Or connect GitHub repo to Vercel (auto-deploy on push)
```
- Configure DNS:
  - `tattle.social` → Points to Vercel
  - `admin.tattle.social` → CNAME to tattle.social
- Middleware routes based on subdomain

**Backend → Google Cloud Run:**
```bash
cd backend
gcloud run deploy tattle-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```
- Get URL: `https://tattle-backend-xxx.run.app`
- Configure as `api.tattle.social` via DNS

**Infrastructure:**
- PostgreSQL: Google Cloud SQL, Supabase, or similar
- Redis: Google Memorystore, Upstash, or similar
- GCS: Google Cloud Storage bucket
- Scheduler: Google Cloud Scheduler (triggers backend every 30 min)

---

## Shared TypeScript Types

Types are **duplicated** in both projects for simplicity:

**Frontend:** `frontend/lib/types.ts`
**Backend:** `backend/src/types.ts`

```typescript
// Example types (keep synchronized between projects)

export interface Post {
  id: number;
  account_id: number;
  caption: string;
  media: string[];
  email: string;
  instagram_username?: string;
  status: 'pending' | 'approved' | 'declined' | 'posted' | 'failed';
  created_at: string;
  posted_at?: string;
  declined_message?: string;
  error_message?: string;
  retry_count: number;
}

export interface Account {
  id: number;
  slug: string;
  instagram_username: string;
  instagram_id: string;
  facebook_id: string;
  access_token: string;
  is_active: boolean;
}

export interface Admin {
  id: number;
  username: string;
  password: string;
  account_ids: number[];
}

export interface AdminRequest {
  id: number;
  email: string;
  message: string;
  created_at: string;
}
```

**When updating:** Change database → Update backend types → Copy to frontend types

---

## Key Workflows

### Public Submission Flow (/{slug})
1. User chooses: Upload Images OR Upload Video
2. **Images (1-10):**
   - Upload 1-10 files
   - Select aspect ratio once: 1:1 (square), 4:5 (portrait), 1.91:1 (landscape)
   - Crop each image individually using Instagram-style UI (side arrows, bottom-right aspect ratio selector)
   - Preview all cropped images
3. **Video (1 Reel):**
   - Upload single video (max 3 minutes, 9:16 format)
   - No cropping needed
4. Enter caption, email, optional Instagram username
5. Submit → API uploads originals + cropped to GCS, saves metadata to DB
6. Send confirmation email to user
7. Send notification email to all admins for that account

**Mobile Optimization:**
- Desktop: Content in phone ratio (9:19.5), blank background around it
- Mobile: Full-width responsive

### Admin Authentication
1. Admin submits username/password
2. Backend validates against admins table (bcrypt)
3. Generate JWT, store in Redis with expiration
4. Return JWT, store in httpOnly cookie
5. All requests validated against Redis
6. Forgot password: mailto link to admin email

### Admin Review (Pending Posts)
1. Fetch posts WHERE account_id IN (admin's account_ids) AND status = 'pending' ORDER BY created_at ASC (oldest first)
2. Display in table format with columns: Date, Account, Email, Caption, Media, Shoutout, Actions
3. **Accept:** status → 'approved', send congratulatory email
4. **Decline:** Show modal for reason, status → 'declined', send decline email with reason

### Admin History
- Fetch all posts WHERE account_id IN (admin's account_ids)
- Show all with status badges
- Allow retry for failed posts

### Automated Posting (Every 30 Minutes)
1. Fetch all accounts from DB
2. For each account:
   - Query: account_id = X AND status = 'approved' ORDER BY created_at ASC LIMIT 1
   - If found:
     - **Images:** Use cropped_media, post as single image (1) or carousel (2-10)
     - **Video:** Use original media, post as Reel
     - Append Instagram username to caption if provided
     - Call Meta API for Instagram + Facebook
     - **Success:** status → 'posted', set posted_at, send success email
     - **Failure:** status → 'failed', increment retry_count, log error_message, email admins

---

## Email Notifications (SendGrid)

1. **Submission Confirmation** → User: "We received your submission!"
2. **Admin Notification** → All admins for account: "New submission for [account]"
3. **Approval** → User: "Your post has been approved!"
4. **Decline** → User: "Your post was declined: [reason]"
5. **Posted** → User: "Your post is live!"
6. **Error** → Admins: "Failed to post: [error]"

---

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Google Cloud Storage
GCS_BUCKET_NAME=...
GCS_PROJECT_ID=...
GCS_KEYFILE_PATH=...

# SendGrid
SENDGRID_API_KEY=...
SENDGRID_FROM_EMAIL=...

# JWT
JWT_SECRET=...
JWT_EXPIRY=24h

# Admin Email
ADMIN_EMAIL=your@email.com

# URLs
PUBLIC_SITE_URL=https://domain.com
ADMIN_SITE_URL=https://admin.domain.com
```

Note: Instagram/Facebook credentials (instagram_id, facebook_id, access_token) stored per account in database.

---

## Implementation Phases

### Phase 1: Project Setup & Database
- Initialize monorepo with Next.js frontend and Express backend
- PostgreSQL with migrations for all tables
- Redis connection setup
- GCS bucket configuration
- Shared TypeScript types

### Phase 2: Backend API Core
- Express server structure
- POST /api/submissions (file upload to GCS)
- Authentication endpoints (login, token validation)
- Admin endpoints (get posts, approve/decline)
- bcrypt password hashing

### Phase 3: Public Frontend
- Homepage with Terms/Privacy links
- /accounts page (hardcoded)
- /{slug} upload page with mobile frame
- ImageUploader with react-easy-crop
- VideoUploader
- Instagram-style cropping UI (arrows, aspect ratio selector)
- API integration

### Phase 4: Admin Frontend
- Admin homepage (login/request access)
- Login page with authentication
- Request access form
- Pending posts dashboard with table view (oldest to newest)
- History page with status badges
- Protected routes with JWT
- Media modal and decline modal

### Phase 5: Email & Scheduler
- SendGrid setup with 6 email templates
- Scheduler endpoint for automated posting
- Meta API integration (Instagram + Facebook)
- End-to-end posting workflow

### Phase 6: Polish & Deploy
- Loading states and error handling
- Retry logic for failed posts
- Form validation
- Environment configuration
- Deployment setup

---

## Technical Decisions

- **Separate projects:** Frontend and backend as independent projects for simplicity and clarity
- **Duplicated types:** TypeScript types copied between frontend/backend (~10 interfaces, easy to sync)
- **Single frontend deployment with subdomain routing:** One Next.js app serves both domain.com and admin.domain.com via middleware
- **Next.js App Router:** Supports multiple layouts for public/admin, modern routing
- **Table view for admin:** Efficient scanning of submissions (oldest to newest)
- **PostgreSQL arrays for account_ids:** Native support, efficient querying
- **Redis for sessions:** Fast, auto-expiry, scalable session management
- **GCS for files:** Reliable cloud storage, integrates with Cloud Scheduler
- **react-easy-crop:** Touch-friendly, mobile-first image cropping
- **SendGrid:** Reliable email delivery, generous free tier
- **bcrypt for passwords:** Industry standard password hashing
- **Separate image/video flows:** Cleaner UX, matches Instagram post types (carousels vs Reels)

