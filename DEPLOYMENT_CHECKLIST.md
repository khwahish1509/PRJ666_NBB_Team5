# Deployment Checklist for DermoScanner

Use this checklist to ensure all deployment steps are completed correctly.

## Pre-Deployment Checklist

### Code Preparation
- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] All environment variables documented in .env.example files
- [ ] .env files added to .gitignore
- [ ] Code committed to Git
- [ ] Code pushed to GitHub repository

### Database Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with read/write permissions
- [ ] Network access configured (0.0.0.0/0 for Render)
- [ ] Connection string obtained and tested locally

### Security
- [ ] JWT_SECRET generated (32+ character random string)
- [ ] JWT_REFRESH_SECRET generated (different from JWT_SECRET)
- [ ] No sensitive data in code or committed .env files
- [ ] CORS configuration uses CLIENT_URL from environment

## Deployment Steps

### Step 1: Push to GitHub
```bash
# Verify all changes are committed
git status

# Add any remaining files
git add .

# Commit changes
git commit -m "Prepare for production deployment"

# Push to main branch
git push origin main
```

- [ ] Code pushed to GitHub successfully
- [ ] Repository is accessible (public or Render has access)

### Step 2: Deploy Backend API

#### Create Service on Render
- [ ] Logged into Render Dashboard (https://dashboard.render.com)
- [ ] Clicked "New +" → "Web Service"
- [ ] Connected GitHub repository
- [ ] Selected correct repository and branch (main)

#### Configure Backend Service
- [ ] Name: `dermoscanner-api` (or your preferred name)
- [ ] Region: Oregon (US West) or closest to your users
- [ ] Branch: `main`
- [ ] Root Directory: (leave empty)
- [ ] Runtime: Node
- [ ] Build Command: `cd dermoscanners/server && npm install`
- [ ] Start Command: `cd dermoscanners/server && npm start`
- [ ] Plan: Free (or paid plan)

#### Set Environment Variables
- [ ] NODE_ENV = `production`
- [ ] PORT = `5000`
- [ ] MONGO_URI = `<your-mongodb-atlas-connection-string>`
- [ ] JWT_SECRET = `<generated-random-string>`
- [ ] JWT_EXPIRES_IN = `15m`
- [ ] JWT_REFRESH_SECRET = `<generated-random-string>`
- [ ] JWT_REFRESH_EXPIRES_IN = `7d`
- [ ] CLIENT_URL = `<will-set-after-frontend-deployment>`

#### Deploy and Verify
- [ ] Clicked "Create Web Service"
- [ ] Deployment completed without errors
- [ ] Backend URL copied (e.g., `https://dermoscanner-api.onrender.com`)
- [ ] Health endpoint verified: `https://your-backend-url.onrender.com/api/health`
- [ ] Health endpoint returns: `{"status":"ok"}`

### Step 3: Deploy Frontend Client

#### Create Static Site on Render
- [ ] In Render Dashboard, clicked "New +" → "Static Site"
- [ ] Connected same GitHub repository
- [ ] Selected correct repository and branch (main)

#### Configure Frontend Service
- [ ] Name: `dermoscanner-client` (or your preferred name)
- [ ] Branch: `main`
- [ ] Root Directory: (leave empty)
- [ ] Build Command: `cd dermoscanners/client && npm install && npm run build`
- [ ] Publish Directory: `dermoscanners/client/dist`

#### Set Environment Variables
- [ ] VITE_API_URL = `<your-backend-url>/api`
  - Example: `https://dermoscanner-api.onrender.com/api`

#### Deploy and Verify
- [ ] Clicked "Create Static Site"
- [ ] Deployment completed without errors
- [ ] Frontend URL copied (e.g., `https://dermoscanner-client.onrender.com`)
- [ ] Frontend loads in browser without errors

### Step 4: Update Backend CORS

- [ ] Returned to backend service in Render Dashboard
- [ ] Updated `CLIENT_URL` environment variable with frontend URL
- [ ] Saved changes (service will auto-redeploy)
- [ ] Waited for redeployment to complete

## Post-Deployment Verification

### Backend API Tests
- [ ] Health endpoint accessible: `GET /api/health`
- [ ] Returns: `{"status":"ok"}`
- [ ] HTTPS enforced (http:// redirects to https://)
- [ ] No errors in Render logs

### Frontend Tests
- [ ] Homepage loads without errors
- [ ] No CORS errors in browser console
- [ ] All assets load (CSS, JS, images)
- [ ] HTTPS enforced

### Feature Tests
- [ ] User Registration
  - [ ] Can create new account
  - [ ] Receives appropriate success/error messages
  - [ ] Redirected to login after registration

- [ ] User Login
  - [ ] Can log in with valid credentials
  - [ ] Invalid credentials show error
  - [ ] JWT token stored correctly
  - [ ] Redirected to dashboard after login

- [ ] Image Upload & Scan
  - [ ] Can select and upload image
  - [ ] Upload progress shown
  - [ ] Scan completes within 5 seconds
  - [ ] Result card displays correctly
  - [ ] Confidence meter shows percentage

- [ ] Recommendations
  - [ ] Recommendation panel appears after scan
  - [ ] Correct tips shown based on result type
  - [ ] Tips are readable and formatted correctly

- [ ] Scan History
  - [ ] Previous scans displayed
  - [ ] Scans sorted by date (newest first)
  - [ ] Can view scan details
  - [ ] Timestamps formatted correctly

- [ ] Backup & Restore
  - [ ] Can download backup JSON file
  - [ ] Backup file contains all scans
  - [ ] Can upload and restore from backup
  - [ ] Restored scans appear in history

- [ ] Database Sync
  - [ ] Scans saved to MongoDB
  - [ ] Scans persist after page reload
  - [ ] Scans accessible across devices (same user)

### Cross-Browser Testing
- [ ] Chrome (latest) - Desktop
- [ ] Safari (latest) - Desktop
- [ ] Firefox (latest) - Desktop
- [ ] Edge (latest) - Desktop
- [ ] Chrome - Mobile (iOS/Android)
- [ ] Safari - Mobile (iOS)

### Performance Tests
- [ ] Page load time < 3 seconds
- [ ] Scan processing time ~3 seconds
- [ ] No memory leaks (check DevTools)
- [ ] Images load quickly
- [ ] API responses < 2 seconds

### Security Verification
- [ ] HTTPS enforced on all pages
- [ ] No sensitive data in browser console
- [ ] No API keys exposed in frontend code
- [ ] CORS only allows configured frontend URL
- [ ] JWT tokens expire correctly
- [ ] Protected routes require authentication

## Troubleshooting

### If Backend Deployment Fails
1. Check build logs in Render Dashboard
2. Verify all dependencies in package.json
3. Ensure Node version compatibility
4. Check environment variables are set
5. Verify MongoDB connection string is correct

### If Frontend Deployment Fails
1. Check build logs in Render Dashboard
2. Verify Vite build completes locally: `npm run build`
3. Check VITE_API_URL is set correctly
4. Ensure all dependencies in package.json

### If CORS Errors Occur
1. Verify CLIENT_URL in backend matches frontend URL exactly
2. Check for trailing slashes (should not have them)
3. Ensure backend redeployed after CLIENT_URL update
4. Clear browser cache and try again

### If Database Connection Fails
1. Verify MONGO_URI is correct
2. Check MongoDB Atlas Network Access allows 0.0.0.0/0
3. Verify database user credentials
4. Check MongoDB Atlas cluster is running

### If Features Don't Work
1. Check browser console for errors
2. Check Render logs for backend errors
3. Verify all environment variables are set
4. Test API endpoints directly with Postman/curl
5. Verify database has data (use MongoDB Atlas UI)

## Rollback Plan

If deployment has critical issues:

1. **Immediate**: Revert to previous working deployment
   - In Render Dashboard, go to service
   - Click "Manual Deploy" → Select previous commit
   - Click "Deploy"

2. **Code Fix**: Fix issues locally and redeploy
   ```bash
   git revert HEAD
   git push origin main
   ```
   - Render will auto-deploy the reverted code

3. **Emergency**: Disable service temporarily
   - In Render Dashboard, suspend service
   - Display maintenance page
   - Fix issues and redeploy

## Monitoring

### Daily Checks
- [ ] Check Render Dashboard for service health
- [ ] Review error logs for issues
- [ ] Monitor MongoDB Atlas for connection issues
- [ ] Check user feedback for bugs

### Weekly Checks
- [ ] Review performance metrics
- [ ] Check database size and growth
- [ ] Update dependencies if needed
- [ ] Review security advisories

### Monthly Checks
- [ ] Full feature regression testing
- [ ] Performance optimization review
- [ ] Database backup verification
- [ ] Security audit

## Success Criteria

Deployment is successful when:
- ✅ All services running without errors
- ✅ All features working as expected
- ✅ No CORS or security errors
- ✅ Database connected and syncing
- ✅ HTTPS enforced everywhere
- ✅ Performance meets requirements
- ✅ Cross-browser compatibility verified
- ✅ Mobile responsive design working

## Notes

- Free tier services on Render spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to paid plan for production use
- Set up monitoring and alerting for production
- Keep deployment documentation updated

## Contact

For deployment issues:
- Render Support: https://render.com/docs
- MongoDB Support: https://docs.atlas.mongodb.com
- Team Lead: [Add contact info]
