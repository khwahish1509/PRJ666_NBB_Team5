# 🚀 QUICK START GUIDE

## **What Was Built**

### ✅ **US-201: Barcode Scanning API**
- Get product by barcode
- Search products by name/brand
- Filter by category, skin type, price
- Sort by rating, price, safety
- Get recommendations

### ✅ **US-210: Scan History Storage**
- Add products to history
- View scan history
- Delete specific entries
- Clear all history

---

## **Quick Test (5 Minutes)**

### **Step 1: Setup**
```bash
# Navigate to server directory
cd dermoscanners/server

# Make sure you have .env file with:
# PORT=5001
# MONGO_URI=mongodb://localhost:27017/dermoscanners
# JWT_SECRET=your-secret-key

# Install dependencies (if not done)
npm install
```

### **Step 2: Seed Database**
```bash
# Make sure MongoDB is running
# Then run:
node seed/seed.js
```

**Expected Output:**
```
✅ Database seeded successfully!
📦 8 products inserted
📧 Test user created (test@example.com / Test123456)
```

### **Step 3: Start Server**
```bash
npm run dev
```

**Expected Output:**
```
API running on port 5001
```

### **Step 4: Test APIs**

#### **Test 1: Health Check**
```bash
curl http://localhost:5001/api/health
```

#### **Test 2: Get Product by Barcode**
```bash
curl http://localhost:5001/api/products/barcode/3700123456789
```

#### **Test 3: Search Products**
```bash
curl http://localhost:5001/api/products/search?q=cerave
```

#### **Test 4: Get Recommendations**
```bash
curl http://localhost:5001/api/products/recommendations?skinType=oily&maxPrice=20
```

#### **Test 5: Register & Login**
```bash
# Register
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Test123456",
    "skinType": "oily",
    "skinGoals": "Reduce oiliness"
  }'

# Login (use existing test user)
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

#### **Test 6: Add to History (Protected)**
```bash
# First login to get token, then:
curl -X POST http://localhost:5001/api/history \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PRODUCT_ID_HERE"
  }'
```

---

## **Using VS Code REST Client**

1. Install "REST Client" extension
2. Open `dermoscanners/server/test-api.http`
3. Click "Send Request" above any request

---

## **Using Postman/Thunder Client**

Import the requests from `test-api.http` or manually test:

### **Base URL:**
```
http://localhost:5001
```

### **Sample Requests:**

**1. Get Product by Barcode**
```
GET http://localhost:5001/api/products/barcode/3700123456789
```

**2. Search Products**
```
GET http://localhost:5001/api/products/search?q=cerave
```

**3. List All Products**
```
GET http://localhost:5001/api/products
```

**4. Filter Products**
```
GET http://localhost:5001/api/products?category=cleanser&skinType=oily
```

**5. Get Recommendations**
```
GET http://localhost:5001/api/products/recommendations?skinType=oily&maxPrice=20
```

**6. Register User**
```
POST http://localhost:5001/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Test123456",
  "skinType": "oily",
  "skinGoals": "Reduce oiliness"
}
```

**7. Login**
```
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123456"
}
```

**8. Add to History (Need Token)**
```
POST http://localhost:5001/api/history
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": "PRODUCT_ID"
}
```

---

## **What Each Endpoint Does**

### **Products:**
- `GET /api/products/barcode/:barcode` - Lookup product by barcode
- `GET /api/products/search?q=query` - Search by name/brand
- `GET /api/products` - List all with filters
- `GET /api/products/:id` - Get by ID
- `GET /api/products/recommendations` - Get recommendations

### **Auth:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### **History (Protected):**
- `GET /api/history` - Get user's scan history
- `POST /api/history` - Add product to history
- `DELETE /api/history/:id` - Delete specific entry
- `DELETE /api/history` - Clear all history

---

## **Sample Product Data**

| Product | Brand | Barcode | Price | Category |
|---------|-------|---------|-------|----------|
| Gentle Hydrating Cleanser | CeraVe | 3700123456789 | $14.99 | cleanser |
| Foaming Facial Cleanser | Cetaphil | 3700123456790 | $12.99 | cleanser |
| Daily Moisturizing Lotion | CeraVe | 3700123456791 | $16.99 | moisturizer |
| Hyaluronic Acid Serum | The Ordinary | 3700123456792 | $6.80 | serum |
| SPF 50 Mineral Sunscreen | La Roche-Posay | 3700123456793 | $29.99 | sunscreen |
| Retinol Serum 0.5% | The Ordinary | 3700123456794 | $9.80 | serum |
| Clay Mask | Kiehl's | 3700123456795 | $35.00 | mask |
| Rose Water Toner | Thayers | 3700123456796 | $10.95 | toner |

---

## **Test User Credentials**

```
Email: test@example.com
Password: Test123456
Skin Type: oily
```

---

## **Common Issues & Solutions**

### **Issue: MongoDB Connection Error**
**Solution:** Make sure MongoDB is running
```bash
# Windows
net start MongoDB

# Or start manually
mongod
```

### **Issue: Port Already in Use**
**Solution:** Change PORT in .env file or kill the process

### **Issue: 404 on Product**
**Solution:** Make sure you seeded the database first

### **Issue: 401 Unauthorized**
**Solution:** Login first to get JWT token, then use it in Authorization header

---

## **Next Steps**

1. ✅ Backend APIs are ready
2. ⏳ Frontend development (Arshdeep/Khwahish)
3. ⏳ Advanced features (Harsh/Paras)
4. ⏳ Testing (Harsimranjit)

---

## **Documentation Files**

- `TESTING_GUIDE.md` - Comprehensive testing guide
- `IMPLEMENTATION_SUMMARY.md` - What was built
- `QUICK_START.md` - This file
- `test-api.http` - API testing file

---

## **Support**

If you encounter any issues:
1. Check MongoDB is running
2. Check .env file is configured
3. Check database is seeded
4. Check server logs for errors
5. Review TESTING_GUIDE.md for detailed info

---

**Happy Testing! 🎉**

