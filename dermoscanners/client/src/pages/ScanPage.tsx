/**
 * Scan Page - AI Skin Lesion Analysis
 * Sprint 3: AI-powered scan workflow with image upload
 */

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Loader2, History, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import api from '../services/api';
import ResultCard from '../components/scan/ResultCard';
import RecommendationPanel from '../components/scan/RecommendationPanel';
import { saveScan } from '../utils/scanStorage';
import { useAuth } from '../context/AuthContext';

interface ScanResult {
  result: 'benign' | 'suspicious' | 'malignant';
  confidence: number;
  processingTime: number;
  timestamp: string;
}

export default function ScanPage() {
  const [scanType, setScanType] = useState<'skin' | 'product'>('skin');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [barcode, setBarcode] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file format. Please upload JPEG, PNG, or WebP images only.');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    setSelectedFile(file);
    setError('');
    setScanResult(null);
    setSaveSuccess(false);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Handle image upload and AI analysis
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');
    setSaveSuccess(false);

    try {
      // Create FormData with image file
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Call POST /api/ai/analyze
      const response = await api.post<ScanResult>('/ai/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Display ResultCard on successful response
      setScanResult(response.data);

      // Smooth scroll to recommendations after result appears
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);

      // Implement dual storage save (subtask 6.3)
      await handleSaveScan(response.data);

    } catch (err: any) {
      console.error('Upload error:', err);
      
      // Handle upload errors with toast notifications
      if (err.response?.status === 400) {
        setError(err.response.data.error || 'Invalid file format. Please upload JPEG, PNG, or WebP.');
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please try again.');
      } else if (err.response?.status === 413) {
        setError('File too large. Please upload an image smaller than 5MB.');
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Clear selection and start over
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setScanResult(null);
    setError('');
    setSaveSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Save scan to localStorage and MongoDB (subtask 6.3)
  const handleSaveScan = async (result: ScanResult) => {
    try {
      // Generate unique ID for the scan
      const scanId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create scan object
      const scan = {
        id: scanId,
        userId: user?.id || 'guest',
        result: result.result,
        confidence: result.confidence,
        processingTime: result.processingTime,
        timestamp: result.timestamp,
        imageUrl: previewUrl, // Store the preview URL
      };

      // Save scan to localStorage immediately after API response
      const localSaveSuccess = await saveScan(scan, false); // Don't sync to cloud yet
      
      if (!localSaveSuccess) {
        throw new Error('Failed to save to localStorage');
      }

      // Make POST /api/scans call to save to MongoDB
      try {
        await api.post('/scans', {
          userId: scan.userId,
          result: scan.result,
          confidence: scan.confidence,
          processingTime: scan.processingTime,
          timestamp: scan.timestamp,
          imageUrl: scan.imageUrl,
        });
        
        // Show save confirmation toast
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (mongoError: any) {
        // Handle storage errors gracefully
        console.error('MongoDB save error:', mongoError);
        
        // Still show success since localStorage worked
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        
        // Log for debugging but don't show error to user
        console.log('Scan saved locally. Cloud sync will retry automatically.');
      }
    } catch (err) {
      console.error('Error saving scan:', err);
      // Don't show error to user - scan results are still visible
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 pb-20">
      <div className="max-w-2xl mx-auto pt-20">
        {/* Enhanced Header */}
        <div className="text-center mb-10 header-fade-in">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {scanType === 'skin' ? 'AI Skin Lesion Analysis' : 'Product Barcode Scanner'}
          </h1>
          <p className="text-gray-600 text-lg">
            {scanType === 'skin' 
              ? 'Upload an image for instant, AI-powered analysis' 
              : 'Scan or enter product barcode to get details'}
          </p>
        </div>

        {/* Scan Type Selector */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => {
              setScanType('skin');
              handleReset();
            }}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
              scanType === 'skin'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-300'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Skin Scan</span>
          </button>
          <button
            onClick={() => {
              setScanType('product');
              handleReset();
            }}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
              scanType === 'product'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-300'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span>Product Scan</span>
          </button>
        </div>

        {/* Enhanced Upload Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 upload-card-entrance border border-gray-100">
          {scanType === 'product' ? (
            /* Product Barcode Scanner */
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-block p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl mb-4">
                  <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Scan Product Barcode</h3>
                <p className="text-gray-600">Enter the barcode number to get product information</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Barcode Number
                </label>
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="e.g., 3337875597388"
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <button
                onClick={() => {
                  if (barcode.trim()) {
                    navigate(`/product/barcode/${barcode.trim()}`);
                  } else {
                    setError('Please enter a barcode number');
                  }
                }}
                disabled={!barcode.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl flex items-center justify-center gap-3 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-semibold text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search Product</span>
              </button>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">How to find the barcode:</p>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Look on the product packaging</li>
                      <li>• Usually found on the back or bottom</li>
                      <li>• It's a series of numbers (typically 12-13 digits)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : !selectedFile ? (
            <>
              {/* File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              
              {/* Enhanced Upload Button */}
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-72 border-3 border-dashed border-indigo-300 rounded-2xl cursor-pointer hover:border-indigo-500 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="text-indigo-600" size={48} strokeWidth={2} />
                  </div>
                  <p className="text-xl font-bold text-gray-800 mb-2">
                    Click to upload image
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    or drag and drop your file here
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="px-3 py-1 bg-gray-100 rounded-full">JPEG</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full">PNG</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full">WebP</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full">Max 5MB</span>
                  </div>
                </div>
              </label>
            </>
          ) : (
            <>
              {/* Enhanced Image Preview */}
              <div className="mb-6 relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img
                  src={previewUrl}
                  alt="Selected"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                  Ready to analyze
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl flex items-center justify-center gap-3 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-semibold text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      <span>Analyzing your scan...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={24} />
                      <span>Analyze Image</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 disabled:opacity-50 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          {/* Enhanced Error Message */}
          {error && (
            <div className="mt-6 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 text-red-800 px-5 py-4 rounded-xl flex items-start gap-3 animate-shake">
              <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold mb-1">Upload Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Enhanced Save Success Message */}
          {saveSuccess && (
            <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800 px-5 py-4 rounded-xl flex items-center gap-3 animate-slide-down">
              <CheckCircle className="flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold">Scan saved successfully!</p>
                <p className="text-sm">Your results have been securely stored.</p>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {scanResult && (
          <div ref={resultRef} className="space-y-6">
            {/* Result Card */}
            <ResultCard
              result={scanResult.result}
              confidence={scanResult.confidence}
              processingTime={scanResult.processingTime}
              timestamp={scanResult.timestamp}
            />

            {/* Recommendation Panel */}
            <RecommendationPanel result={scanResult.result} />

            {/* View History Button */}
            <div className="flex justify-center">
              <button
                onClick={() => navigate('/history')}
                className="bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-50 transition shadow-md"
              >
                <History size={20} />
                <span className="font-medium">View Scan History</span>
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Info Card */}
        <div className="mt-10 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-3 rounded-xl">
              <Sparkles className="text-indigo-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">How It Works</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">Upload Image</p>
                <p className="text-sm text-gray-600">Take or upload a clear photo of the skin lesion</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">AI Analysis</p>
                <p className="text-sm text-gray-600">Our AI analyzes the image in ~3 seconds</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center font-bold text-pink-600">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">Get Results</p>
                <p className="text-sm text-gray-600">Receive instant classification and confidence score</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center font-bold text-teal-600">
                4
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">Auto-Save</p>
                <p className="text-sm text-gray-600">Your scan history is automatically saved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes headerFadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes uploadCardEntrance {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header-fade-in {
          animation: headerFadeIn 600ms ease-out;
        }

        .upload-card-entrance {
          animation: uploadCardEntrance 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-shake {
          animation: shake 400ms ease-in-out;
        }

        .animate-slide-down {
          animation: slideDown 400ms ease-out;
        }

        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
}

