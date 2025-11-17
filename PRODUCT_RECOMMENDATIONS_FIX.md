# Product Recommendations Fix

## Issue
The Product Recommendations page shows "No products found matching your criteria" because the database has no products.

## Solution
Run the product seed script to populate the database with sample skincare products.

## Steps to Fix

### 1. Run the Seed Script

```bash
cd dermoscanners/server
node seed-products.js
```

**Expected Output:**
```
Connecting to MongoDB...
✅ Connected to MongoDB

Clearing existing products...
✅ Cleared existing products

Inserting sample products...
✅ Inserted 10 products

Sample products:
1. Hydrating Facial Cleanser by CeraVe - $14.99
2. Daily Moisturizing Lotion by Cetaphil - $16.99
3. Vitamin C Serum by The Ordinary - $7.99
4. Mineral Sunscreen SPF 50 by La Roche-Posay - $33.99
5. Niacinamide 10% + Zinc 1% by The Ordinary - $5.99
6. Hyaluronic Acid Toner by Neutrogena - $12.99
7. Clay Mask Purifying by L'Oréal - $9.99
8. Retinol Night Serum by RoC - $24.99
9. Gentle Foaming Cleanser by Aveeno - $11.99
10. Oil-Free Moisturizer by Neutrogena - $13.99

✅ Database seeded successfully!
```

### 2. Refresh the Page

1. Go to `http://localhost:5173/recommendations`
2. Refresh the page (Cmd+R or Ctrl+R)
3. You should now see 10 products!

## What Products Were Added

### Cleansers (2 products)
- **CeraVe Hydrating Facial Cleanser** - $14.99 (Dry, Normal, Sensitive)
- **Aveeno Gentle Foaming Cleanser** - $11.99 (Sensitive, Dry, Normal)

### Moisturizers (2 products)
- **Cetaphil Daily Moisturizing Lotion** - $16.99 (All skin types)
- **Neutrogena Oil-Free Moisturizer** - $13.99 (Oily, Combination)

### Serums (3 products)
- **The Ordinary Vitamin C Serum** - $7.99 (Normal, Combination, Oily)
- **The Ordinary Niacinamide 10% + Zinc 1%** - $5.99 (Oily, Combination, Normal)
- **RoC Retinol Night Serum** - $24.99 (Normal, Combination, Dry)

### Sunscreen (1 product)
- **La Roche-Posay Mineral Sunscreen SPF 50** - $33.99 (Dry, Normal, Sensitive)

### Toner (1 product)
- **Neutrogena Hyaluronic Acid Toner** - $12.99 (Dry, Normal, Combination)

### Mask (1 product)
- **L'Oréal Clay Mask Purifying** - $9.99 (Oily, Combination, Normal)

## Features You Can Now Test

### 1. Filtering
- **Skin Type**: Filter by Dry, Oily, Combination, Sensitive, Normal
- **Max Price**: Set a maximum price (e.g., $20)
- **Category**: Filter by Cleanser, Moisturizer, Serum, Sunscreen, Toner, Mask

### 2. Sorting
- **Relevance**: Default sorting
- **Highest Rated**: Sort by rating (highest first)
- **Lowest Price**: Sort by price (lowest first)
- **Highest Price**: Sort by price (highest first)
- **Safest First**: Sort by safety rating

### 3. Product Details
- Click on any product to see full details
- View ingredients and safety information
- Read customer reviews
- See sentiment analysis

## Example Filters to Try

### For Oily Skin Under $15
1. Set Skin Type: "Oily"
2. Set Max Price: "15"
3. Results: Niacinamide Serum ($5.99), Oil-Free Moisturizer ($13.99)

### For Sensitive Skin
1. Set Skin Type: "Sensitive"
2. Results: CeraVe Cleanser, Cetaphil Lotion, La Roche-Posay Sunscreen, Aveeno Cleanser

### Serums Only
1. Set Category: "Serum"
2. Results: 3 serums (Vitamin C, Niacinamide, Retinol)

## Troubleshooting

### Error: "Cannot connect to MongoDB"
**Solution**: Check your MONGO_URI in `.env` file

### Error: "Module not found"
**Solution**: Run `npm install` in the server directory

### Products Still Not Showing
**Solution**: 
1. Check browser console for errors
2. Verify server is running on port 5001
3. Try clearing browser cache
4. Check Network tab in DevTools to see API response

## API Endpoint

The page calls: `GET http://localhost:5001/api/recommendations`

**Query Parameters:**
- `skinType` - Filter by skin type
- `maxPrice` - Maximum price
- `category` - Product category

**Example:**
```bash
curl "http://localhost:5001/api/recommendations?skinType=oily&maxPrice=20"
```

## Database Schema

Each product has:
- **name**: Product name
- **brand**: Brand name
- **barcode**: Unique barcode
- **price**: Price in USD
- **rating**: Rating (0-5)
- **description**: Product description
- **category**: cleanser, moisturizer, serum, sunscreen, toner, mask
- **skinTypes**: Array of suitable skin types
- **safetyRating**: safe, caution, warning
- **sentimentScore**: 0-1 (based on reviews)
- **imageUrl**: Product image URL
- **ingredients**: Array of ingredients with risk levels
- **reviews**: Array of customer reviews

## Next Steps

After seeding:
1. ✅ Browse products on `/recommendations` page
2. ✅ Test filters and sorting
3. ✅ Click on products to see details
4. ✅ Try different filter combinations

---

**Status**: Ready to seed  
**Action Required**: Run `node seed-products.js`  
**Expected Result**: 10 products visible on recommendations page
