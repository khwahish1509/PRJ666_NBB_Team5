# DermoScanners - Quick Start Guide

Get up and running with DermoScanners in 5 minutes! 🚀

## For Users

### 1. Access the App
Visit the deployed application or run locally:
```bash
# If running locally
cd dermoscanners
npm install
npm run dev
```

### 2. Create Account (30 seconds)
1. Click "Get Started" or "Register"
2. Enter your details:
   - Name
   - Email
   - Password (min 8 characters)
   - Skin type (optional but recommended)
   - Skincare goals (min 10 characters)
3. Click "Register"

### 3. Start Using Features

#### Scan a Skin Lesion
1. Click "Scan" → "Skin Scan"
2. Upload a clear photo
3. Wait 3 seconds for AI analysis
4. View results and recommendations

#### Find Products
1. Click "Products"
2. Filter by skin type, price, or category
3. Click any product for details
4. Compare up to 3 products side-by-side

#### Track History
1. Click "History"
2. View all your scans
3. Download backup anytime
4. Restore from backup if needed

## For Developers

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Git

### Installation (2 minutes)

```bash
# 1. Clone repository
git clone <repository-url>
cd PRJ666_NBB_Team5/dermoscanners

# 2. Install dependencies
npm install

# 3. Configure environment
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit server/.env with your MongoDB URI
# MONGO_URI=mongodb+srv://...

# 4. Start development servers
npm run dev
```

### Access Points
- Frontend: http://localhost:5173
- Backend: http://localhost:5001
- API Docs: http://localhost:5001/api/health

### Quick Test

```bash
# Test backend
curl http://localhost:5001/api/health

# Expected: {"status":"ok"}
```

### Seed Database (Optional)

```bash
cd server
npm run seed
```

This adds sample products for testing.

## Key Features Overview

### 🔍 AI Skin Scanning
- Upload skin lesion images
- Get instant AI analysis
- Receive confidence scores
- View health recommendations

### 💡 Smart Recommendations
- Personalized product suggestions
- Filter by skin type, price, category
- Sort by relevance, rating, price, safety
- View detailed product information

### 📊 Product Comparison
- Compare up to 3 products
- Side-by-side feature comparison
- Best value indicator
- Safety and rating analysis

### 📜 Scan History
- Automatic save to local storage
- Cloud sync with MongoDB
- Backup and restore functionality
- Delete individual or all scans

### 👤 User Profile
- Manage personal information
- Set skin type and goals
- Track profile completion
- Update preferences anytime

## Common Use Cases

### Use Case 1: First-Time Skin Scan
```
1. Register account
2. Complete profile (set skin type)
3. Navigate to Scan page
4. Upload skin lesion photo
5. Review AI analysis
6. Read health recommendations
7. Scan auto-saved to history
```

### Use Case 2: Find Safe Products
```
1. Go to Products page
2. Set skin type filter
3. Set max price (optional)
4. Sort by "Safest First"
5. Click product for details
6. Check ingredient safety
7. Add to comparison (optional)
```

### Use Case 3: Compare Products
```
1. Go to Compare page
2. Enter first product barcode
3. Enter second product barcode
4. Enter third product (optional)
5. Review comparison table
6. Check "Best Value" indicator
7. Make informed decision
```

## Tips for Best Experience

### For Scanning
✅ Use good lighting
✅ Take clear, focused photos
✅ Capture entire lesion
✅ Avoid shadows/glare
❌ Don't use blurry images
❌ Don't scan in poor lighting

### For Recommendations
✅ Complete your profile
✅ Set accurate skin type
✅ Use filters effectively
✅ Check safety ratings
❌ Don't ignore warnings
❌ Don't skip ingredient review

### For Data Management
✅ Download backups regularly
✅ Sync across devices
✅ Delete old scans if needed
✅ Keep profile updated
❌ Don't rely only on local storage
❌ Don't share backup files

## Troubleshooting

### Can't upload image?
- Check file size (max 5MB)
- Use JPEG, PNG, or WebP format
- Verify internet connection

### No recommendations showing?
- Complete your profile
- Clear filters
- Refresh the page
- Check database has products

### Scan not saving?
- Check internet connection
- Verify you're logged in
- Download backup as precaution
- Try again after refresh

### Slow performance?
- Clear browser cache
- Close unnecessary tabs
- Check internet speed
- Try different browser

## Next Steps

### For Users
1. ✅ Complete your profile
2. ✅ Perform your first scan
3. ✅ Explore product recommendations
4. ✅ Compare products
5. ✅ Download a backup

### For Developers
1. ✅ Review codebase structure
2. ✅ Read API documentation
3. ✅ Test all endpoints
4. ✅ Explore database schema
5. ✅ Check deployment guide

## Resources

- **Full Documentation**: See README.md
- **User Guide**: See USER_GUIDE.md
- **Deployment**: See DEPLOYMENT_GUIDE.md
- **API Reference**: See server/TESTING_GUIDE.md
- **Support**: Contact through app

## Important Notes

⚠️ **Medical Disclaimer**: This app is for informational purposes only. Always consult a healthcare professional for medical advice.

🔒 **Privacy**: Your data is encrypted and secure. We never share personal information.

🆓 **Free to Use**: DermoScanners is completely free with no hidden costs.

---

**Ready to start?** Visit the app and click "Get Started"! 🎉

**Questions?** Check the full documentation or contact support.

**Happy scanning!** ✨
