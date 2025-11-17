import { useNavigate } from 'react-router-dom';
import { Camera, Shield, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function WelcomePage() {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Hero image path - place your image in public folder as shutterstock_2165450175.jpg.webp
  const heroImagePath = '/shutterstock_2165450175.jpg.webp';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section with Image */}
      <div className="relative overflow-hidden min-h-screen">

        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          {!imageError ? (
            <>
              <img
                src={heroImagePath}
                alt="DermoScanners Hero"
                className={`w-full h-full object-cover transition-opacity duration-700 blur-sm ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
              {/* Light Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-purple-900/45 to-pink-900/40"></div>
            </>
          ) : (
            // Fallback gradient if image doesn't load
            <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
          )}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24 min-h-screen flex items-center">
          <div className="grid md:grid-cols-2 gap-12 items-center w-full">
            {/* Left Column - Text Content */}
            <div className="text-center md:text-left animate-fade-in">
              {/* Logo Badge */}
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-white/90 text-sm font-semibold">AI-Powered Skin Health</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                Welcome to<br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                  DermoScanners
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-xl">
                Your intelligent companion for <span className="text-cyan-400 font-semibold">skin health analysis</span> and <span className="text-purple-400 font-semibold">personalized skincare</span> recommendations
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-10">
                <button
                  onClick={() => navigate('/register')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-2xl hover:shadow-cyan-500/50 hover:scale-105 flex items-center justify-center gap-2 overflow-hidden"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={24} />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-white/5 backdrop-blur-md text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all shadow-xl border-2 border-white/20 hover:border-white/40"
                >
                  Sign In
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium text-sm">Secure & Private</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <div className="w-5 h-5 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium text-sm">AI-Powered</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium text-sm">Free to Use</span>
                </div>
              </div>
            </div>

            {/* Right Column - Feature Highlight Card */}
            <div className="hidden md:block animate-slide-in">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
                
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
                  <div className="space-y-6">
                    <div className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer">
                      <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                        <Camera className="text-white" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-1">AI Skin Analysis</h3>
                        <p className="text-gray-400 text-sm">Instant analysis with confidence scores</p>
                      </div>
                    </div>
                    <div className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer">
                      <div className="bg-gradient-to-br from-pink-400 to-rose-500 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                        <Sparkles className="text-white" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-1">Smart Recommendations</h3>
                        <p className="text-gray-400 text-sm">Personalized product suggestions</p>
                      </div>
                    </div>
                    <div className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer">
                      <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                        <Shield className="text-white" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-1">Safety First</h3>
                        <p className="text-gray-400 text-sm">Comprehensive ingredient analysis</p>
                      </div>
                    </div>
                    <div className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer">
                      <div className="bg-gradient-to-br from-purple-400 to-violet-500 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                        <TrendingUp className="text-white" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-1">Track Progress</h3>
                        <p className="text-gray-400 text-sm">Monitor your skincare journey</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Everything You Need for Healthy Skin
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools and insights to help you make informed decisions about your skin health
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all group">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Camera className="text-indigo-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">AI Scanning</h3>
            <p className="text-gray-600 text-sm">
              Instant AI analysis with confidence scores
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all group">
            <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="text-pink-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Recommendations</h3>
            <p className="text-gray-600 text-sm">
              Personalized product suggestions
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all group">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="text-green-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Safety First</h3>
            <p className="text-gray-600 text-sm">
              Comprehensive ingredient analysis
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all group">
            <div className="bg-gradient-to-br from-purple-100 to-violet-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="text-purple-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Track Progress</h3>
            <p className="text-gray-600 text-sm">
              Monitor your skincare journey
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-fade-in {
          animation: fadeIn 800ms ease-out;
        }

        .animate-slide-in {
          animation: slideIn 1000ms ease-out 300ms both;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
