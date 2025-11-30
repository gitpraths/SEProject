# Deployment Guide: Vercel (Frontend) + Render (Backend)

This guide will help you deploy the Homeless Aid Platform with the frontend on Vercel and backend on Render.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Render account (sign up at https://render.com)
- PostgreSQL database (can be created on Render)

---

## Part 1: Deploy Backend to Render

### Step 1: Create PostgreSQL Database on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `homeless-aid-db`
   - **Database**: `homeless_aid`
   - **User**: (auto-generated)
   - **Region**: Choose closest to you
   - **Plan**: Free
4. Click **"Create Database"**
5. **Save the connection details** (you'll need the Internal Database URL)

### Step 2: Deploy Backend Service

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `homeless-aid-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<your-postgres-internal-url>
   JWT_SECRET=<generate-a-secure-random-string>
   MONGODB_URI=<your-mongodb-uri-if-using>
   ```

5. Click **"Create Web Service"**

6. Wait for deployment to complete (5-10 minutes)

7. **Copy your backend URL**: `https://homeless-aid-backend.onrender.com`

### Step 3: Run Database Migrations

1. In your Render backend service, go to **"Shell"** tab
2. Run migrations:
   ```bash
   npm run migrate
   ```

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Prepare Frontend

1. Create a `.env.production` file in the `frontend` directory:
   ```bash
   NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com
   ```
   Replace with your actual Render backend URL

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to frontend directory:
   ```bash
   cd homeless-aid-platform/frontend
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. Follow the prompts:
   - **Set up and deploy**: Yes
   - **Which scope**: Your account
   - **Link to existing project**: No
   - **Project name**: homeless-aid-platform
   - **Directory**: ./
   - **Override settings**: No

6. For production deployment:
   ```bash
   vercel --prod
   ```

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. **Add Environment Variables**:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-app.onrender.com`

6. Click **"Deploy"**

7. Wait for deployment (3-5 minutes)

8. **Copy your frontend URL**: `https://homeless-aid-platform.vercel.app`

---

## Part 3: Configure CORS

Update your backend to allow requests from your Vercel frontend:

1. In Render dashboard, go to your backend service
2. Add environment variable:
   ```
   FRONTEND_URL=https://homeless-aid-platform.vercel.app
   ```

3. Your backend should already have CORS configured in `src/app.js`:
   ```javascript
   const cors = require('cors');
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
     credentials: true
   }));
   ```

---

## Part 4: Verify Deployment

### Test Backend

1. Visit: `https://your-backend-app.onrender.com/health`
2. Should return: `{"status": "ok"}`

### Test Frontend

1. Visit: `https://homeless-aid-platform.vercel.app`
2. Try logging in
3. Check browser console for any API errors

---

## Part 5: Custom Domain (Optional)

### For Vercel (Frontend)

1. In Vercel project settings → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### For Render (Backend)

1. In Render service settings → **Custom Domains**
2. Add your custom domain (e.g., `api.yourdomain.com`)
3. Update DNS records as instructed

---

## Troubleshooting

### Backend Issues

**Problem**: Database connection fails
- **Solution**: Check DATABASE_URL is correct
- Ensure database is in same region as backend
- Check database is running

**Problem**: 502 Bad Gateway
- **Solution**: Check logs in Render dashboard
- Verify start command is correct
- Ensure PORT environment variable is set

### Frontend Issues

**Problem**: API calls fail with CORS error
- **Solution**: Check FRONTEND_URL in backend env vars
- Verify CORS configuration in backend

**Problem**: Build fails
- **Solution**: Check build logs in Vercel
- Ensure all dependencies are in package.json
- Verify Node version compatibility

**Problem**: Environment variables not working
- **Solution**: Redeploy after adding env vars
- Ensure variables start with `NEXT_PUBLIC_` for client-side access

---

## Monitoring & Maintenance

### Render (Backend)

- **Logs**: Dashboard → Your Service → Logs
- **Metrics**: Dashboard → Your Service → Metrics
- **Free tier**: Spins down after 15 min of inactivity (cold starts)

### Vercel (Frontend)

- **Analytics**: Dashboard → Your Project → Analytics
- **Logs**: Dashboard → Your Project → Deployments → View Function Logs
- **Free tier**: Unlimited bandwidth, 100 GB-hours

---

## Cost Optimization

### Free Tier Limits

**Render**:
- 750 hours/month free
- Spins down after 15 min inactivity
- 512 MB RAM
- Shared CPU

**Vercel**:
- Unlimited deployments
- 100 GB bandwidth/month
- 100 GB-hours compute time

### Tips

1. Use Render's free PostgreSQL (1 GB storage)
2. Optimize images and assets for Vercel
3. Enable caching where possible
4. Monitor usage in dashboards

---

## Quick Commands Reference

### Backend (Render)

```bash
# View logs
render logs -s homeless-aid-backend

# Run shell command
render shell -s homeless-aid-backend

# Restart service
render restart -s homeless-aid-backend
```

### Frontend (Vercel)

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls
```

---

## Environment Variables Checklist

### Backend (Render)

- [ ] NODE_ENV=production
- [ ] PORT=5000
- [ ] DATABASE_URL
- [ ] JWT_SECRET
- [ ] MONGODB_URI (if using MongoDB)
- [ ] FRONTEND_URL

### Frontend (Vercel)

- [ ] NEXT_PUBLIC_API_URL

---

## Support

If you encounter issues:

1. Check service logs (Render/Vercel dashboards)
2. Verify environment variables
3. Test API endpoints directly
4. Check GitHub repository is up to date
5. Review CORS configuration

---

## Next Steps

After successful deployment:

1. ✅ Test all features (auth, profiles, shelter module)
2. ✅ Set up monitoring/alerts
3. ✅ Configure custom domains (optional)
4. ✅ Set up CI/CD for automatic deployments
5. ✅ Add SSL certificates (automatic on both platforms)
6. ✅ Configure backup strategy for database

---

## Automatic Deployments

Both platforms support automatic deployments:

**Vercel**: Automatically deploys on push to main branch
**Render**: Automatically deploys on push to main branch

To enable:
1. Connect GitHub repository
2. Select branch to deploy
3. Enable auto-deploy in settings

---

Your application is now live! 🎉

**Frontend**: https://homeless-aid-platform.vercel.app
**Backend**: https://homeless-aid-backend.onrender.com
