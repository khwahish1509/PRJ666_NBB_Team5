# 🚀 DermoScanners - Quick Start Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

---

## 📦 Installation

### 1. Clone the Repository
```bash
cd dermoscanners
```

### 2. Install Server Dependencies
```bash
cd server
npm install
```

### 3. Install Client Dependencies
```bash
cd ../client
npm install
```

---

## ⚙️ Configuration

### Server Configuration
Create a `.env` file in the `server` directory:

```env
# Server
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/dermoscanners
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dermoscanners

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this-too
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Client Configuration
Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5001/api
```

---

## 🎯 Running the Application

### Development Mode

#### Terminal 1 - Start MongoDB (if local)
```bash
mongod
```

#### Terminal 2 - Start Backend Server
```bash
cd server
npm run dev
```
Server will run on: `http://localhost:5001`

#### Terminal 3 - Start Frontend Client
```bash
cd client
npm run dev
```
Client will run on: `http://localhost:5173`

---

## 🌱 Seed Database (Optional)

To populate the database with sample products:

```bash
cd server
npm run seed
```

This will create:
- Sample products with barcodes
- Ingredient safety data
- Product categories
- Reviews and ratings

---

## 🧪 Running Tests

### Backend Tests
```bash
cd server
npm test
```

### Run Tests with Coverage
```bash
cd server
npm run test:coverage
```

### Run Tests in Watch Mode
```bash
cd server
npm run test:watch
```

---

## 📱 Using the Application

### 1. Register an Account
- Navigate to `http://localhost:5173/register`
- Fill in your details
- Select your skin type

### 2. Login
- Use your registered credentials
- Navigate to the dashboard

### 3. Scan Products
- Click "Scan Product" on dashboard
- Enter barcode: `3700123456789` (sample)
- Or search by product name

### 4. View Product Details
- See complete product information
- Ingredient safety analysis
- Review sentiment scores

### 5. Get Recommendations
- Click "Recommendations"
- Filter by skin type, price, category
- Sort by rating, price, safety

### 6. Compare Products
- Click "Compare Products"
- Enter multiple barcodes
- View side-by-side comparison

### 7. View Scan History
- Check dashboard for recent scans
- Delete individual items
- Clear all history

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token

### Products
- `GET /api/products` - List all products
- `GET /api/products/barcode/:barcode` - Get product by barcode
- `GET /api/products/search?q=query` - Search products
- `GET /api/products/:id` - Get product by ID

### Recommendations
- `GET /api/recommendations` - Get personalized recommendations
- Query params: `skinType`, `maxPrice`, `category`, `limit`

### Scan History
- `GET /api/history` - Get user scan history
- `POST /api/history` - Add to scan history
- `DELETE /api/history/:id` - Delete specific entry
- `DELETE /api/history` - Clear all history

### Sentiment Analysis
- `POST /api/sentiment/analyze` - Analyze single text
- `POST /api/sentiment/analyze-reviews` - Analyze multiple reviews

### Ingredient Safety
- `POST /api/ingredients/analyze` - Analyze ingredient
- `POST /api/ingredients/check-compatibility` - Check skin type compatibility

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
**Error**: `MongoNetworkError: failed to connect`
**Solution**: 
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas, verify IP whitelist and credentials

### Port Already in Use
**Error**: `EADDRINUSE: address already in use`
**Solution**:
```bash
# Find process using port 5001
netstat -ano | findstr :5001  # Windows
lsof -i :5001                 # Mac/Linux

# Kill the process or change PORT in .env
```

### CORS Errors
**Error**: `Access to fetch blocked by CORS policy`
**Solution**:
- Verify `CORS_ORIGIN` in server `.env`
- Should match client URL (`http://localhost:5173`)

### Build Errors
**Error**: Module not found
**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Sample Test Barcodes

Use these barcodes for testing:
- `3700123456789` - CeraVe Hydrating Cleanser
- `3700123456790` - La Roche-Posay Moisturizer
- `3700123456791` - Neutrogena Sunscreen

---

## 🔧 Build for Production

### Build Client
```bash
cd client
npm run build
```
Output will be in `client/dist`

### Build Server
```bash
cd server
# Set NODE_ENV=production in .env
npm start
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vitest Testing](https://vitest.dev/)

---

## 🆘 Need Help?

Check these files for more information:
- `COMPLETION_REPORT.md` - Full feature list
- `TESTING_GUIDE.md` - Testing documentation
- `RECOMMENDATION_ENGINE_GUIDE.md` - Recommendation algorithm details
- `INGREDIENT_SAFETY_GUIDE.md` - Safety analysis documentation

---

## 🎉 You're Ready to Go!

Your DermoScanners application is now running. Happy scanning! 🧴✨
