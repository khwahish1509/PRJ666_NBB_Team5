import ScanHistory from '../models/ScanHistory.js';
import Product from '../models/Product.js';

/**
 * Add a product to scan history
 * POST /api/history
 */
export async function addToHistory(req, res) {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if already in history (to avoid duplicates)
    const existing = await ScanHistory.findOne({ userId, productId });
    if (existing) {
      // Update timestamp if already exists
      existing.scannedAt = new Date();
      await existing.save();
      return res.json({
        success: true,
        message: 'Scan history updated',
        data: existing
      });
    }

    // Create history entry
    const historyEntry = await ScanHistory.create({
      userId,
      productId,
      productSnapshot: {
        name: product.name,
        brand: product.brand,
        barcode: product.barcode,
        price: product.price,
        rating: product.rating,
        imageUrl: product.imageUrl
      }
    });

    res.status(201).json({
      success: true,
      message: 'Product added to scan history',
      data: historyEntry
    });
  } catch (error) {
    console.error('Error adding to scan history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to history'
    });
  }
}

/**
 * Get user's scan history
 * GET /api/history
 */
export async function getHistory(req, res) {
  try {
    const userId = req.user.id;
    const { limit = 50 } = req.query;

    const history = await ScanHistory.find({ userId })
      .populate('productId')
      .sort({ scannedAt: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    console.error('Error fetching scan history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching history'
    });
  }
}

/**
 * Delete a specific history entry
 * DELETE /api/history/:id
 */
export async function deleteHistoryEntry(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const historyEntry = await ScanHistory.findOne({ _id: id, userId });

    if (!historyEntry) {
      return res.status(404).json({
        success: false,
        message: 'History entry not found'
      });
    }

    await ScanHistory.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'History entry deleted'
    });
  } catch (error) {
    console.error('Error deleting history entry:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting history'
    });
  }
}

/**
 * Clear all scan history
 * DELETE /api/history
 */
export async function clearHistory(req, res) {
  try {
    const userId = req.user.id;

    const result = await ScanHistory.deleteMany({ userId });

    res.json({
      success: true,
      message: 'All scan history cleared',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing history'
    });
  }
}

