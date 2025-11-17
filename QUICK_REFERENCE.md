# DermoScanners - Quick Reference Card

## 🚀 Quick Start (5 Minutes)

### For Users
```
1. Visit app → Click "Get Started"
2. Register (name, email, password, skin type, goals)
3. Click "Scan" → Upload image → Get results
4. Click "Products" → Browse recommendations
5. Click "Compare" → Compare products
```

### For Developers
```bash
cd dermoscanners
npm install
# Edit server/.env with MongoDB URI
npm run dev
# Frontend: http://localhost:5173
# Backend: http://localhost:5001
```

## 📱 Main Features

| Feature | Description | Access |
|---------|-------------|--------|
| **AI Scan** | Analyze skin lesions | Scan → Skin Scan |
| **Products** | Get recommendations | Products menu |
| **Compare** | Compare 3 products | Compare menu |
| **History** | View past scans | History menu |
| **Profile** | Manage account | Profile menu |

## 🎯 Common Tasks

### Scan a Lesion
```
Scan → Skin Scan → Upload → Analyze → View Results
```

### Find Products
```
Products → Set Filters → Sort → Click Product → View Details
```

### Compare Products
```
Compare → Enter Barcode 1 → Enter Barcode 2 → View Table
```

### Backup Data
```
History → Download Backup → Save JSON File
```

### Restore Data
```
History → Upload Backup → Select File → Confirm
```

## 🔧 Technical Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (uploads)
- Helmet (security)

## 📁 Project Structure

```
dermoscanners/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API service
│   │   ├── context/       # React context
│   │   └── utils/         # Utilities
│   └── package.json
├── server/                # Express backend
│   ├── controllers/       # Route handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Middleware
│   └── package.json
└── package.json          # Workspace config
```

## 🔑 Environment Variables

### Client (.env)
```
VITE_API_URL=http://localhost:5001/api
```

### Server (.env)
```
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CLIENT_URL=http://localhost:5173
```

## 🎨 Key Components

### Reusable Components
```typescript
<LoadingSpinner size={48} message="Loading..." />
<ErrorMessage message="Error" onRetry={() => {}} />
```

### Custom Hooks
```typescript
const { data, loading, error, execute } = useApi();
```

### API Service
```typescript
import api from '../services/api';
const { data } = await api.get('/products');
```

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
GET    /api/auth/profile
PUT    /api/auth/profile
```

### AI & Scans
```
POST   /api/ai/analyze
GET    /api/ai/recommendations
POST   /api/scans
GET    /api/scans
PATCH  /api/scans/:id
DELETE /api/scans/:id
```

### Products
```
GET    /api/products
GET    /api/products/:id
GET    /api/products/barcode/:barcode
GET    /api/recommendations
```

### History
```
GET    /api/history
POST   /api/history
DELETE /api/history/:id
DELETE /api/history
```

## 🎯 User Flows

### First-Time User
```
Welcome → Register → Complete Profile → 
First Scan → View Results → Explore Products
```

### Returning User
```
Login → Dashboard → Quick Actions → 
Scan/Products/Compare → View History
```

### Product Research
```
Products → Filter by Skin Type → 
Sort by Safety → View Details → 
Compare Top 3 → Make Decision
```

## 🔒 Security Features

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Token refresh
- ✅ Protected routes
- ✅ Input validation
- ✅ XSS prevention
- ✅ CSRF protection
- ✅ Rate limiting

## 🚀 Performance Tips

### For Users
- Complete profile for better recommendations
- Download backups regularly
- Clear old scans if needed
- Use filters to narrow results

### For Developers
- Use api service (not axios directly)
- Implement loading states
- Handle errors gracefully
- Cache API responses
- Optimize images

## 📚 Documentation

| Document | Purpose | Location |
|----------|---------|----------|
| **User Guide** | Complete feature guide | USER_GUIDE.md |
| **Quick Start** | 5-minute setup | QUICK_START_GUIDE.md |
| **Features** | Detailed features | FEATURES_SHOWCASE.md |
| **Improvements** | All changes | IMPROVEMENTS_SUMMARY.md |
| **Transformation** | Complete overview | TRANSFORMATION_COMPLETE.md |
| **README** | Project overview | README.md |

## 🐛 Troubleshooting

### Upload Failed
```
✓ Check file size (< 5MB)
✓ Use JPEG/PNG/WebP
✓ Verify internet connection
```

### No Recommendations
```
✓ Complete profile
✓ Clear filters
✓ Refresh page
✓ Check database
```

### Sync Issues
```
✓ Check internet
✓ Refresh page
✓ Download backup
✓ Try again
```

### Slow Performance
```
✓ Clear cache
✓ Close tabs
✓ Check internet
✓ Try different browser
```

## 💡 Pro Tips

### For Best Results
1. Use good lighting for scans
2. Complete your profile
3. Set realistic filters
4. Check safety ratings
5. Read ingredient lists
6. Compare before buying
7. Download backups monthly
8. Track changes over time

### For Developers
1. Use TypeScript strictly
2. Follow component patterns
3. Implement error boundaries
4. Add loading states
5. Handle edge cases
6. Write clean code
7. Document complex logic
8. Test thoroughly

## 🎓 Learning Resources

### For Users
- User Guide (complete walkthrough)
- Quick Start (5-minute guide)
- Features Showcase (detailed features)
- FAQ (common questions)

### For Developers
- Developer Guide (setup & guidelines)
- API Documentation (endpoints)
- Code Examples (patterns)
- Architecture Docs (structure)

## 📞 Getting Help

### Support Channels
1. Check documentation
2. Review troubleshooting
3. Search FAQ
4. Contact support
5. Report issues

### Useful Links
- Documentation: See README.md
- Issues: GitHub Issues
- Support: support@dermoscanners.com
- Website: dermoscanners.com

## ✅ Quality Checklist

### Before Deployment
- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables set
- [ ] Database connected
- [ ] API endpoints working
- [ ] Frontend building
- [ ] Mobile responsive
- [ ] Security configured

### Before Release
- [ ] Documentation updated
- [ ] Version bumped
- [ ] Changelog updated
- [ ] Backup created
- [ ] Performance tested
- [ ] Security audited
- [ ] User testing done
- [ ] Deployment verified

## 🎉 Quick Wins

### Immediate Value
- ✅ Scan skin lesions instantly
- ✅ Get AI analysis in 3 seconds
- ✅ Find safe products easily
- ✅ Compare products side-by-side
- ✅ Track scan history automatically

### Long-Term Benefits
- ✅ Early detection of issues
- ✅ Informed product choices
- ✅ Better skin health
- ✅ Cost savings
- ✅ Peace of mind

---

## 🌟 Remember

**For Users**: This tool assists but doesn't replace medical professionals. Always consult a dermatologist for medical advice.

**For Developers**: Follow best practices, write clean code, and prioritize user experience.

**For Everyone**: Your skin health matters. Stay informed, stay safe! ✨

---

**Quick Reference Version**: 2.0.0
**Last Updated**: November 2024
**Status**: Production Ready

**Need more details?** Check the full documentation!
