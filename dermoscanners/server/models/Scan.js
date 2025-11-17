import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    result: {
      type: String,
      enum: ['benign', 'suspicious', 'malignant'],
      required: true
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },
    processingTime: {
      type: Number,
      required: true
    },
    imageUrl: {
      type: String,
      required: false
    },
    notes: {
      type: String,
      maxlength: 500
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

// Compound index for efficient queries by user and timestamp
scanSchema.index({ userId: 1, timestamp: -1 });

const Scan = mongoose.model('Scan', scanSchema);
export default Scan;
