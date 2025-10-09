# Deployment Guide - Ethiopian Barbershop Management System

## Overview
This guide will help you deploy:
- **Frontend** → Vercel
- **Backend** → Render (or Railway/Heroku)
- **Database** → MySQL on PlanetScale, Railway, or Aiven

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare Backend
1. Your backend is ready in the `backend` folder
2. Make sure `package.json` has a start script

### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### Step 3: Configure Render
1. Connect your GitHub repository: `becs-maker/barbershop`
2. Configure settings:
   - **Name**: `barbershop-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 4: Add Environment Variables
In Render dashboard, add these environment variables:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
FRONTEND_URL=https://your-app.vercel.app

# Database - Add after setting up database
DB_HOST=your_database_host
DB_PORT=3306
DB_NAME=barbershop
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL: `https://barbershop-api.onrender.com`

---

## Part 2: Setup MySQL Database

### Option A: PlanetScale (Recommended - Free Tier)

1. Go to https://planetscale.com
2. Sign up and create new database: `barbershop`
3. Get connection details from dashboard
4. Update Render environment variables with database credentials

### Option B: Railway

1. Go to https://railway.app
2. Create new project → Add MySQL
3. Copy connection details
4. Update Render environment variables

### Option C: Aiven

1. Go to https://aiven.io
2. Create MySQL service (free tier available)
3. Get connection details
4. Update Render environment variables

### Step 6: Seed Database
After database is connected, run seed script:
1. In Render dashboard, go to "Shell" tab
2. Run: `node seed-direct.js`

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### Step 2: Deploy via Vercel Dashboard

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import `becs-maker/barbershop` repository

### Step 3: Configure Vercel

**Root Directory**: `frontend`

**Build Settings**:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Environment Variables**:
```
VITE_API_URL=https://barbershop-api.onrender.com/api
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build (2-5 minutes)
3. Your app will be live at: `https://barbershop-xxx.vercel.app`

### Step 5: Update Backend CORS
Go back to Render and update environment variable:
```
FRONTEND_URL=https://barbershop-xxx.vercel.app
```

---

## Part 4: Alternative - Deploy via CLI

### Deploy Frontend with Vercel CLI

```bash
cd frontend
vercel login
vercel --prod
```

When prompted:
- Set up and deploy: `Y`
- Which scope: Select your account
- Link to existing project: `N`
- Project name: `barbershop`
- Directory: `./`
- Override settings: `N`

---

## Part 5: Post-Deployment

### 1. Test Your Application
- Visit your Vercel URL
- Try registering a new account
- Test booking an appointment
- Login as admin: `admin@barbershop.com` / `admin123`

### 2. Custom Domain (Optional)
**Vercel**:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**Render**:
1. Go to Settings → Custom Domain
2. Add domain and update DNS

### 3. Enable HTTPS
Both Vercel and Render provide free SSL certificates automatically.

---

## Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_URL` in Vercel environment variables
- Verify backend is running on Render
- Check CORS settings in backend

### Database connection fails
- Verify database credentials in Render
- Check if database allows external connections
- Ensure IP whitelist includes Render's IPs

### Build fails
- Check build logs in Vercel/Render
- Verify all dependencies are in `package.json`
- Ensure Node version compatibility

---

## Environment Variables Summary

### Backend (Render)
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=https://your-app.vercel.app
DB_HOST=your_db_host
DB_PORT=3306
DB_NAME=barbershop
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Cost Estimate

- **Vercel**: Free (Hobby plan)
- **Render**: Free (with limitations: sleeps after 15 min inactivity)
- **Database**: Free tier available on all platforms
- **Total**: $0/month for development/testing

### Upgrade for Production:
- **Render**: $7/month (no sleep, better performance)
- **PlanetScale**: $29/month (production database)
- **Vercel**: Free is usually sufficient

---

## Quick Deploy Commands

```bash
# Commit and push changes
git add .
git commit -m "Prepare for deployment"
git push origin main

# Deploy frontend
cd frontend
vercel --prod

# Backend deploys automatically via Render when you push to GitHub
```

---

## Support

If you encounter issues:
1. Check deployment logs in Vercel/Render dashboard
2. Verify environment variables are set correctly
3. Test backend API directly: `https://your-backend.onrender.com/api/health`
4. Check browser console for frontend errors

---

**Next Steps**: Follow Part 1 to deploy your backend first, then proceed to Part 3 for frontend deployment.
