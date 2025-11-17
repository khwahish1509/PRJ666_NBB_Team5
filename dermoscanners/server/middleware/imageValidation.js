/**
 * Image validation middleware
 * Validates uploaded image files for format and size
 */

/**
 * Validate image file format and size
 * Only allows JPEG, PNG, and WebP formats with max 5MB size
 */
export function validateImage(req, res, next) {
  // Check if file exists
  if (!req.file) {
    return res.status(400).json({ 
      error: 'No image file provided' 
    });
  }

  // Validate MIME type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ 
      error: 'Invalid file type. Only JPEG, PNG, and WebP are supported.' 
    });
  }

  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (req.file.size > maxSize) {
    return res.status(400).json({ 
      error: 'File size exceeds 5MB limit' 
    });
  }

  next();
}
