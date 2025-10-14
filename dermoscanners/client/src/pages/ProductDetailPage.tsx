/**
 * Product Detail Page
 * US-205: Display product information
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  description: string;
  category: string;
  skinTypes: string[];
  ingredients: Array<{ name: string; riskLevel: string; warnings: string[] }>;
  reviews: Array<{ rating: number; comment: string }>;
  sentimentScore: number;
  safetyRating: string;
  imageUrl: string;
  volume: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/products/${id}`);
      setProduct(response.data.data);
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const getSafetyColor = (rating: string) => {
    switch (rating) {
      case 'safe': return 'text-green-600 bg-green-50';
      case 'caution': return 'text-yellow-600 bg-yellow-50';
      case 'warning': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <XCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'This product does not exist'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">Product Details</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Product Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex gap-6">
            {/* Image */}
            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Image</span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
                  <p className="text-gray-600">{product.brand}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSafetyColor(product.safetyRating)}`}>
                  {product.safetyRating.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="fill-yellow-400 text-yellow-400" size={20} />
                  <span className="font-semibold">{product.rating}</span>
                </div>
                <span className="text-2xl font-bold text-indigo-600">${product.price}</span>
                {product.volume && <span className="text-gray-500">{product.volume}</span>}
              </div>

              <p className="text-gray-700 mb-4">{product.description}</p>

              <div className="flex flex-wrap gap-2">
                {product.skinTypes.map((type) => (
                  <span key={type} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
          <div className="space-y-2">
            {product.ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{ing.name}</span>
                <span className={`text-sm font-medium ${getRiskColor(ing.riskLevel)}`}>
                  {ing.riskLevel.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Reviews</h3>
          <div className="space-y-4">
            {product.reviews.map((review, idx) => (
              <div key={idx} className="border-b pb-4 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        size={16}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

