import axios from 'axios';

const BASE_URL = 'https://world.openbeautyfacts.org/api/v0/product/';

export async function fetchProductByBarcode(barcode) {
  try {
    const response = await axios.get(`${BASE_URL}${barcode}.json`);
    if (!response.data || response.data.status !== 1) {
      return { error: 'Product not found in Open Beauty Facts database.' };
    }
    const product = response.data.product;
    
    // Transform API response to match our Product schema
    return {
      _id: `obf_${barcode}`, // Temporary ID for API products
      name: product.product_name || 'Unknown Product',
      brand: product.brands || 'Unknown Brand',
      price: 25, // Default price (API doesn't provide)
      rating: 3.5, // Default rating
      category: product.categories_tags?.[0]?.replace('en:', '') || 'beauty',
      skinTypes: ['all'], // API doesn't provide skin types
      safetyRating: 'caution', // Default safety rating
      sentimentScore: 0.7, // Default sentiment
      imageUrl: product.image_front_url || '',
      ingredients: product.ingredients_text || 'Not available',
      barcode: product.code || barcode,
      description: product.generic_name || product.product_name || '',
      volume: product.quantity || '',
      reviews: [],
      error: null
    };
  } catch (err) {
    console.error('Open Beauty Facts API error:', err.message);
    return { error: 'Failed to fetch product from Open Beauty Facts. Please try another barcode.' };
  }
}