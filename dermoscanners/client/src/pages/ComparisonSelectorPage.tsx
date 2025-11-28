import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import api from '../services/api';
import BeforeAfterSlider from '../components/progress/BeforeAfterSlider';

interface Scan {
  _id: string;
  result: 'benign' | 'suspicious' | 'malignant';
  confidence: number;
  timestamp: string;
  imageUrl?: string;
}

export default function ComparisonSelectorPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [selectedBefore, setSelectedBefore] = useState<string | null>(null);
  const [selectedAfter, setSelectedAfter] = useState<string | null>(null);
  const [comparison, setComparison] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const { data } = await api.get('/scans');
      setScans(data.data || []);
    } catch (error) {
      console.error('Error fetching scans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (!selectedBefore || !selectedAfter) return;

    try {
      const { data } = await api.get(`/progress/comparison?scanId1=${selectedBefore}&scanId2=${selectedAfter}`);
      setComparison(data.data);
    } catch (error) {
      console.error('Error fetching comparison:', error);
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'benign':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'suspicious':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'malignant':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (scans.length < 2) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ArrowRight className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Not Enough Scans</h2>
          <p className="text-gray-600 mb-6">
            You need at least 2 scans to compare. Start scanning to track your progress!
          </p>
          <button
            onClick={() => navigate('/scan')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Start Scanning
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Before & After Comparison
        </h1>
        <p className="text-lg text-gray-600">Select two scans to compare your progress</p>
      </div>

      {!comparison ? (
        <>
          {/* Selection Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Before Selection */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Select "Before" Scan</h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {scans.map((scan) => (
                  <div
                    key={scan._id}
                    onClick={() => setSelectedBefore(scan._id)}
                    className={`bg-white rounded-xl p-4 border-2 cursor-pointer transition-all ${
                      selectedBefore === scan._id
                        ? 'border-indigo-500 shadow-lg'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {scan.imageUrl && (
                        <img
                          src={scan.imageUrl}
                          alt="Scan"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getResultIcon(scan.result)}
                          <span className="font-semibold capitalize">{scan.result}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(scan.timestamp).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Confidence: {(scan.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                      {selectedBefore === scan._id && (
                        <CheckCircle className="w-6 h-6 text-indigo-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* After Selection */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Select "After" Scan</h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {scans.map((scan) => (
                  <div
                    key={scan._id}
                    onClick={() => setSelectedAfter(scan._id)}
                    className={`bg-white rounded-xl p-4 border-2 cursor-pointer transition-all ${
                      selectedAfter === scan._id
                        ? 'border-purple-500 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300'
                    } ${selectedBefore === scan._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      {scan.imageUrl && (
                        <img
                          src={scan.imageUrl}
                          alt="Scan"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getResultIcon(scan.result)}
                          <span className="font-semibold capitalize">{scan.result}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(scan.timestamp).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Confidence: {(scan.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                      {selectedAfter === scan._id && (
                        <CheckCircle className="w-6 h-6 text-purple-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compare Button */}
          <div className="flex justify-center">
            <button
              onClick={handleCompare}
              disabled={!selectedBefore || !selectedAfter || selectedBefore === selectedAfter}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              <span>Compare Scans</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Comparison Result */}
          <BeforeAfterSlider
            beforeImage={comparison.before.imageUrl || '/placeholder-scan.jpg'}
            afterImage={comparison.after.imageUrl || '/placeholder-scan.jpg'}
            beforeResult={comparison.before.result}
            afterResult={comparison.after.result}
            beforeDate={comparison.before.timestamp}
            afterDate={comparison.after.timestamp}
            riskChange={comparison.comparison.riskChange}
            daysBetween={comparison.comparison.daysBetween}
          />

          {/* Reset Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                setComparison(null);
                setSelectedBefore(null);
                setSelectedAfter(null);
              }}
              className="bg-white border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all"
            >
              Compare Different Scans
            </button>
          </div>
        </>
      )}
    </div>
  );
}
