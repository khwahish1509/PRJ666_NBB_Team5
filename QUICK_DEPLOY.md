# Quick Deployment Guide

This is a condensed version of the deployment process. For detailed instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

## Prerequisites

- GitHub repository with code pushed
- MongoDB Atlas cluster with connection string
- Render account (https://render.com)

## Quick Steps

### 1. Generate Secrets

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT_REFRESH_SECRET (run again for different value)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Deploy Backend

1. Render Dashboard → New + → Web Service
2. Connect GitHub repo
3. Configure:
   - Name: `dermoscanner-api`
   - Build: `cd dermoscanners/server && npm install`
   - Start: `cd dermoscanners/server && npm start`
4. Add environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<generated-secret-1>
   JWT_REFRESH_SECRET=<generated-secret-2>
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   CLIENT_URL=<will-add-after-frontend>
   ```
5. Deploy and copy URL

### 3. Deploy Frontend

1. Render Dashboard → New + → Static Site
2. Connect same GitHub repo
3. Configure:
   - Name: `dermoscanner-client`
   - Build: `cd dermoscanners/client && npm install && npm run build`
   - Publish: `dermoscanners/client/dist`
4. Add environment variable:
   ```
   VITE_API_URL=<backend-url>/api
   ```
5. Deploy and copy URL

### 4. Update Backend CORS

1. Go to backend service in Render
2. Update `CLIENT_URL` to frontend URL
3. Save (auto-redeploys)

### 5. Verify Deployment

```bash
# Test backend health
curl https://your-backend-url.onrender.com/api/health

# Run verification script
node verify-deployment.js https://your-backend-url.onrender.com https://your-frontend-url.onrender.com
```

## Environment Variables Quick Reference

### Backend
```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=<32-char-random-string>
JWT_REFRESH_SECRET=<32-char-random-string>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend.onrender.com
```

### Frontend
```
VITE_API_URL=https://your-backend.onrender.com/api
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Verify CLIENT_URL matches frontend URL exactly |
| Database connection fails | Check MONGO_URI and MongoDB Atlas network access |
| Build fails | Check logs, verify dependencies in package.json |
| 404 errors | Verify build/start commands are correct |

## Verification Checklist

- [ ] Backend health endpoint returns `{"status":"ok"}`
- [ ] Frontend loads without errors
- [ ] Can register and login
- [ ] Can upload image and get scan result
- [ ] Recommendations display correctly
- [ ] Scan history persists
- [ ] No CORS errors in console

## Support

- Full guide: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- Checklist: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- Render docs: https://render.com/docs
- MongoDB docs: https://docs.atlas.mongodb.com
