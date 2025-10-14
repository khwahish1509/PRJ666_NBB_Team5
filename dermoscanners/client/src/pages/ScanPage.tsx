/**
 * Scan Page - Barcode Scanner UI
 * US-204: Barcode scanner and manual entry
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Search, Loader2 } from 'lucide-react';

export default function ScanPage() {
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleScan = async () => {
    if (!barcode.trim()) {
      setError('Please enter a barcode');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5001/api/products/barcode/${barcode}`);
      const data = await response.json();

      if (data.success) {
        // If _id exists, use it; else use barcode
        if (data.data._id) {
          navigate(`/product/${data.data._id}`);
        } else if (data.data.barcode) {
          navigate(`/product/${data.data.barcode}`);
        } else {
          setError('Product found but no valid ID/barcode');
        }
      } else {
        setError(data.message || 'Product not found');
      }
    } catch (err) {
      setError('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleCameraScan = () => {
    // Placeholder for camera integration
    alert('Camera scan - Coming soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto pt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Scan Product</h1>
          <p className="text-gray-600">Scan barcode or enter manually</p>
        </div>

        {/* Camera Button */}
        <button
          onClick={handleCameraScan}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl mb-6 flex items-center justify-center gap-3 hover:bg-indigo-700 transition"
        >
          <Camera size={24} />
          <span className="text-lg font-medium">Scan with Camera</span>
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-500">OR</span>
          </div>
        </div>

        {/* Manual Entry */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Barcode
            </label>
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="e.g., 3700123456789"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleScan()}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleScan}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search size={20} />
                <span>Search Product</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Examples */}
        <div className="mt-8 p-4 bg-white rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Try these barcodes:</p>
          <div className="flex flex-wrap gap-2">
            {['3700123456789', '3700123456790', '3700123456791'].map((code) => (
              <button
                key={code}
                onClick={() => setBarcode(code)}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition"
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

