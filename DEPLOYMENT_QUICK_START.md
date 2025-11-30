# 🚀 Quick Start Deployment Guide

## TL;DR - Deploy in 10 Minutes

### 1. Deploy Backend (Render) - 5 minutes

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Connect GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
5. Add env vars:
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<create-postgres-first>
   JWT_SECRET=<random-string>
   ```
6. Click **Create**
7. Copy URL: `https://your-app.onrender.com`

### 2. Deploy Frontend (Vercel) - 5 minutes

#### Option A: CLI (Fastest)
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

#### Option B: Dashboard
1. Go to https://vercel.com/new
2. Import GitHub repo
3. Settings:
   - Root Directory: `frontend`
   - Framework: Next.js
4. Add env var:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   ```
5. Click **Deploy**

### 3. Done! 🎉

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.onrender.com`

---

## Environment Variables

### Backend (Render)
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key-here
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

## Common Issues

**CORS Error?**
→ Add FRONTEND_URL to backend env vars

**API Not Working?**
→ Check NEXT_PUBLIC_API_URL in Vercel

**Database Error?**
→ Create PostgreSQL on Render first

---

## Need Help?

See full guide: `DEPLOYMENT_GUIDE.md`

Or run: `./deploy.sh`
