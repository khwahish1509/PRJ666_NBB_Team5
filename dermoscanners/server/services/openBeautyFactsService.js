import axios from 'axios';

const BASE_URL = 'https://world.openbeautyfacts.org/api/v0/product/';

export async function fetchProductByBarcode(barcode) {
  try {
    const response = await axios.get(`${BASE_URL}${barcode}.json`);
    if (!response.data || response.data.status !== 1) {
      return { error: 'Product not found.' };
    }
    const product = response.data.product;
    return {
      name: product.product_name || '',
      brand: product.brands || '',
      image: product.image_front_url || '',
      ingredients: product.ingredients_text || '',
      barcode: product.code || barcode,
      categories: product.categories || '',
      quantity: product.quantity || '',
      packaging: product.packaging || '',
      error: null
    };
  } catch (err) {
    console.error('Open Beauty Facts API error:', err);
    return { error: 'API error or network issue.' };
  }
}