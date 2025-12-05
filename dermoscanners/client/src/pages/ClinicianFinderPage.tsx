import { useState, useEffect } from 'react';
import { MapPin, Phone, Globe, Navigation, Search, Filter, X, Star, Clock } from 'lucide-react';
import { api } from '../services/api';

interface Clinician {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  website: string | null;
  openingHours: string | null;
  latitude: number;
  longitude: number;
  distance: number;
  type: string;
  rating?: number;
  reviewCount?: number;
}

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  postalCode: string;
}

export default function ClinicianFinderPage() {
  const [clinicians, setClinicians] = useState<Clinician[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    postalCode: ''
  });
  const [selectedClinician, setSelectedClinician] = useState<Clinician | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    radius: 10,
    openNow: false,
    topRated: false
  });
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [usePostalCode, setUsePostalCode] = useState(false);

  // Request location permission on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.permissions?.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state as 'prompt' | 'granted' | 'denied');
      });
    }
  }, []);

  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser');
      setUsePostalCode(true);
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          postalCode: ''
        });
        setLocationPermission('granted');
        setUsePostalCode(false);
        searchClinicians(position.coords.latitude, position.coords.longitude, null);
      },
      (err) => {
        setLocationPermission('denied');
        setError('Location access denied. Please enter your postal code.');
        setUsePostalCode(true);
        setLoading(false);
      }
    );
  };

  const searchClinicians = async (lat: number | null, lon: number | null, postal: string | null) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post(
        '/clinicians/find',
        {
          latitude: lat,
          longitude: lon,
          postalCode: postal,
          radius: filters.radius,
          filters: {
            openNow: filters.openNow,
            topRated: filters.topRated
          }
        }
      );

      setClinicians(response.data.clinicians);
      if (response.data.location) {
        setLocation({
          latitude: response.data.location.latitude,
          longitude: response.data.location.longitude,
          postalCode: postal || ''
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to find clinicians. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostalCodeSearch = () => {
    if (!location.postalCode.trim()) {
      setError('Please enter a postal code');
      return;
    }
    searchClinicians(null, null, location.postalCode);
  };

  const openInMaps = (clinician: Clinician) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${clinician.latitude},${clinician.longitude}`;
    window.open(url, '_blank');
  };

  const callClinic = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const visitWebsite = (website: string) => {
    window.open(website, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Find Dermatologists Near You
          </h1>
          <p className="text-lg text-gray-600">
            Locate qualified dermatologists in your area for professional consultation
          </p>
        </div>

        {/* Location Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {!usePostalCode ? (
              <div className="flex-1">
                <button
                  onClick={requestLocation}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Navigation className="w-5 h-5" />
                  {loading ? 'Searching...' : 'Use My Location'}
                </button>
                <button
                  onClick={() => setUsePostalCode(true)}
                  className="w-full mt-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  Or enter postal code manually
                </button>
              </div>
            ) : (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={location.postalCode}
                  onChange={(e) => setLocation({ ...location, postalCode: e.target.value })}
                  placeholder="Enter postal code (e.g., M5H 2N2)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handlePostalCodeSearch()}
                />
                <button
                  onClick={handlePostalCodeSearch}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                >
                  <Search className="w-5 h-5" />
                  Search
                </button>
                <button
                  onClick={() => setUsePostalCode(false)}
                  className="text-gray-600 hover:text-gray-800 px-3"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Radius
                  </label>
                  <select
                    value={filters.radius}
                    onChange={(e) => setFilters({ ...filters, radius: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5 km</option>
                    <option value={10}>10 km</option>
                    <option value={25}>25 km</option>
                    <option value={50}>50 km</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="openNow"
                    checked={filters.openNow}
                    onChange={(e) => setFilters({ ...filters, openNow: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="openNow" className="ml-2 text-sm text-gray-700">
                    Open Now
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="topRated"
                    checked={filters.topRated}
                    onChange={(e) => setFilters({ ...filters, topRated: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="topRated" className="ml-2 text-sm text-gray-700">
                    Top Rated
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Searching for dermatologists...</p>
          </div>
        ) : clinicians.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {clinicians.map((clinician) => (
              <div
                key={clinician.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 cursor-pointer"
                onClick={() => setSelectedClinician(clinician)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {clinician.name}
                    </h3>
                    {clinician.rating && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="ml-1 font-semibold">{clinician.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-gray-500">({clinician.reviewCount} reviews)</span>
                      </div>
                    )}
                  </div>
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {clinician.distance} km
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-gray-600">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>{clinician.address}</span>
                  </div>

                  {clinician.phone && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="w-5 h-5 flex-shrink-0" />
                      <span>{clinician.phone}</span>
                    </div>
                  )}

                  {clinician.openingHours && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-5 h-5 flex-shrink-0" />
                      <span>{clinician.openingHours}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                  {clinician.phone && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        callClinic(clinician.phone!);
                      }}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                  )}
                  {clinician.website && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        visitWebsite(clinician.website!);
                      }}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openInMaps(clinician);
                    }}
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Results Yet
              </h3>
              <p className="text-gray-600">
                Click "Use My Location" or enter your postal code to find dermatologists near you
              </p>
            </div>
          )
        )}

        {/* Selected Clinician Modal */}
        {selectedClinician && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={() => setSelectedClinician(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedClinician.name}
                </h2>
                <button
                  onClick={() => setSelectedClinician(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedClinician.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="ml-1 font-semibold text-lg">{selectedClinician.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-500">({selectedClinician.reviewCount} reviews)</span>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-600">{selectedClinician.address}</p>
                    <p className="text-sm text-blue-600 mt-1">{selectedClinician.distance} km away</p>
                  </div>
                </div>

                {selectedClinician.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Phone</p>
                      <p className="text-gray-600">{selectedClinician.phone}</p>
                    </div>
                  </div>
                )}

                {selectedClinician.openingHours && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Hours</p>
                      <p className="text-gray-600">{selectedClinician.openingHours}</p>
                    </div>
                  </div>
                )}

                {selectedClinician.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Website</p>
                      <a
                        href={selectedClinician.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        {selectedClinician.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {selectedClinician.phone && (
                  <button
                    onClick={() => callClinic(selectedClinician.phone!)}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </button>
                )}
                <button
                  onClick={() => openInMaps(selectedClinician)}
                  className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 200ms ease-out;
        }

        .animate-slide-up {
          animation: slide-up 300ms ease-out;
        }
      `}</style>
    </div>
  );
}
