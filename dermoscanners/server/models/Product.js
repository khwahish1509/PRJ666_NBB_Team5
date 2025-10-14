import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, min: 0, max: 5, required: true },
  comment: { type: String },
  sentiment: { type: Number, min: 0, max: 1 } // 0 = negative, 1 = positive
});

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  warnings: [{ type: String }]
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    barcode: { type: String, unique: true, index: true },
    price: { type: Number, required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    description: { type: String },
    category: { type: String, enum: ['cleanser', 'moisturizer', 'serum', 'sunscreen', 'toner', 'mask', 'other'] },
    skinTypes: [{ type: String, enum: ['dry', 'oily', 'combination', 'sensitive', 'normal'] }],
    ingredients: [ingredientSchema],
    reviews: [reviewSchema],
    sentimentScore: { type: Number, min: 0, max: 1, default: 0.5 },
    safetyRating: { type: String, enum: ['safe', 'caution', 'warning'], default: 'safe' },
    imageUrl: { type: String },
    volume: { type: String } // e.g., "50ml", "100g"
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Index for search optimization
productSchema.index({ name: 'text', brand: 'text' });
productSchema.index({ category: 1, rating: -1 });

const Product = mongoose.model('Product', productSchema);
export default Product;

