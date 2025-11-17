# DermoScanner Deployment Guide

This guide provides step-by-step instructions for deploying the DermoScanner application to Render.

## Prerequisites

1. GitHub account with the repository pushed
2. Render account (sign up at https://render.com)
3. MongoDB Atlas account with a cluster set up

## Deployment Steps

### Step 1: Prepare MongoDB Atlas

1. Log in to MongoDB Atlas (https://cloud.mongodb.com)
2. Create a new cluster or use an existing one
3. Go to Database Access and create a database user
4. Go to Network Access and add `0.0.0.0/0` to allow connections from anywhere
5. Get your connection string from the "Connect" button
   - Format: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority`

### Step 2: Push Code to GitHub

```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

### Step 3: Deploy Backend API to Render

1. Log in to Render Dashboard (https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `dermoscanner-api`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: Leave empty (render.yaml will handle this)
   - **Runtime**: Node
   - **Build Command**: `cd dermoscanners/server && npm install`
   - **Start Command**: `cd dermoscanners/server && npm start`
   - **Plan**: Free

5. Add Environment Variables (click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-a-long-random-string>
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_SECRET=<generate-another-long-random-string>
   JWT_REFRESH_EXPIRES_IN=7d
   CLIENT_URL=<will-be-set-after-frontend-deployment>
   ```

6. Click "Create Web Service"
7. Wait for deployment to complete (5-10 minutes)
8. Copy the deployed URL (e.g., `https://dermoscanner-api.onrender.com`)

### Step 4: Deploy Frontend Client to Render

1. In Render Dashboard, click "New +" and select "Static Site"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `dermoscanner-client`
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Build Command**: `cd dermoscanners/client && npm install && npm run build`
   - **Publish Directory**: `dermoscanners/client/dist`

4. Add Environment Variable:
   ```
   VITE_API_URL=<your-backend-url>/api
   ```
   Example: `https://dermoscanner-api.onrender.com/api`

5. Click "Create Static Site"
6. Wait for deployment to complete (5-10 minutes)
7. Copy the deployed URL (e.g., `https://dermoscanner-client.onrender.com`)

### Step 5: Update Backend CORS Configuration

1. Go back to your backend service in Render Dashboard
2. Update the `CLIENT_URL` environment variable with your frontend URL
3. Click "Save Changes"
4. The service will automatically redeploy

### Step 6: Verify Deployment

1. Open your frontend URL in a browser
2. Test the following features:
   - User registration and login
   - Image upload and scan
   - View scan results and recommendations
   - Check scan history
   - Download backup

3. Check the backend health endpoint:
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"status":"ok"}`

## Alternative: Using render.yaml (Recommended)

If you have a `render.yaml` file in your repository root, Render can automatically deploy both services:

1. In Render Dashboard, click "New +" and select "Blueprint"
2. Connect your GitHub repository
3. Render will detect the `render.yaml` file
4. Review the services to be created
5. Add the sensitive environment variables in the dashboard:
   - For `dermoscanner-api`:
     - `MONGO_URI`
     - `JWT_SECRET`
     - `JWT_REFRESH_SECRET`
     - `CLIENT_URL` (add after frontend is deployed)
   - For `dermoscanner-client`:
     - `VITE_API_URL` (add after backend is deployed)
6. Click "Apply"
7. Both services will deploy automatically

## Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:
1. Verify `CLIENT_URL` in backend matches your frontend URL exactly
2. Ensure no trailing slashes in URLs
3. Check that CORS middleware is properly configured in `server.js`

### Database Connection Errors

If the backend can't connect to MongoDB:
1. Verify `MONGO_URI` is correct in environment variables
2. Check MongoDB Atlas Network Access allows `0.0.0.0/0`
3. Verify database user credentials are correct

### Build Failures

If builds fail:
1. Check the build logs in Render Dashboard
2. Verify all dependencies are in `package.json`
3. Ensure Node version compatibility (Render uses Node 18 by default)

### API Not Responding

If API requests fail:
1. Check backend service is running in Render Dashboard
2. Verify health endpoint: `https://your-backend-url.onrender.com/api/health`
3. Check environment variables are set correctly
4. Review application logs in Render Dashboard

## Environment Variables Reference

### Backend (dermoscanner-api)

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment mode | `production` |
| PORT | Server port | `5000` |
| MONGO_URI | MongoDB connection string | `mongodb+srv://...` |
| JWT_SECRET | JWT signing secret | `<random-string>` |
| JWT_EXPIRES_IN | JWT expiration time | `15m` |
| JWT_REFRESH_SECRET | Refresh token secret | `<random-string>` |
| JWT_REFRESH_EXPIRES_IN | Refresh token expiration | `7d` |
| CLIENT_URL | Frontend URL for CORS | `https://dermoscanner-client.onrender.com` |

### Frontend (dermoscanner-client)

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | `https://dermoscanner-api.onrender.com/api` |

## Generating Secure Secrets

To generate secure random strings for JWT secrets:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

## Post-Deployment Checklist

- [ ] Backend health endpoint returns `{"status":"ok"}`
- [ ] Frontend loads without errors
- [ ] User can register and login
- [ ] Image upload works
- [ ] Scan results display correctly
- [ ] Recommendations panel shows tips
- [ ] Scan history persists
- [ ] Backup download works
- [ ] HTTPS is enforced on all connections
- [ ] No CORS errors in browser console

## Monitoring and Maintenance

1. **Check Logs**: Regularly review logs in Render Dashboard
2. **Monitor Performance**: Use Render's metrics to track response times
3. **Database Backups**: Set up automated backups in MongoDB Atlas
4. **Update Dependencies**: Keep packages up to date for security
5. **Free Tier Limitations**: Render free tier services spin down after inactivity

## Support

For issues with:
- **Render**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Application**: Check GitHub issues or contact the development team
