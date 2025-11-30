import React from 'react';
import { MessageCircle, Sparkles, Zap, CheckCircle, Smartphone, Monitor, Tablet } from 'lucide-react';

export default function ChatDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
            <Sparkles size={16} />
            <span className="text-sm font-medium">New Feature</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI-Powered Skincare Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get instant answers to your skincare questions with our intelligent chatbot
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Clean Interface</h3>
            <p className="text-gray-600">
              Modern chat design with message bubbles, timestamps, and smooth animations
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quick Replies</h3>
            <p className="text-gray-600">
              Pre-written questions for common skincare topics - no typing needed
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
            <p className="text-gray-600">
              Intelligent responses powered by Google Gemini AI technology
            </p>
          </div>
        </div>

        {/* Demo Preview */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">See It In Action</h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Chat Preview */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
              
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
                {/* Mock Chat Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={20} />
                    <div>
                      <h3 className="font-semibold">Skincare Assistant</h3>
                      <p className="text-xs text-blue-100">Always here to help</p>
                    </div>
                  </div>
                </div>

                {/* Mock Messages */}
                <div className="space-y-4 mb-4">
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl rounded-bl-sm shadow-sm max-w-[80%]">
                      <p className="text-sm text-gray-800">
                        Hi! I'm your skincare assistant. Ask me anything!
                      </p>
                      <span className="text-xs text-gray-400 mt-1">10:30 AM</span>
                    </div>
                  </div>

                  {/* Quick Replies */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 justify-center">
                      <Zap size={14} className="text-blue-600" />
                      <p className="text-xs font-medium text-gray-600">Quick questions</p>
                    </div>
                    <button className="w-full text-left text-sm p-3 bg-white hover:bg-blue-50 rounded-xl border border-gray-200 transition-all shadow-sm">
                      <span className="flex items-start gap-2">
                        <Sparkles size={14} className="text-blue-600 mt-0.5" />
                        <span className="text-gray-700">Is this product safe for sensitive skin?</span>
                      </span>
                    </button>
                    <button className="w-full text-left text-sm p-3 bg-white hover:bg-blue-50 rounded-xl border border-gray-200 transition-all shadow-sm">
                      <span className="flex items-start gap-2">
                        <Sparkles size={14} className="text-blue-600 mt-0.5" />
                        <span className="text-gray-700">Explain harmful ingredients</span>
                      </span>
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-2xl rounded-br-sm shadow-sm max-w-[80%]">
                      <p className="text-sm">What's the best routine for dry skin?</p>
                      <span className="text-xs text-blue-100 mt-1">10:31 AM</span>
                    </div>
                  </div>
                </div>

                {/* Mock Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask about skincare..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl"
                    disabled
                  />
                  <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl">
                    <MessageCircle size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Instant Responses</h4>
                  <p className="text-gray-600 text-sm">
                    Get answers in seconds with our AI-powered assistant
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Smart Suggestions</h4>
                  <p className="text-gray-600 text-sm">
                    Quick reply buttons for common questions - no typing required
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Typing Indicator</h4>
                  <p className="text-gray-600 text-sm">
                    See when the AI is thinking with animated typing dots
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Conversation History</h4>
                  <p className="text-gray-600 text-sm">
                    Context-aware responses based on your chat history
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Beautiful Animations</h4>
                  <p className="text-gray-600 text-sm">
                    Smooth transitions and delightful micro-interactions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Design */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Works Everywhere</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Smartphone size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile</h3>
              <p className="text-blue-100">
                Optimized for touch and small screens
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Tablet size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tablet</h3>
              <p className="text-blue-100">
                Perfect layout for medium screens
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Monitor size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Desktop</h3>
              <p className="text-blue-100">
                Full-featured experience on large screens
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Try?</h2>
          <p className="text-gray-600 mb-8">
            Look for the chat button in the bottom-right corner of any page
          </p>
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg">
            <MessageCircle size={20} />
            <span className="font-semibold">Chat button is always available</span>
          </div>
        </div>
      </div>
    </div>
  );
}
