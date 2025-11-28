import { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeResult: string;
  afterResult: string;
  beforeDate: string;
  afterDate: string;
  riskChange: number;
  daysBetween: number;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeResult,
  afterResult,
  beforeDate,
  afterDate,
  riskChange,
  daysBetween
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging && e.type !== 'click') return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  const improvement = riskChange < 0 ? 'improved' : riskChange > 0 ? 'worsened' : 'stable';

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Before & After Comparison</h2>
        <p className="text-white/90">{daysBetween} days between scans</p>
      </div>

      {/* Comparison Slider */}
      <div
        className="relative aspect-video bg-gray-900 cursor-ew-resize select-none"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleMove}
        onClick={handleMove}
      >
        {/* After Image (Background) */}
        <div className="absolute inset-0">
          <img
            src={afterImage}
            alt="After"
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg font-semibold">
            After
          </div>
        </div>

        {/* Before Image (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={beforeImage}
            alt="Before"
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg font-semibold">
            Before
          </div>
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-xl">
            <div className="flex items-center gap-1">
              <ChevronLeft className="w-4 h-4 text-gray-700" />
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Stats */}
      <div className="p-6 bg-gray-50">
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Before Stats */}
          <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Before</p>
            <p className="text-lg font-bold text-gray-900 capitalize">{beforeResult}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(beforeDate).toLocaleDateString()}
            </p>
          </div>

          {/* After Stats */}
          <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
            <p className="text-sm text-gray-500 mb-1">After</p>
            <p className="text-lg font-bold text-gray-900 capitalize">{afterResult}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(afterDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Change Indicator */}
        <div className={`rounded-xl p-4 ${
          improvement === 'improved' ? 'bg-green-50 border-2 border-green-200' :
          improvement === 'worsened' ? 'bg-red-50 border-2 border-red-200' :
          'bg-gray-50 border-2 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {improvement === 'improved' ? (
                <TrendingDown className="w-6 h-6 text-green-600" />
              ) : improvement === 'worsened' ? (
                <TrendingUp className="w-6 h-6 text-red-600" />
              ) : (
                <Minus className="w-6 h-6 text-gray-600" />
              )}
              <div>
                <p className={`font-bold text-lg ${
                  improvement === 'improved' ? 'text-green-700' :
                  improvement === 'worsened' ? 'text-red-700' :
                  'text-gray-700'
                }`}>
                  {improvement === 'improved' ? 'Improvement Detected!' :
                   improvement === 'worsened' ? 'Condition Worsened' :
                   'Condition Stable'}
                </p>
                <p className="text-sm text-gray-600">
                  Risk change: {riskChange > 0 ? '+' : ''}{riskChange}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
