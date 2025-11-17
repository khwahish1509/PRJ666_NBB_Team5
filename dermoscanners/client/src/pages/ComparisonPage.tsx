/**
 * Comparison Page - Product Comparison Table
 * US-206: Side-by-side product comparison
 */

import { useState } from 'react';
import { X, Star, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../services/api';

interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  skinTypes: string[];
  safetyRating: string;
  sentimentScore: number;
}

const SAFETY_COLORS: Record<string, string> = {
  safe: 'text-green-600',
  caution: 'text-yellow-600',
  warning: 'text-red-600',
};

const getBestValue = (products: Product[]) => {
  if (!products.length) return null;
  // Filter out products with price 0 to avoid division by zero
  const validProducts = products.filter(p => p.price > 0);
  if (!validProducts.length) return products[0]; // Return first if all have price 0
  return validProducts.reduce((best, curr) => 
    curr.rating / curr.price > best.rating / best.price ? curr : best
  );
};

export default function ComparisonPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addProduct = async (barcode: string) => {
    if (products.length >= 3) {
      setError('Maximum 3 products');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/products/barcode/${barcode}`);
      if (data.success) {
        setProducts(prev => [...prev, data.data]);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const bestValue = getBestValue(products);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-teal-50/30 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center header-fade-in">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Compare Products
          </h1>
          <p className="text-gray-600 text-lg">Side-by-side comparison to find the best product for you</p>
        </div>

        {/* Add Product Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add Products to Compare</h2>
          
          {/* Add Product */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter barcode (e.g., 3700123456789)"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all font-medium"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addProduct(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (input?.value) {
                  addProduct(input.value);
                  input.value = '';
                }
              }}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 text-red-800 px-5 py-3 rounded-xl shadow-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold mb-1">{error}</p>
                  <p className="text-sm text-red-700">Try these valid barcodes: 3700123456789, 3700123456790, 3700123456791</p>
                </div>
              </div>
            </div>
          )}

          {products.length === 1 && (
            <div className="mt-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 text-yellow-800 px-5 py-3 rounded-xl flex items-center gap-3 shadow-lg">
              <AlertTriangle className="flex-shrink-0" size={20} />
              <p className="font-semibold">Add at least one more product to start comparing</p>
            </div>
          )}

          {products.length === 0 && (
            <div className="mt-6 text-center">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Add products to compare (max 3)</p>
            </div>
          )}

          {products.length > 0 && (
            <div className="mt-4 flex justify-between items-center bg-gradient-to-r from-green-50 to-teal-50 px-4 py-3 rounded-xl">
              <span className="text-sm font-semibold text-gray-700">{products.length} product(s) added</span>
              <button
                onClick={() => { setProducts([]); setError(''); }}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 transition-all font-semibold shadow-md hover:shadow-lg"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {products.length >= 2 && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-green-50 to-teal-50">
                  <tr>
                    <th className="px-6 py-5 text-left text-sm font-bold text-gray-800 uppercase tracking-wide">Feature</th>
                    {products.map((product) => (
                      <th key={product._id} className="px-6 py-5 text-left text-sm font-bold text-gray-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-base text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-600 font-medium mt-1">{product.brand}</div>
                          </div>
                          <button
                            onClick={() => setProducts(prev => prev.filter(p => p._id !== product._id))}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
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
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 text-sm font-bold text-gray-800 uppercase tracking-wide">Price</td>
                    {products.map((product) => (
                      <td key={product._id} className="px-6 py-5 text-sm">
                        {product.price > 0 ? (
                          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">${product.price}</span>
                        ) : (
                          <span className="text-gray-500 text-sm">Not available</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr className="bg-gradient-to-r from-yellow-50/50 to-amber-50/50 hover:from-yellow-50 hover:to-amber-50 transition-colors">
                    <td className="px-6 py-5 text-sm font-bold text-gray-800 uppercase tracking-wide">Rating</td>
                    {products.map((product) => (
                      <td key={product._id} className="px-6 py-5 text-sm">
                        <div className="flex items-center gap-2 bg-yellow-100 px-3 py-2 rounded-lg inline-flex">
                          <Star className="fill-yellow-400 text-yellow-400" size={20} />
                          <span className="font-bold text-gray-900">{product.rating}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Safety */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 text-sm font-bold text-gray-800 uppercase tracking-wide">Safety</td>
                    {products.map((product) => (
                      <td key={product._id} className="px-6 py-5 text-sm">
                        <span className={`font-bold text-base ${SAFETY_COLORS[product.safetyRating] || 'text-gray-600'} uppercase`}>
                          {product.safetyRating || 'Unknown'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Sentiment */}
                  <tr className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 hover:from-indigo-50 hover:to-purple-50 transition-colors">
                    <td className="px-6 py-5 text-sm font-bold text-gray-800 uppercase tracking-wide">Sentiment</td>
                    {products.map((product) => (
                      <td key={product._id} className="px-6 py-5 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${(product.sentimentScore || 0) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-800 min-w-[3rem]">
                            {((product.sentimentScore || 0) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Skin Types */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 text-sm font-bold text-gray-800 uppercase tracking-wide">Skin Types</td>
                    {products.map((product) => (
                      <td key={product._id} className="px-6 py-5 text-sm">
                        <div className="flex flex-wrap gap-2">
                          {product.skinTypes && product.skinTypes.length > 0 ? (
                            product.skinTypes.map((type) => (
                              <span key={type} className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-lg text-xs font-bold uppercase">
                                {type}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">Not specified</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Best Value */}
                  <tr className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <td className="px-6 py-5 text-sm font-bold text-gray-800 uppercase tracking-wide">Best Value</td>
                    {products.map((product, index) => (
                      <td key={`best-value-${product._id}-${index}`} className="px-6 py-5 text-sm">
                        {product._id === bestValue?._id ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="text-green-600" size={28} />
                            <span className="text-green-700 font-bold text-sm">Winner!</span>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-2xl">-</span>
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

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header-fade-in {
          animation: fadeIn 600ms ease-out;
        }
      `}</style>
    </div>
  );
}

