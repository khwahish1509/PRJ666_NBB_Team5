/**
 * Comparison Page - Product Comparison Table
 * US-206: Side-by-side product comparison
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Star, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  category: string;
  skinTypes: string[];
  safetyRating: string;
  sentimentScore: number;
}

export default function ComparisonPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const addProduct = async (barcode: string) => {
    if (products.length >= 3) {
      setError('Maximum 3 products can be compared');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`http://localhost:5001/api/products/barcode/${barcode}`);
      if (response.data.success) {
        setProducts([...products, response.data.data]);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p._id !== id));
    if (products.length === 1) {
      setError('');
    }
  };

  const clearComparison = () => {
    setProducts([]);
    setError('');
  };

  const getSafetyColor = (rating: string) => {
    switch (rating) {
      case 'safe': return 'text-green-600';
      case 'caution': return 'text-yellow-600';
      case 'warning': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getBestValue = () => {
    if (products.length === 0) return null;
    return products.reduce((best, current) => 
      current.rating / current.price > best.rating / best.price ? current : best
    );
  };

  const bestValue = getBestValue();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Compare Products</h1>
          
          {/* Add Product */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter barcode (e.g., 3700123456789)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addProduct(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input') as HTMLInputElement;
                if (input) {
                  addProduct(input.value);
                  input.value = '';
                }
              }}
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              Add
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          {products.length === 1 && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg">
              Add at least one more product to start comparing
            </div>
          )}

          {products.length === 0 && (
            <div className="mt-4 text-center text-gray-500">
              Add products to compare (max 3)
            </div>
          )}

          {products.length > 0 && (
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">{products.length} product(s) added</span>
              <button
                onClick={clearComparison}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {products.length >= 2 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Feature</th>
                    {products.map((product) => (
                      <th key={product._id} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.brand}</div>
                          </div>
                          <button
                            onClick={() => removeProduct(product._id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Price */}
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Price</td>
                    {products.map((product) => (
                      <td key={product._id} className="px-6 py-4 text-sm">
                        <span className="text-lg font-bold text-indigo-600">${product.price}</span>
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Rating</td>
                    {products.map((product) => (
                      <td key={product._id} className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Star className="fill-yellow-400 text-yellow-400" size={20} />
                          <span className="font-semibold">{product.rating}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Safety */}
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Safety</td>
                    {products.map((product) => (
                      <td key={product._id} className="px-6 py-4 text-sm">
                        <span className={`font-medium ${getSafetyColor(product.safetyRating)}`}>
                          {product.safetyRating.toUpperCase()}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Sentiment */}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Sentiment</td>
                    {products.map((product) => (
                      <td key={product._id} className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${product.sentimentScore * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">
                            {(product.sentimentScore * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Skin Types */}
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Skin Types</td>
                    {products.map((product) => (
                      <td key={product._id} className="px-6 py-4 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {product.skinTypes.map((type) => (
                            <span key={type} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs">
                              {type}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Best Value */}
                  <tr className="bg-green-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Best Value</td>
                    {products.map((product) => (
                      <td key={product._id} className="px-6 py-4 text-sm">
                        {product._id === bestValue?._id ? (
                          <CheckCircle className="text-green-600" size={24} />
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

