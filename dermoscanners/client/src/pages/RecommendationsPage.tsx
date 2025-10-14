/**
 * Recommendations Page
 * US-212-214: Recommendation filters, display, and sorting
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Filter, ArrowUpDown } from 'lucide-react';
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
  imageUrl: string;
  score?: number;
}

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [skinType, setSkinType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('');
  
  // Sorting
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    fetchRecommendations();
  }, [skinType, maxPrice, category, sortBy]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (skinType) params.append('skinType', skinType);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (category) params.append('category', category);

      const response = await axios.get(
        `http://localhost:5001/api/recommendations?${params.toString()}`
      );

      let sortedProducts = response.data.data;

      // Apply sorting
      switch (sortBy) {
        case 'rating':
          sortedProducts.sort((a: Product, b: Product) => b.rating - a.rating);
          break;
        case 'price-low':
          sortedProducts.sort((a: Product, b: Product) => a.price - b.price);
          break;
        case 'price-high':
          sortedProducts.sort((a: Product, b: Product) => b.price - a.price);
          break;
        case 'safety':
          sortedProducts.sort((a: Product, b: Product) => {
            const safetyOrder = { safe: 0, caution: 1, warning: 2 };
            return safetyOrder[a.safetyRating] - safetyOrder[b.safetyRating];
          });
          break;
        default:
          // Relevance (by score)
          break;
      }

      setProducts(sortedProducts);
    } catch (err) {
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSkinType('');
    setMaxPrice('');
    setCategory('');
    setSortBy('relevance');
  };

  const getSafetyColor = (rating: string) => {
    switch (rating) {
      case 'safe': return 'bg-green-100 text-green-800';
      case 'caution': return 'bg-yellow-100 text-yellow-800';
      case 'warning': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Product Recommendations</h1>
          <p className="text-gray-600">Personalized products for your skin type</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter size={20} />
                <h2 className="text-lg font-semibold">Filters</h2>
              </div>

              {/* Skin Type Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skin Type
                </label>
                <select
                  value={skinType}
                  onChange={(e) => setSkinType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Types</option>
                  <option value="dry">Dry</option>
                  <option value="oily">Oily</option>
                  <option value="combination">Combination</option>
                  <option value="sensitive">Sensitive</option>
                  <option value="normal">Normal</option>
                </select>
              </div>

              {/* Price Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price ($)
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="e.g., 50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Categories</option>
                  <option value="cleanser">Cleanser</option>
                  <option value="moisturizer">Moisturizer</option>
                  <option value="serum">Serum</option>
                  <option value="sunscreen">Sunscreen</option>
                  <option value="toner">Toner</option>
                  <option value="mask">Mask</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort & Results */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={20} className="text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {products.length} products found
                  </span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Lowest Price</option>
                  <option value="price-high">Highest Price</option>
                  <option value="safety">Safest First</option>
                </select>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading recommendations...</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* No Results */}
            {!loading && !error && products.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <p className="text-gray-600 mb-4">No products found matching your criteria</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition cursor-pointer"
                  >
                    {/* Image */}
                    <div className="w-full h-40 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Image</span>
                    </div>

                    {/* Info */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{product.brand}</p>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-indigo-600">${product.price}</span>
                        <div className="flex items-center gap-1">
                          <Star className="fill-yellow-400 text-yellow-400" size={16} />
                          <span className="text-sm font-medium">{product.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSafetyColor(product.safetyRating)}`}>
                          {product.safetyRating}
                        </span>
                        {product.score && (
                          <span className="text-xs text-gray-500">
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
    </div>
  );
}

