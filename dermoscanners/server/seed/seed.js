import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const sampleProducts = [
  {
    name: "Gentle Hydrating Cleanser",
    brand: "CeraVe",
    barcode: "3700123456789",
    price: 14.99,
    rating: 4.5,
    description: "A gentle, non-foaming cleanser that removes makeup and dirt without stripping the skin",
    category: "cleanser",
    skinTypes: ["dry", "sensitive", "normal"],
    ingredients: [
      { name: "Ceramides", riskLevel: "low", warnings: [] },
      { name: "Hyaluronic Acid", riskLevel: "low", warnings: [] },
      { name: "Glycerin", riskLevel: "low", warnings: [] },
      { name: "Sodium Lauroamphoacetate", riskLevel: "low", warnings: [] }
    ],
    reviews: [
      { rating: 5, comment: "Perfect for my dry skin!", sentiment: 0.95 },
      { rating: 4, comment: "Very gentle and effective", sentiment: 0.85 },
      { rating: 5, comment: "Love this cleanser!", sentiment: 0.92 }
    ],
    sentimentScore: 0.91,
    safetyRating: "safe",
    imageUrl: "https://via.placeholder.com/300",
    volume: "236ml"
  },
  {
    name: "Foaming Facial Cleanser",
    brand: "Cetaphil",
    barcode: "3700123456790",
    price: 12.99,
    rating: 4.3,
    description: "Oil-free foaming cleanser for oily skin",
    category: "cleanser",
    skinTypes: ["oily", "combination"],
    ingredients: [
      { name: "Sodium Lauryl Sulfate", riskLevel: "medium", warnings: ["May cause irritation"] },
      { name: "Glycerin", riskLevel: "low", warnings: [] },
      { name: "Niacinamide", riskLevel: "low", warnings: [] }
    ],
    reviews: [
      { rating: 4, comment: "Good for oily skin", sentiment: 0.75 },
      { rating: 3, comment: "A bit drying", sentiment: 0.45 },
      { rating: 5, comment: "Works great!", sentiment: 0.88 }
    ],
    sentimentScore: 0.69,
    safetyRating: "caution",
    imageUrl: "https://via.placeholder.com/300",
    volume: "236ml"
  },
  {
    name: "Daily Moisturizing Lotion",
    brand: "CeraVe",
    barcode: "3700123456791",
    price: 16.99,
    rating: 4.7,
    description: "Lightweight, oil-free moisturizer with ceramides and hyaluronic acid",
    category: "moisturizer",
    skinTypes: ["dry", "normal", "sensitive"],
    ingredients: [
      { name: "Ceramides", riskLevel: "low", warnings: [] },
      { name: "Hyaluronic Acid", riskLevel: "low", warnings: [] },
      { name: "Glycerin", riskLevel: "low", warnings: [] },
      { name: "Dimethicone", riskLevel: "low", warnings: [] }
    ],
    reviews: [
      { rating: 5, comment: "Best moisturizer ever!", sentiment: 0.95 },
      { rating: 5, comment: "Absorbs quickly, not greasy", sentiment: 0.92 },
      { rating: 4, comment: "Great for sensitive skin", sentiment: 0.85 }
    ],
    sentimentScore: 0.91,
    safetyRating: "safe",
    imageUrl: "https://via.placeholder.com/300",
    volume: "355ml"
  },
  {
    name: "Hyaluronic Acid Serum",
    brand: "The Ordinary",
    barcode: "3700123456792",
    price: 6.80,
    rating: 4.4,
    description: "Lightweight serum with 2% hyaluronic acid for hydration",
    category: "serum",
    skinTypes: ["dry", "normal", "combination"],
    ingredients: [
      { name: "Hyaluronic Acid", riskLevel: "low", warnings: [] },
      { name: "Glycerin", riskLevel: "low", warnings: [] },
      { name: "Phenoxyethanol", riskLevel: "low", warnings: [] }
    ],
    reviews: [
      { rating: 5, comment: "Amazing hydration!", sentiment: 0.92 },
      { rating: 4, comment: "Good value for money", sentiment: 0.78 },
      { rating: 3, comment: "A bit sticky", sentiment: 0.55 }
    ],
    sentimentScore: 0.75,
    safetyRating: "safe",
    imageUrl: "https://via.placeholder.com/300",
    volume: "30ml"
  },
  {
    name: "SPF 50 Mineral Sunscreen",
    brand: "La Roche-Posay",
    barcode: "3700123456793",
    price: 29.99,
    rating: 4.6,
    description: "Broad spectrum mineral sunscreen for sensitive skin",
    category: "sunscreen",
    skinTypes: ["sensitive", "normal"],
    ingredients: [
      { name: "Zinc Oxide", riskLevel: "low", warnings: [] },
      { name: "Titanium Dioxide", riskLevel: "low", warnings: [] },
      { name: "Glycerin", riskLevel: "low", warnings: [] }
    ],
    reviews: [
      { rating: 5, comment: "Perfect for sensitive skin!", sentiment: 0.94 },
      { rating: 4, comment: "No white cast", sentiment: 0.82 },
      { rating: 5, comment: "Great protection", sentiment: 0.91 }
    ],
    sentimentScore: 0.89,
    safetyRating: "safe",
    imageUrl: "https://via.placeholder.com/300",
    volume: "50ml"
  },
  {
    name: "Retinol Serum 0.5%",
    brand: "The Ordinary",
    barcode: "3700123456794",
    price: 9.80,
    rating: 4.2,
    description: "Anti-aging serum with retinol for fine lines and wrinkles",
    category: "serum",
    skinTypes: ["normal", "combination"],
    ingredients: [
      { name: "Retinol", riskLevel: "high", warnings: ["May cause irritation", "Use sunscreen", "Start slowly"] },
      { name: "Squalane", riskLevel: "low", warnings: [] },
      { name: "Dimethicone", riskLevel: "low", warnings: [] }
    ],
    reviews: [
      { rating: 4, comment: "Effective but strong", sentiment: 0.75 },
      { rating: 3, comment: "Caused some redness", sentiment: 0.45 },
      { rating: 5, comment: "Great results after a month", sentiment: 0.88 }
    ],
    sentimentScore: 0.69,
    safetyRating: "warning",
    imageUrl: "https://via.placeholder.com/300",
    volume: "30ml"
  },
  {
    name: "Clay Mask",
    brand: "Kiehl's",
    barcode: "3700123456795",
    price: 35.00,
    rating: 4.5,
    description: "Deep cleansing clay mask for oily and combination skin",
    category: "mask",
    skinTypes: ["oily", "combination"],
    ingredients: [
      { name: "Kaolin", riskLevel: "low", warnings: [] },
      { name: "Bentonite", riskLevel: "low", warnings: [] },
      { name: "Aloe Vera", riskLevel: "low", warnings: [] },
      { name: "Oatmeal", riskLevel: "low", warnings: [] }
    ],
    reviews: [
      { rating: 5, comment: "Deeply cleanses pores", sentiment: 0.92 },
      { rating: 4, comment: "A bit drying but effective", sentiment: 0.72 },
      { rating: 5, comment: "Love this mask!", sentiment: 0.89 }
    ],
    sentimentScore: 0.84,
    safetyRating: "safe",
    imageUrl: "https://via.placeholder.com/300",
    volume: "142g"
  },
  {
    name: "Rose Water Toner",
    brand: "Thayers",
    barcode: "3700123456796",
    price: 10.95,
    rating: 4.3,
    description: "Alcohol-free toner with rose water and witch hazel",
    category: "toner",
    skinTypes: ["normal", "dry", "sensitive"],
    ingredients: [
      { name: "Rose Water", riskLevel: "low", warnings: [] },
      { name: "Witch Hazel", riskLevel: "low", warnings: [] },
      { name: "Glycerin", riskLevel: "low", warnings: [] }
    ],
    reviews: [
      { rating: 4, comment: "Refreshing and gentle", sentiment: 0.82 },
      { rating: 5, comment: "Love the scent!", sentiment: 0.91 },
      { rating: 4, comment: "Good for sensitive skin", sentiment: 0.78 }
    ],
    sentimentScore: 0.84,
    safetyRating: "safe",
    imageUrl: "https://via.placeholder.com/300",
    volume: "355ml"
  }
];

const sampleUsers = [
  {
    name: "Test User",
    email: "test@example.com",
    password: "Test123456",
    skinType: "oily",
    skinGoals: "Reduce oiliness and prevent breakouts"
  }
];

async function seedDatabase() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${products.length} products`);

    // Clear and insert test user
    await User.deleteMany({ email: 'test@example.com' });
    await User.create(sampleUsers);
    console.log('Created test user (test@example.com / Test123456)');

    console.log('✅ Database seeded successfully!');
    console.log('\n📦 Sample Products:');
    products.forEach(p => {
      console.log(`  - ${p.brand} ${p.name} ($${p.price}) - Barcode: ${p.barcode}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
