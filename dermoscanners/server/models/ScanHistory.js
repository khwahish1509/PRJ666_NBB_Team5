import mongoose from 'mongoose';

const scanHistorySchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true 
    },
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    scannedAt: { 
      type: Date, 
      default: Date.now 
    },
    // Store snapshot of product data at scan time
    productSnapshot: {
      name: String,
      brand: String,
      barcode: String,
      price: Number,
      rating: Number,
      imageUrl: String
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Compound index for efficient queries
scanHistorySchema.index({ userId: 1, scannedAt: -1 });

const ScanHistory = mongoose.model('ScanHistory', scanHistorySchema);
export default ScanHistory;

