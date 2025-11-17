/**
 * Recommendations Page
 * US-212-214: Recommendation filters, display, and sorting
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Filter, ArrowUpDown } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  category: string;
  skinTypes: string[];
  safetyRating: string;
  imageUrl: string;
  score?: number;
}

const SAFETY_COLORS = {
  safe: 'bg-green-100 text-green-800',
  caution: 'bg-yellow-100 text-yellow-800',
  warning: 'bg-red-100 text-red-800',
};

const sortProducts = (products: Product[], sortBy: string) => {
  const sorted = [...products];
  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'safety':
      const order = { safe: 0, caution: 1, warning: 2 };
      return sorted.sort((a, b) => (order[a.safetyRating] || 3) - (order[b.safetyRating] || 3));
    default:
      return sorted;
  }
};

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ skinType: '', maxPrice: '', category: '' });
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    fetchRecommendations();
  }, [filters, sortBy]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const { data } = await api.get(`/recommendations?${params}`);
      setProducts(sortProducts(data.data, sortBy));
    } catch (err) {
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ skinType: '', maxPrice: '', category: '' });
    setSortBy('relevance');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center header-fade-in">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-4 rounded-2xl shadow-lg">
              <Star className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-3">
            Product Recommendations
          </h1>
          <p className="text-gray-600 text-lg">Personalized products curated for your skin type</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-2.5 rounded-xl">
                  <Filter size={20} className="text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Skin Type</label>
                  <select
                    value={filters.skinType}
                    onChange={(e) => updateFilter('skinType', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option value="">All Types</option>
                    {['dry', 'oily', 'combination', 'sensitive', 'normal'].map(type => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Max Price ($)</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    placeholder="e.g., 50"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option value="">All Categories</option>
                    {['cleanser', 'moisturizer', 'serum', 'sunscreen', 'toner', 'mask'].map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:text-gray-900 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort & Results */}
            <div className="bg-white rounded-2xl shadow-xl p-5 mb-6 border border-gray-100">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-2 rounded-lg">
                    <ArrowUpDown size={20} className="text-indigo-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {products.length} products found
                  </span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium transition-all"
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Lowest Price</option>
                  <option value="price-high">Highest Price</option>
                  <option value="safety">Safest First</option>
                </select>
              </div>
            </div>

            {loading && <LoadingSpinner size={64} message="Loading recommendations..." />}
            {error && <ErrorMessage message={error} onRetry={fetchRecommendations} />}

            {/* No Results */}
            {!loading && !error && products.length === 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-gray-100">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Star size={40} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No Products Found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  No products match your current criteria. Try adjusting your filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="product-card-entrance bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-pink-200 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Image */}
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden group-hover:shadow-inner transition-all">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="flex flex-col items-center justify-center p-4">
                                  <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span class="text-xs text-gray-500 text-center">${product.name}</span>
                                </div>
                              `;
                            }
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4">
                          <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs text-gray-500 text-center">{product.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1.5 text-lg group-hover:text-pink-600 transition-colors">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 font-medium">{product.brand}</p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">${product.price}</span>
                        <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1.5 rounded-lg">
                          <Star className="fill-yellow-400 text-yellow-400" size={18} />
                          <span className="text-sm font-bold text-gray-800">{product.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${SAFETY_COLORS[product.safetyRating] || 'bg-gray-100 text-gray-800'}`}>
                          {product.safetyRating}
                        </span>
                        {product.score && (
                          <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">
                            Score: {product.score.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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

        @keyframes cardSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .header-fade-in {
          animation: fadeIn 600ms ease-out;
        }

        .product-card-entrance {
          animation: cardSlideIn 400ms ease-out backwards;
        }
      `}</style>
    </div>
  );
}

