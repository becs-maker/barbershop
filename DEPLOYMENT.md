# Deployment Guide

This guide covers deploying the Ethiopian Barbershop application to production.

## Prerequisites

- GitHub account (for code hosting)
- MongoDB Atlas account (for database)
- Vercel/Netlify account (for frontend)
- Render/Heroku account (for backend)

## 1. Database Setup (MongoDB Atlas)

### Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new cluster (Free tier is fine for starting)
4. Wait for cluster to be created (2-5 minutes)

### Configure Database Access

1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Create username and password (save these!)
4. Set privileges to "Read and write to any database"

### Configure Network Access

1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Confirm

### Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `barbershop`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/barbershop?retryWrites=true&w=majority
```

## 2. Backend Deployment (Render)

### Prepare Backend

1. Ensure `backend/package.json` has start script:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

2. Create `backend/.gitignore` if not exists

### Deploy to Render

1. Go to [Render](https://render.com/)
2. Sign up or log in
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: barbershop-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

6. Add Environment Variables:
   - `NODE_ENV`: production
   - `MONGODB_URI`: (your MongoDB Atlas connection string)
   - `JWT_SECRET`: (generate a long random string)
   - `PORT`: 5000
   - `FRONTEND_URL`: (will add after frontend deployment)
   - Add other optional variables (email, SMS, etc.)

7. Click "Create Web Service"
8. Wait for deployment (5-10 minutes)
9. Copy your backend URL (e.g., `https://barbershop-api.onrender.com`)

## 3. Frontend Deployment (Vercel)

### Prepare Frontend

1. Update `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

2. Ensure build works locally:
```bash
cd frontend
npm run build
```

### Deploy to Vercel

1. Go to [Vercel](https://vercel.com/)
2. Sign up or log in with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com/api`

7. Click "Deploy"
8. Wait for deployment (2-5 minutes)
9. Copy your frontend URL (e.g., `https://barbershop.vercel.app`)

### Update Backend CORS

1. Go back to Render dashboard
2. Open your backend service
3. Add/Update environment variable:
   - `FRONTEND_URL`: `https://your-frontend-url.vercel.app`
4. Save and redeploy

## 4. Alternative: Deploy to Heroku

### Backend on Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
cd backend
heroku create barbershop-api

# Add MongoDB Atlas
# Set environment variables
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set JWT_SECRET="your_secret"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main

# Open app
heroku open
```

### Frontend on Netlify

1. Go to [Netlify](https://www.netlify.com/)
2. Drag and drop your `frontend/dist` folder
3. Or connect GitHub repository
4. Configure build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: `frontend`

## 5. Post-Deployment Setup

### Create Admin Account

1. Register through the frontend
2. Connect to MongoDB Atlas:
   - Go to your cluster
   - Click "Browse Collections"
   - Find `barbershop` database → `users` collection
   - Edit your user document
   - Change `role` to `"admin"`

### Add Initial Data

1. Login as admin
2. Go to admin dashboard
3. Add services through the UI
4. Create staff users and barber profiles

### Configure Notifications (Optional)

#### Email (Gmail)
1. Enable 2FA on Gmail
2. Generate App Password
3. Add to Render environment variables:
   - `EMAIL_HOST`: smtp.gmail.com
   - `EMAIL_PORT`: 587
   - `EMAIL_USER`: your-email@gmail.com
   - `EMAIL_PASSWORD`: your-app-password

#### SMS/WhatsApp (Twilio)
1. Sign up at Twilio
2. Get credentials
3. Add to environment variables:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`

## 6. Custom Domain (Optional)

### Vercel Custom Domain
1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Render Custom Domain
1. Go to Render service settings
2. Click "Custom Domains"
3. Add your domain
4. Update DNS records as instructed

## 7. Monitoring & Maintenance

### Monitor Application
- Check Render/Vercel logs regularly
- Set up error tracking (e.g., Sentry)
- Monitor MongoDB Atlas metrics

### Backups
- MongoDB Atlas provides automatic backups
- Download backups periodically

### Updates
```bash
# Pull latest changes
git pull origin main

# Backend updates automatically redeploy on Render
# Frontend updates automatically redeploy on Vercel
```

## 8. Security Checklist

- ✅ Environment variables are set (not hardcoded)
- ✅ JWT secret is strong and random
- ✅ MongoDB Atlas network access is configured
- ✅ CORS is properly configured
- ✅ HTTPS is enabled (automatic on Vercel/Render)
- ✅ Rate limiting is active
- ✅ Input validation is in place

## Troubleshooting

### Backend Issues
- Check Render logs
- Verify environment variables
- Test MongoDB connection
- Check CORS settings

### Frontend Issues
- Check browser console
- Verify API URL is correct
- Check network tab for failed requests
- Clear browser cache

### Database Issues
- Check MongoDB Atlas metrics
- Verify connection string
- Check IP whitelist
- Monitor connection limits

## Cost Estimates

### Free Tier (Good for starting)
- MongoDB Atlas: Free (512MB storage)
- Render: Free (750 hours/month)
- Vercel: Free (100GB bandwidth)

### Paid Tier (For production)
- MongoDB Atlas: ~$9/month (Shared cluster)
- Render: ~$7/month (Starter plan)
- Vercel: Free or ~$20/month (Pro)

**Total**: ~$16-36/month for small to medium traffic

## Support

For deployment issues:
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com/

---

Good luck with your deployment! 🚀
