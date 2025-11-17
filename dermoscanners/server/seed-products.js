/**
 * Product Seed Script
 * Populates the database with sample skincare products
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const sampleProducts = [
  {
    name: 'Hydrating Facial Cleanser',
    brand: 'CeraVe',
    barcode: '3337875597388',
    price: 14.99,
    rating: 4.7,
    description: 'Gentle, non-foaming cleanser that hydrates and restores the skin barrier',
    category: 'cleanser',
    skinTypes: ['dry', 'normal', 'sensitive'],
    safetyRating: 'safe',
    sentimentScore: 0.92,
    volume: '236ml',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    ingredients: [
      { name: 'Ceramides', riskLevel: 'low', warnings: [] },
      { name: 'Hyaluronic Acid', riskLevel: 'low', warnings: [] },
      { name: 'Glycerin', riskLevel: 'low', warnings: [] }
    ],
    reviews: [
      { rating: 5, comment: 'Amazing cleanser! Very gentle on my sensitive skin.', sentiment: 0.95 },
      { rating: 4, comment: 'Good product, but wish it came in a larger size.', sentiment: 0.75 }
    ]
  },
  {
    name: 'Daily Moisturizing Lotion',
    brand: 'Cetaphil',
    barcode: '3499320002851',
    price: 16.99,
    rating: 4.6,
    description: 'Lightweight, non-greasy moisturizer for all skin types',
    category: 'moisturizer',
    skinTypes: ['dry', 'normal', 'combination', 'sensitive'],
    safetyRating: 'safe',
    sentimentScore: 0.88,
    volume: '473ml',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
    ingredients: [
      { name: 'Glycerin', riskLevel: 'low', warnings: [] },
      { name: 'Dimethicone', riskLevel: 'low', warnings: [] },
      { name: 'Vitamin E', riskLevel: 'low', warnings: [] }
    ],
    reviews: [
      { rating: 5, comment: 'Perfect for daily use. Absorbs quickly!', sentiment: 0.90 },
      { rating: 4, comment: 'Good moisturizer, no fragrance which I love.', sentiment: 0.85 }
    ]
  },
  {
    name: 'Vitamin C Serum',
    brand: 'The Ordinary',
    barcode: '7694877001234',
    price: 7.99,
    rating: 4.3,
    description: 'Brightening serum with 23% pure vitamin C',
    category: 'serum',
    skinTypes: ['normal', 'combination', 'oily'],
    safetyRating: 'caution',
    sentimentScore: 0.78,
    volume: '30ml',
    imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400',
    ingredients: [
      { name: 'Ascorbic Acid', riskLevel: 'medium', warnings: ['May cause irritation in sensitive skin'] },
      { name: 'Vitamin E', riskLevel: 'low', warnings: [] }
    ],
    reviews: [
      { rating: 5, comment: 'Brightened my skin tone significantly!', sentiment: 0.92 },
      { rating: 3, comment: 'Effective but can be irritating.', sentiment: 0.65 }
    ]
  },
  {
    name: 'Mineral Sunscreen SPF 50',
    brand: 'La Roche-Posay',
    barcode: '3337875545730',
    price: 33.99,
    rating: 4.8,
    description: 'Broad spectrum mineral sunscreen for sensitive skin',
    category: 'sunscreen',
    skinTypes: ['dry', 'normal', 'sensitive'],
    safetyRating: 'safe',
    sentimentScore: 0.94,
    volume: '50ml',
    imageUrl: 'https://images.unsplash.com/photo-1556228852-80c3c6d5e1a8?w=400',
    ingredients: [
      { name: 'Zinc Oxide', riskLevel: 'low', warnings: [] },
      { name: 'Titanium Dioxide', riskLevel: 'low', warnings: [] },
      { name: 'Niacinamide', riskLevel: 'low', warnings: [] }
    ],
    reviews: [
      { rating: 5, comment: 'Best sunscreen for sensitive skin!', sentiment: 0.98 },
      { rating: 5, comment: 'No white cast, absorbs well.', sentiment: 0.90 }
    ]
  },
  {
    name: 'Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    barcode: '7694877001567',
    price: 5.99,
    rating: 4.4,
    description: 'Reduces appearance of blemishes and congestion',
    category: 'serum',
    skinTypes: ['oily', 'combination', 'normal'],
    safetyRating: 'safe',
    sentimentScore: 0.82,
    volume: '30ml',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
    ingredients: [
      { name: 'Niacinamide', riskLevel: 'low', warnings: [] },
      { name: 'Zinc PCA', riskLevel: 'low', warnings: [] }
    ],
    reviews: [
      { rating: 5, comment: 'Helped with my oily skin and pores!', sentiment: 0.88 },
      { rating: 4, comment: 'Good value for money.', sentiment: 0.75 }
    ]
  },
  {
    name: 'Hyaluronic Acid Toner',
    brand: 'Neutrogena',
    barcode: '3574661234567',
    price: 12.99,
    rating: 4.5,
    description: 'Hydrating toner with hyaluronic acid',
    category: 'toner',
    skinTypes: ['dry', 'normal', 'combination'],
    safetyRating: 'safe',
    sentimentScore: 0.86,
    volume: '200ml',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    ingredients: [
      { name: 'Hyaluronic Acid', riskLevel: 'low', warnings: [] },
      { name: 'Glycerin', riskLevel: 'low', warnings: [] }
    ],
    reviews: [
      { rating: 5, comment: 'Very hydrating, love it!', sentiment: 0.92 },
      { rating: 4, comment: 'Good toner, but bottle could be better.', sentiment: 0.80 }
    ]
  },
  {
    name: 'Clay Mask Purifying',
    brand: 'L\'Oréal',
    barcode: '3600523456789',
    price: 9.99,
    rating: 4.2,
    description: 'Detoxifying clay mask for deep cleansing',
    category: 'mask',
    skinTypes: ['oily', 'combination', 'normal'],
    safetyRating: 'safe',
    sentimentScore: 0.79,
    volume: '50ml',
    imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400',
    ingredients: [
      { name: 'Kaolin Clay', riskLevel: 'low', warnings: [] },
      { name: 'Charcoal', riskLevel: 'low', warnings: [] }
    ],
    reviews: [
      { rating: 4, comment: 'Leaves skin feeling clean and fresh.', sentiment: 0.82 },
      { rating: 4, comment: 'Good for weekly deep cleansing.', sentiment: 0.75 }
    ]
  },
  {
    name: 'Retinol Night Serum',
    brand: 'RoC',
    barcode: '3574660987654',
    price: 24.99,
    rating: 4.6,
    description: 'Anti-aging serum with retinol',
    category: 'serum',
    skinTypes: ['normal', 'combination', 'dry'],
    safetyRating: 'caution',
    sentimentScore: 0.84,
    volume: '30ml',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
    ingredients: [
      { name: 'Retinol', riskLevel: 'medium', warnings: ['Use sunscreen during day', 'May cause irritation'] },
      { name: 'Hyaluronic Acid', riskLevel: 'low', warnings: [] }
    ],
    reviews: [
      { rating: 5, comment: 'Noticed improvement in fine lines!', sentiment: 0.90 },
      { rating: 4, comment: 'Effective but start slow to avoid irritation.', sentiment: 0.78 }
    ]
  },
  {
    name: 'Gentle Foaming Cleanser',
    brand: 'Aveeno',
    barcode: '3574661111111',
    price: 11.99,
    rating: 4.4,
    description: 'Gentle foaming cleanser with oat extract',
    category: 'cleanser',
    skinTypes: ['sensitive', 'dry', 'normal'],
    safetyRating: 'safe',
    sentimentScore: 0.87,
    volume: '200ml',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    ingredients: [
      { name: 'Oat Extract', riskLevel: 'low', warnings: [] },
      { name: 'Glycerin', riskLevel: 'low', warnings: [] }
    ],
    reviews: [
      { rating: 5, comment: 'So gentle on my sensitive skin!', sentiment: 0.93 },
      { rating: 4, comment: 'Cleans well without stripping.', sentiment: 0.82 }
    ]
  },
  {
    name: 'Oil-Free Moisturizer',
    brand: 'Neutrogena',
    barcode: '3574662222222',
    price: 13.99,
    rating: 4.5,
    description: 'Lightweight oil-free moisturizer for oily skin',
    category: 'moisturizer',
    skinTypes: ['oily', 'combination'],
    safetyRating: 'safe',
    sentimentScore: 0.85,
    volume: '118ml',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
    ingredients: [
      { name: 'Dimethicone', riskLevel: 'low', warnings: [] },
      { name: 'Glycerin', riskLevel: 'low', warnings: [] }
    ],
    reviews: [
      { rating: 5, comment: 'Perfect for my oily skin!', sentiment: 0.90 },
      { rating: 4, comment: 'Lightweight and non-greasy.', sentiment: 0.80 }
    ]
  }
];

async function seedProducts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\nClearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Cleared existing products');

    console.log('\nInserting sample products...');
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${inserted.length} products`);

    console.log('\nSample products:');
    inserted.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} by ${product.brand} - $${product.price}`);
    });

    console.log('\n✅ Database seeded successfully!');
    console.log('\nYou can now:');
    console.log('1. Visit http://localhost:5173/recommendations');
    console.log('2. Browse and filter products');
    console.log('3. Click on products to see details');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

seedProducts();
