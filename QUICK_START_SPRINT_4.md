# ⚡ Quick Start Guide - Sprint 4 Implementation
## Get Started in 5 Minutes

---

## 🎯 **WHAT WE'RE BUILDING**

Sprint 4 adds 5 powerful features:
1. **Scan Comparison** - Compare scans side-by-side
2. **Body Map** - Pin scans to body locations
3. **Reminders** - Schedule regular skin checks
4. **Wishlist** - Save favorite products
5. **Allergen Alerts** - Personalized safety warnings

---

## 🚀 **START HERE: Feature 1 - Scan Comparison**

### **Why Start Here?**
- ✅ Easiest to implement (2 days)
- ✅ Uses existing data (no new backend)
- ✅ High user value
- ✅ Quick win for momentum

### **Step 1: Create the Comparison Page (30 min)**

```bash
# Create new file
touch dermoscanners/client/src/pages/ScanComparisonPage.tsx
```

```typescript
// dermoscanners/client/src/pages/ScanComparisonPage.tsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getScans } from '../utils/scanStorage';

interface Scan {
  id: string;
  result: 'benign' | 'suspicious' | 'malignant';
  confidence: number;
  timestamp: string;
  imageUrl?: string;
}

export default function ScanComparisonPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const scanIds = searchParams.get('ids')?.split(',') || [];
    const allScans = getScans();
    const selectedScans = allScans.filter(s => scanIds.includes(s.id));
    setScans(selectedScans);
    setLoading(false);
  }, [searchParams]);

  const calculateChange = (scan1: Scan, scan2: Scan) => {
    const diff = scan2.confidence - scan1.confidence;
    if (Math.abs(diff) < 0.05) return { icon: Minus, text: 'Stable', color: 'text-gray-600' };
    if (diff > 0) return { icon: TrendingUp, text: 'Improved', color: 'text-green-600' };
    return { icon: TrendingDown, text: 'Declined', color: 'text-red-600' };
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (scans.length < 2) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 mb-4">Please select at least 2 scans to compare</p>
        <button onClick={() => navigate('/history')} className="text-indigo-600">
          Go to History
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/history')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to History
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Scan Comparison
          </h1>
          <p className="text-gray-600 mt-2">Compare your scans to track changes over time</p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scans.map((scan, index) => (
            <div key={scan.id} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              {/* Scan Number */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-500">SCAN {index + 1}</span>
                <span className="text-xs text-gray-500">
                  {new Date(scan.timestamp).toLocaleDateString()}
                </span>
              </div>

              {/* Image */}
              <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 overflow-hidden">
                {scan.imageUrl ? (
                  <img src={scan.imageUrl} alt="Scan" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>

              {/* Result */}
              <div className="mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${
                  scan.result === 'benign' ? 'bg-green-100 text-green-800' :
                  scan.result === 'suspicious' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {scan.result}
                </span>
              </div>

              {/* Confidence */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Confidence</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {(scan.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
                    style={{ width: `${scan.confidence * 100}%` }}
                  />
                </div>
              </div>

              {/* Change Indicator (if not first scan) */}
              {index > 0 && (() => {
                const change = calculateChange(scans[0], scan);
                const Icon = change.icon;
                return (
                  <div className={`mt-4 flex items-center gap-2 ${change.color}`}>
                    <Icon size={20} />
                    <span className="font-semibold">{change.text}</span>
                    <span className="text-sm">
                      ({((scan.confidence - scans[0].confidence) * 100).toFixed(1)}%)
                    </span>
                  </div>
                );
              })()}
            </div>
          ))}
        </div>

        {/* Summary */}
        {scans.length >= 2 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Time Period:</span>
                <span className="font-semibold">
                  {new Date(scans[0].timestamp).toLocaleDateString()} - {new Date(scans[scans.length - 1].timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Scans:</span>
                <span className="font-semibold">{scans.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Confidence Change:</span>
                <span className={`font-semibold ${
                  scans[scans.length - 1].confidence > scans[0].confidence ? 'text-green-600' :
                  scans[scans.length - 1].confidence < scans[0].confidence ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {((scans[scans.length - 1].confidence - scans[0].confidence) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

### **Step 2: Add Route (5 min)**

```typescript
// dermoscanners/client/src/App.tsx
// Add this import at the top
import ScanComparisonPage from './pages/ScanComparisonPage';

// Add this route inside the Layout routes
<Route
  path="/compare-scans"
  element={
    <ProtectedRoute>
      <ScanComparisonPage />
    </ProtectedRoute>
  }
/>
```

### **Step 3: Add Compare Button to History (10 min)**

```typescript
// dermoscanners/client/src/pages/ScanHistoryPage.tsx
// Add at the top
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Inside the component, add:
const [selectedScans, setSelectedScans] = useState<string[]>([]);
const navigate = useNavigate();

const toggleScanSelection = (scanId: string) => {
  setSelectedScans(prev => 
    prev.includes(scanId) 
      ? prev.filter(id => id !== scanId)
      : [...prev, scanId].slice(0, 3) // Max 3 scans
  );
};

const handleCompare = () => {
  if (selectedScans.length >= 2) {
    navigate(`/compare-scans?ids=${selectedScans.join(',')}`);
  }
};

// Add this button above the scan list
{scans.length >= 2 && (
  <div className="mb-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="font-semibold text-gray-800">
          {selectedScans.length === 0 ? 'Select scans to compare' : `${selectedScans.length} scan(s) selected`}
        </p>
        <p className="text-sm text-gray-600">Select 2-3 scans to compare side-by-side</p>
      </div>
      <button
        onClick={handleCompare}
        disabled={selectedScans.length < 2}
        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
      >
        Compare
      </button>
    </div>
  </div>
)}

// Add checkbox to each scan card
<div className="flex items-start gap-4">
  <input
    type="checkbox"
    checked={selectedScans.includes(scan.id)}
    onChange={() => toggleScanSelection(scan.id)}
    className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
  />
  {/* Rest of scan card content */}
</div>
```

### **Step 4: Test It! (5 min)**

```bash
# Start the app
cd dermoscanners
npm run dev

# Test the feature:
# 1. Go to Scan History
# 2. Select 2-3 scans
# 3. Click "Compare"
# 4. View side-by-side comparison
```

---

## ✅ **DONE! Feature 1 Complete**

You just implemented scan comparison in ~1 hour! 🎉

---

## 📋 **NEXT STEPS**

### **Option A: Continue with Feature 2 (Body Map)**
Follow the detailed plan in `SPRINT_4_DEVELOPMENT_PLAN.md`

### **Option B: Polish Feature 1**
Add these enhancements:
- [ ] Export comparison as PDF
- [ ] Add line chart showing trend
- [ ] Email comparison to doctor
- [ ] Add notes to comparison

### **Option C: Get Feedback**
- [ ] Test with real users
- [ ] Gather feedback
- [ ] Iterate based on input

---

## 🎯 **DAILY CHECKLIST**

### **Every Morning:**
- [ ] Pull latest code: `git pull origin main`
- [ ] Review today's tasks
- [ ] Check for blockers
- [ ] Update team on progress

### **Every Evening:**
- [ ] Commit your work: `git commit -m "feat: add scan comparison"`
- [ ] Push to branch: `git push origin sprint-4-development`
- [ ] Update progress tracker
- [ ] Plan tomorrow's tasks

---

## 🆘 **NEED HELP?**

### **Common Issues:**

**Issue 1: Scans not loading**
```typescript
// Check localStorage
console.log('Scans:', getScans());

// Verify scan IDs
console.log('Selected IDs:', searchParams.get('ids'));
```

**Issue 2: Images not displaying**
```typescript
// Check imageUrl exists
console.log('Image URL:', scan.imageUrl);

// Add error handling
<img 
  src={scan.imageUrl} 
  onError={(e) => {
    e.currentTarget.src = '/placeholder.png';
  }}
/>
```

**Issue 3: Route not working**
```typescript
// Verify route is inside <Routes>
// Check ProtectedRoute is working
// Test navigation: navigate('/compare-scans?ids=1,2')
```

---

## 📊 **PROGRESS TRACKER**

### **Sprint 4 Features:**
- [x] Feature 1: Scan Comparison (Day 1-2)
- [ ] Feature 2: Body Map (Day 3-5)
- [ ] Feature 3: Reminders (Day 6-7)
- [ ] Feature 4: Wishlist (Day 8)
- [ ] Feature 5: Allergen Alerts (Day 9-10)

### **Today's Progress:**
- [x] Created ScanComparisonPage
- [x] Added route
- [x] Added compare button to history
- [x] Tested feature
- [ ] Add PDF export (optional)
- [ ] Add trend chart (optional)

---

## 🚀 **READY FOR FEATURE 2?**

When you're ready to start Body Map:
1. Read the detailed plan in `SPRINT_4_DEVELOPMENT_PLAN.md`
2. Start with backend (Day 3)
3. Create body map schema
4. Build API endpoints
5. Then move to frontend

---

## 💪 **YOU'VE GOT THIS!**

You just built a complex feature in under an hour. Keep this momentum going!

**Remember:**
- Start small, iterate fast
- Test frequently
- Commit often
- Ask for help when stuck
- Celebrate small wins

**Let's ship Sprint 4! 🚀**

