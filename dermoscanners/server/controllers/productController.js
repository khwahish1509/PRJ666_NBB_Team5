import Product from '../models/Product.js';

/**
 * Get product by barcode
 * GET /api/products/barcode/:barcode
 */
export async function getProductByBarcode(req, res) {
  try {
    const { barcode } = req.params;

    if (!barcode) {
      return res.status(400).json({ 
        success: false, 
        message: 'Barcode is required' 
      });
    }

    const product = await Product.findOne({ barcode });

    if (!product) {
      // Try Open Beauty Facts API
      try {
        const { fetchProductByBarcode } = await import('../services/openBeautyFactsService.js');
        const apiProduct = await fetchProductByBarcode(barcode);
        if (apiProduct.error) {
          console.error('Open Beauty Facts fetch error:', apiProduct.error);
          return res.status(404).json({ 
            success: false, 
            message: apiProduct.error
          });
        }
        return res.json({
          success: true,
          data: apiProduct
        });
      } catch (err) {
        console.error('Controller import/fetch error:', err);
        return res.status(500).json({
          success: false,
          message: 'Server error while fetching product from Open Beauty Facts'
        });
      }
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product by barcode:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching product' 
    });
  }
}

/**
 * Search products by name or brand
 * GET /api/products/search?q=query
 */
export async function searchProducts(req, res) {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query must be at least 2 characters' 
      });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } }
      ]
    }).limit(20);

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ success: false, message: 'Server error while searching products' });
  }
}

/**
 * Get all products with filters
 * GET /api/products?category=cleanser&skinType=oily&minPrice=10&maxPrice=50
 */
export async function listProducts(req, res) {
  try {
    const { category, skinType, minPrice, maxPrice, sortBy = 'rating' } = req.query;

    const query = {};

    // Apply filters
    if (category) query.category = category;
    if (skinType) query.skinTypes = skinType;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sort = {};
    switch (sortBy) {
      case 'price':
        sort = { price: 1 };
        break;
      case 'rating':
        sort = { rating: -1 };
        break;
      default:
        sort = { rating: -1 };
    }

    const products = await Product.find(query).sort(sort);

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error listing products:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching products' 
    });
  }
}

/**
 * Get product by ID or barcode
 * GET /api/products/:id
 */
export async function getProductById(req, res) {
  try {
    const id = req.params.id;
    let product = null;

    // Check if id is a valid ObjectId (24 hex chars)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ barcode: id });
    }

    // If not found in DB, try Open Beauty Facts
    if (!product) {
      try {
        const { fetchProductByBarcode } = await import('../services/openBeautyFactsService.js');
        const apiProduct = await fetchProductByBarcode(id);
        if (apiProduct.error) {
          return res.status(404).json({ success: false, message: apiProduct.error });
        }
        return res.json({ success: true, data: apiProduct });
      } catch (err) {
        console.error('Controller import/fetch error:', err);
        return res.status(500).json({ success: false, message: 'Server error while fetching product from Open Beauty Facts' });
      }
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching product' });
  }
}

/**
 * Get recommended products based on user profile
 * GET /api/products/recommendations?skinType=oily&maxPrice=50
 */
export async function getRecommendations(req, res) {
  try {
    const { skinType, maxPrice, excludeId } = req.query;

    const query = {};

    if (skinType) {
      query.skinTypes = skinType;
    }

    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    // Get products sorted by safety and rating
    const recommendations = await Product.find(query)
      .sort({ safetyRating: 1, rating: -1 })
      .limit(10);

    res.json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching recommendations' 
    });
  }
}