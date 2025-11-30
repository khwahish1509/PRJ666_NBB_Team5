# Quick Style Guide - DermoScanners

## 🎨 Quick Reference for Common Patterns

### Page Layout
```tsx
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
  <div className="max-w-7xl mx-auto px-6 py-8">
    {/* Your content */}
  </div>
</div>
```

### Buttons

**Primary Button**
```tsx
<button className="btn-primary">
  Click Me
</button>
```

**Secondary Button**
```tsx
<button className="btn-secondary">
  Cancel
</button>
```

**With Icon**
```tsx
<button className="btn-primary flex items-center gap-2">
  <Icon size={20} />
  <span>Action</span>
</button>
```

### Cards

**Basic Card**
```tsx
<div className="card">
  <h3 className="text-xl font-bold text-gray-800 mb-2">Title</h3>
  <p className="text-gray-600">Content</p>
</div>
```

**Interactive Card**
```tsx
<div className="card-interactive">
  {/* Content */}
</div>
```

**Card with Icon**
```tsx
<div className="card">
  <div className="icon-container-primary mb-4">
    <Icon size={24} className="text-indigo-600" />
  </div>
  <h3 className="text-xl font-bold text-gray-800 mb-2">Title</h3>
  <p className="text-gray-600">Description</p>
</div>
```

### Forms

**Input Field**
```tsx
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Email
  </label>
  <input
    type="email"
    className="input-field"
    placeholder="your@email.com"
  />
</div>
```

**Input with Icon**
```tsx
<div className="relative">
  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
  <input
    type="email"
    className="input-field pl-12"
    placeholder="your@email.com"
  />
</div>
```

### Alerts

**Error**
```tsx
<div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
  <p className="text-sm font-medium">{errorMessage}</p>
</div>
```

**Success**
```tsx
<div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl">
  <p className="text-sm font-medium">{successMessage}</p>
</div>
```

**Info**
```tsx
<div className="bg-blue-50 border-2 border-blue-200 text-blue-700 px-4 py-3 rounded-xl">
  <p className="text-sm font-medium">{infoMessage}</p>
</div>
```

### Badges

```tsx
<span className="badge-primary">Primary</span>
<span className="badge-success">Success</span>
<span className="badge-warning">Warning</span>
<span className="badge-danger">Danger</span>
```

### Grid Layouts

**2 Columns**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Items */}
</div>
```

**3 Columns**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>
```

**4 Columns**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Items */}
</div>
```

### Gradient Text
```tsx
<h1 className="gradient-text">
  Beautiful Gradient Text
</h1>
```

### Loading State
```tsx
{loading ? (
  <div className="flex items-center gap-2">
    <Loader2 className="animate-spin" size={20} />
    <span>Loading...</span>
  </div>
) : (
  <span>Content</span>
)}
```

### Icon Containers

```tsx
<div className="icon-container-primary">
  <Icon size={24} className="text-indigo-600" />
</div>

<div className="icon-container-success">
  <Icon size={24} className="text-green-600" />
</div>

<div className="icon-container-warning">
  <Icon size={24} className="text-yellow-600" />
</div>

<div className="icon-container-danger">
  <Icon size={24} className="text-red-600" />
</div>
```

### Animations

**Fade In**
```tsx
<div className="animate-fade-in">
  {/* Content */}
</div>
```

**Slide Up**
```tsx
<div className="animate-slide-up">
  {/* Content */}
</div>
```

**Scale In**
```tsx
<div className="animate-scale-in">
  {/* Content */}
</div>
```

### Hover Effects

**Scale on Hover**
```tsx
<div className="hover:scale-105 transition-transform duration-300">
  {/* Content */}
</div>
```

**Shadow on Hover**
```tsx
<div className="hover:shadow-xl transition-shadow duration-300">
  {/* Content */}
</div>
```

**Combined Effects**
```tsx
<div className="hover:scale-105 hover:shadow-xl transition-all duration-300">
  {/* Content */}
</div>
```

## 🎯 Common Gradients

```tsx
// Primary
className="bg-gradient-to-r from-indigo-600 to-purple-600"

// Success
className="bg-gradient-to-r from-green-600 to-emerald-600"

// Warning
className="bg-gradient-to-r from-yellow-400 to-orange-500"

// Danger
className="bg-gradient-to-r from-red-600 to-pink-600"

// Info
className="bg-gradient-to-r from-blue-600 to-cyan-600"
```

## 📱 Responsive Patterns

```tsx
// Text Size
className="text-base md:text-lg lg:text-xl"

// Padding
className="p-4 md:p-6 lg:p-8"

// Grid Columns
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Flex Direction
className="flex-col md:flex-row"

// Hide on Mobile
className="hidden md:block"

// Show only on Mobile
className="block md:hidden"
```

## 🔍 Common Icon Sizes

```tsx
<Icon size={16} /> // Small
<Icon size={20} /> // Default
<Icon size={24} /> // Large
<Icon size={32} /> // Extra Large
<Icon size={48} /> // Hero
```

## ✨ Pro Tips

1. **Always use transitions**: Add `transition-all duration-300` to interactive elements
2. **Consistent spacing**: Use the spacing scale (gap-4, p-6, mb-8)
3. **Semantic colors**: Use colors that convey meaning
4. **Mobile first**: Start with mobile styles, add responsive classes
5. **Accessibility**: Always include focus states and aria-labels
6. **Loading states**: Show feedback for async operations
7. **Error handling**: Provide clear, helpful error messages

## 🚀 Quick Start Template

```tsx
import { useState } from 'react';
import { Icon } from 'lucide-react';

export default function MyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="card">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Page Title
        </h1>
        <p className="text-gray-600">
          Page description
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-interactive">
          <div className="icon-container-primary mb-4">
            <Icon size={24} className="text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Card Title
          </h3>
          <p className="text-gray-600">
            Card description
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl animate-scale-in">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Action */}
      <button
        onClick={() => {/* action */}}
        disabled={loading}
        className="btn-primary"
      >
        {loading ? 'Loading...' : 'Action'}
      </button>
    </div>
  );
}
```

---

For complete documentation, see `UI_DESIGN_SYSTEM.md`
