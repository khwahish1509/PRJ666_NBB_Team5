import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String },
    barcode: { type: String, index: true },
    price: { type: Number },
    rating: { type: Number, min: 0, max: 5 },
    description: { type: String },
    ingredients: [{ type: String }]
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Product = mongoose.model('Product', productSchema);
export default Product;

