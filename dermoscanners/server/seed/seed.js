import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

dotenv.config();

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/dermoscanners';
  await mongoose.connect(uri);
  await Product.deleteMany({});
  await Product.insertMany([
    //SAMPLE PRODUCTS
    { name: 'Gentle Cleanser', brand: 'DermaCo', barcode: '111111', price: 12.99, rating: 4.5, description: 'Soothing daily cleanser', ingredients: ['Water', 'Glycerin', 'Aloe Vera'] },
    { name: 'Hydrating Serum', brand: 'SkinLab', barcode: '222222', price: 24.0, rating: 4.7, description: 'Hyaluronic acid serum', ingredients: ['Water', 'Hyaluronic Acid', 'Panthenol'] },
        { name: 'Niacinamide Sermun', brand: 'SkinLab', barcode: '333333', price: 26.0, rating: 4.9, description: 'Niacinamide  serum', ingredients: ['Water', 'Niacinamide Acid', 'Zinc'] }

  ]);
  console.log('Seeded products');
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

