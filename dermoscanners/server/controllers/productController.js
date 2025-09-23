import Product from '../models/Product.js';

export async function listProducts(req, res) {
  const products = await Product.find().sort({ createdAt: -1 }).limit(50);
  res.json(products);
}

