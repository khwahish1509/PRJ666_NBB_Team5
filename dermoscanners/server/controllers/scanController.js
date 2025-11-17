import Scan from '../models/Scan.js';

/**
 * Create a new scan record
 * POST /api/scans
 */
export async function createScan(req, res) {
  try {
    const { result, confidence, processingTime, imageUrl, notes, timestamp } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!result || confidence === undefined || !processingTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: result, confidence, and processingTime are required'
      });
    }

    // Create scan record
    const scan = await Scan.create({
      userId,
      result,
      confidence,
      processingTime,
      imageUrl,
      notes,
      timestamp: timestamp || new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Scan record created successfully',
      data: scan
    });
  } catch (error) {
    console.error('Error creating scan:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    // Handle network/database errors
    if (error.name === 'MongoNetworkError') {
      return res.status(503).json({
        success: false,
        message: 'Database temporarily unavailable. Please try again.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating scan record'
    });
  }
}

/**
 * Get user's scan records
 * GET /api/scans?userId=xxx
 */
export async function getScans(req, res) {
  try {
    const userId = req.query.userId || req.user.id;
    const { limit = 100 } = req.query;

    // Ensure user can only access their own scans
    if (userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const scans = await Scan.find({ userId })
      .sort({ timestamp: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      count: scans.length,
      data: scans
    });
  } catch (error) {
    console.error('Error fetching scans:', error);
    
    if (error.name === 'MongoNetworkError') {
      return res.status(503).json({
        success: false,
        message: 'Database temporarily unavailable. Please try again.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching scan records'
    });
  }
}

/**
 * Update scan notes
 * PATCH /api/scans/:id
 */
export async function updateScanNotes(req, res) {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const userId = req.user.id;

    // Validate notes length
    if (notes && notes.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Notes cannot exceed 500 characters'
      });
    }

    // Find scan and verify ownership
    const scan = await Scan.findOne({ _id: id, userId });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan record not found'
      });
    }

    // Update notes
    scan.notes = notes;
    await scan.save();

    res.json({
      success: true,
      message: 'Scan notes updated successfully',
      data: scan
    });
  } catch (error) {
    console.error('Error updating scan notes:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.name === 'MongoNetworkError') {
      return res.status(503).json({
        success: false,
        message: 'Database temporarily unavailable. Please try again.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating scan notes'
    });
  }
}

/**
 * Delete a scan record
 * DELETE /api/scans/:id
 */
export async function deleteScan(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find scan and verify ownership
    const scan = await Scan.findOne({ _id: id, userId });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan record not found'
      });
    }

    await Scan.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Scan record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting scan:', error);
    
    if (error.name === 'MongoNetworkError') {
      return res.status(503).json({
        success: false,
        message: 'Database temporarily unavailable. Please try again.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting scan record'
    });
  }
}
