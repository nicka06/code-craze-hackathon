# Tattle News Deployment Guide

## Prerequisites
- GitHub repository: `https://github.com/nicka06/code-craze-hackathon.git`
- Google Cloud account with billing enabled
- Vercel account
- Supabase database (or Google Cloud SQL)

---

## Part 1: Backend Deployment to Google Cloud Run

### 1.1: Install Google Cloud CLI
```bash
# Install gcloud CLI if you haven't already
# https://cloud.google.com/sdk/docs/install
```

### 1.2: Authenticate and Set Project
```bash
# Login to Google Cloud
gcloud auth login

# Create a new project (or use existing)
gcloud projects create tattle-news --name="Tattle News"

# Set the project
gcloud config set project tattle-news

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable cloudscheduler.googleapis.com
```

### 1.3: Set Up Environment Secrets
```bash
cd backend

# Create secrets in Secret Manager
echo -n "your-database-url" | gcloud secrets create DATABASE_URL --data-file=-
echo -n "your-redis-url" | gcloud secrets create REDIS_URL --data-file=-
echo -n "your-resend-api-key" | gcloud secrets create RESEND_API_KEY --data-file=-
echo -n "your-gcs-project-id" | gcloud secrets create GCS_PROJECT_ID --data-file=-
echo -n "your-gcs-bucket-name" | gcloud secrets create GCS_BUCKET_NAME --data-file=-
echo -n "your-scheduler-secret" | gcloud secrets create SCHEDULER_SECRET --data-file=-
echo -n "noreply@yourdomain.com" | gcloud secrets create FROM_EMAIL --data-file=-
echo -n "admin@yourdomain.com" | gcloud secrets create ADMIN_EMAIL --data-file=-
echo -n "https://your-frontend.vercel.app" | gcloud secrets create FRONTEND_URL --data-file=-
```

### 1.4: Upload Service Account Key to Secret Manager
```bash
# For GCS authentication
gcloud secrets create GCS_SERVICE_ACCOUNT_KEY --data-file=./tattle-news-v1-5e7d3106b354.json
```

### 1.5: Deploy to Cloud Run
```bash
# Build and deploy
gcloud run deploy tattle-news-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars PORT=8080 \
  --set-secrets DATABASE_URL=DATABASE_URL:latest,REDIS_URL=REDIS_URL:latest,RESEND_API_KEY=RESEND_API_KEY:latest,GCS_PROJECT_ID=GCS_PROJECT_ID:latest,GCS_BUCKET_NAME=GCS_BUCKET_NAME:latest,SCHEDULER_SECRET=SCHEDULER_SECRET:latest,FROM_EMAIL=FROM_EMAIL:latest,ADMIN_EMAIL=ADMIN_EMAIL:latest,FRONTEND_URL=FRONTEND_URL:latest,GCS_KEY_FILE_PATH=/tmp/gcs-key.json

# Note the service URL (e.g., https://tattle-news-backend-xxxxx-uc.a.run.app)
```

### 1.6: Set Up Automatic Deployments from GitHub
```bash
# Connect Cloud Build to GitHub
gcloud beta builds triggers create github \
  --repo-name=code-craze-hackathon \
  --repo-owner=nicka06 \
  --branch-pattern="^main$" \
  --build-config=backend/cloudbuild.yaml
```

Create `backend/cloudbuild.yaml`:
```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/tattle-news-backend', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/tattle-news-backend']
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'tattle-news-backend'
      - '--image'
      - 'gcr.io/$PROJECT_ID/tattle-news-backend'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
images:
  - 'gcr.io/$PROJECT_ID/tattle-news-backend'
```

### 1.7: Set Up Cloud Scheduler for Auto-Posting
```bash
# Create a Cloud Scheduler job to trigger posting every 30 minutes
gcloud scheduler jobs create http tattle-news-posting \
  --schedule="*/30 * * * *" \
  --uri="https://YOUR-BACKEND-URL.run.app/api/scheduler/trigger" \
  --http-method=POST \
  --headers="Authorization=Bearer YOUR_SCHEDULER_SECRET" \
  --location=us-central1
```

---

## Part 2: Frontend Deployment to Vercel

### 2.1: Install Vercel CLI
```bash
npm install -g vercel
```

### 2.2: Deploy Frontend
```bash
cd ../frontend

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# When prompted:
# - Link to existing project? N
# - Project name: tattle-news
# - Directory: ./
# - Override settings? N

# Deploy to production
vercel --prod
```

### 2.3: Set Environment Variables in Vercel
Go to Vercel Dashboard → Project Settings → Environment Variables

Add:
```
NEXT_PUBLIC_BACKEND_URL=https://YOUR-BACKEND-URL.run.app
```

### 2.4: Set Up Automatic Deployments
Vercel automatically deploys when you push to GitHub! No extra setup needed.

**Configure in Vercel Dashboard:**
1. Go to your project → Settings → Git
2. Ensure GitHub repository is connected
3. Set Production Branch: `main`
4. Root Directory: `frontend`

---

## Part 3: Database Migration

### 3.1: Run Migrations on Production Database
```bash
cd backend

# Set production DATABASE_URL temporarily
export DATABASE_URL="your-production-db-url"

# Run migrations
npx prisma migrate deploy

# Or if using db push for first time
npx prisma db push
```

### 3.2: Seed Initial Data
```bash
# Create an admin user and account manually via SQL or Prisma Studio
npx prisma studio

# Or use SQL directly:
# INSERT INTO admins (username, password, account_ids) VALUES ('admin', 'hashed_password', ARRAY[1]);
# INSERT INTO accounts (instagram_username, instagram_id, facebook_id, access_token) VALUES (...);
```

---

## Part 4: Domain Setup (Optional)

### 4.1: Backend Custom Domain
```bash
# Map custom domain to Cloud Run
gcloud run services update tattle-news-backend \
  --add-custom-domain=api.yourdomain.com \
  --region=us-central1
```

### 4.2: Frontend Custom Domain
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your domain (e.g., `tattlenews.com`, `admin.tattlenews.com`)
3. Update DNS records as instructed

---

## Part 5: Testing Deployment

### 5.1: Test Backend
```bash
# Health check
curl https://YOUR-BACKEND-URL.run.app

# Test submission endpoint
curl -X POST https://YOUR-BACKEND-URL.run.app/api/submissions \
  -H "Content-Type: application/json" \
  -d '{"account_id": 1, "caption": "Test", "email": "test@test.com"}'
```

### 5.2: Test Frontend
1. Visit `https://your-frontend.vercel.app`
2. Visit `https://your-frontend.vercel.app/admin`
3. Test login and submission flow

---

## Part 6: Monitoring & Logs

### Backend Logs (Cloud Run)
```bash
# View logs
gcloud run services logs read tattle-news-backend --region=us-central1

# Or use Cloud Console:
# https://console.cloud.google.com/run
```

### Frontend Logs (Vercel)
- Visit Vercel Dashboard → Project → Logs

---

## Troubleshooting

### Backend Issues
- **Database connection fails**: Check DATABASE_URL in Secret Manager
- **GCS upload fails**: Verify service account key is correct
- **CORS errors**: Ensure FRONTEND_URL is set correctly

### Frontend Issues
- **API calls fail**: Verify NEXT_PUBLIC_BACKEND_URL is set
- **Build fails**: Check for TypeScript errors locally first

---

## Automatic Updates

Once set up:
1. **Push to GitHub main branch**
2. **Backend**: Cloud Build automatically builds and deploys to Cloud Run
3. **Frontend**: Vercel automatically builds and deploys

That's it! 🚀

