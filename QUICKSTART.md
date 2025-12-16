# Quick Deployment Steps

## TL;DR - Deploy in 10 Minutes

### 1. Backend to Google Cloud Run (5 mins)
```bash
cd backend

# Login and set project
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Deploy (it will build and deploy automatically)
gcloud run deploy tattle-news-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated

# When prompted, set environment variables or add them later in Cloud Console
```

**After deployment, add secrets in Cloud Console:**
- Go to https://console.cloud.google.com/run
- Click your service → Edit & Deploy New Revision
- Add environment variables from your `.env` file

### 2. Frontend to Vercel (3 mins)
```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel --prod

# When prompted:
# - Project name: tattle-news
# - Root directory: ./
```

**After deployment, add environment variable in Vercel:**
- Go to https://vercel.com/dashboard
- Your project → Settings → Environment Variables
- Add: `NEXT_PUBLIC_BACKEND_URL=https://YOUR-BACKEND-URL.run.app`
- Redeploy

### 3. Set Up Auto-Deploy (2 mins)

**Backend (Cloud Build):**
```bash
# In backend directory
gcloud builds submit --config cloudbuild.yaml

# Connect to GitHub for auto-deploy
gcloud beta builds triggers create github \
  --repo-name=code-craze-hackathon \
  --repo-owner=nicka06 \
  --branch-pattern="^main$" \
  --build-config=backend/cloudbuild.yaml
```

**Frontend:** Already automatic! Vercel auto-deploys on push to main.

### 4. Set Up Scheduler (1 min)
```bash
# Create Cloud Scheduler job (posts every 30 min)
gcloud scheduler jobs create http tattle-news-posting \
  --schedule="*/30 * * * *" \
  --uri="https://YOUR-BACKEND-URL.run.app/api/scheduler/trigger" \
  --http-method=POST \
  --headers="Authorization=Bearer YOUR_SCHEDULER_SECRET" \
  --location=us-central1
```

### 5. Run Database Migration
```bash
cd backend
export DATABASE_URL="your-production-database-url"
npx prisma db push
```

## Done! 🚀

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend-xxx.run.app`
- Admin: `https://your-app.vercel.app/admin`

Every push to `main` branch will auto-deploy both services!

---

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

