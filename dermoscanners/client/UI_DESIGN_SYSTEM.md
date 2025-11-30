# DermoScanners UI Design System

## Overview
This document outlines the comprehensive design system for DermoScanners, ensuring visual consistency across all screens and components.

## Color Palette

### Primary Colors
- **Indigo-Purple Gradient**: `from-indigo-600 to-purple-600`
  - Used for: Primary buttons, headers, active states
  - Hex: #4F46E5 → #9333EA

### Secondary Colors
- **Blue Gradient**: `from-blue-600 to-cyan-600`
  - Used for: Clinician features, info states
- **Green Gradient**: `from-green-600 to-emerald-600`
  - Used for: Success states, health tips
- **Pink Gradient**: `from-pink-600 to-rose-600`
  - Used for: Recommendations, highlights
- **Yellow-Orange**: `from-yellow-400 to-orange-500`
  - Used for: XP notifications, achievements

### Neutral Colors
- **Background**: `bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50`
- **Card Background**: `bg-white`
- **Text Primary**: `text-gray-800`
- **Text Secondary**: `text-gray-600`
- **Border**: `border-gray-200`

## Typography

### Font Sizes
- **Hero**: `text-5xl md:text-7xl` (48px-72px)
- **H1**: `text-4xl` (36px)
- **H2**: `text-3xl` (30px)
- **H3**: `text-2xl` (24px)
- **Body Large**: `text-xl` (20px)
- **Body**: `text-base` (16px)
- **Small**: `text-sm` (14px)
- **Extra Small**: `text-xs` (12px)

### Font Weights
- **Black**: `font-black` (900)
- **Bold**: `font-bold` (700)
- **Semibold**: `font-semibold` (600)
- **Medium**: `font-medium` (500)
- **Regular**: `font-normal` (400)

## Spacing System

### Padding/Margin Scale
- **xs**: `p-2` (8px)
- **sm**: `p-4` (16px)
- **md**: `p-6` (24px)
- **lg**: `p-8` (32px)
- **xl**: `p-12` (48px)

### Gap Scale
- **xs**: `gap-2` (8px)
- **sm**: `gap-3` (12px)
- **md**: `gap-4` (16px)
- **lg**: `gap-6` (24px)
- **xl**: `gap-8` (32px)

## Component Styles

### Buttons

#### Primary Button
```tsx
className="btn-primary"
// or
className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
```

#### Secondary Button
```tsx
className="btn-secondary"
// or
className="px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300"
```

#### Outline Button
```tsx
className="btn-outline"
// or
className="px-6 py-3 bg-transparent text-indigo-600 rounded-xl font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-all duration-300"
```

### Cards

#### Standard Card
```tsx
className="card"
// or
className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
```

#### Interactive Card
```tsx
className="card-interactive"
// or
className="card hover:scale-105 cursor-pointer"
```

### Input Fields

#### Text Input
```tsx
className="input-field"
// or
className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
```

### Badges

#### Primary Badge
```tsx
className="badge-primary"
// or
className="badge bg-indigo-100 text-indigo-700"
```

#### Success Badge
```tsx
className="badge-success"
// or
className="badge bg-green-100 text-green-700"
```

#### Warning Badge
```tsx
className="badge-warning"
// or
className="badge bg-yellow-100 text-yellow-700"
```

#### Danger Badge
```tsx
className="badge-danger"
// or
className="badge bg-red-100 text-red-700"
```

### Icon Containers

#### Primary Icon Container
```tsx
className="icon-container-primary"
// or
className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100"
```

## Border Radius

- **Small**: `rounded-lg` (8px)
- **Medium**: `rounded-xl` (12px)
- **Large**: `rounded-2xl` (16px)
- **Extra Large**: `rounded-3xl` (24px)
- **Full**: `rounded-full` (9999px)

## Shadows

- **Small**: `shadow-sm`
- **Medium**: `shadow-md`
- **Large**: `shadow-lg`
- **Extra Large**: `shadow-xl`
- **2XL**: `shadow-2xl`
- **Soft**: `shadow-soft` (custom)
- **Glow**: `shadow-glow` (custom)

## Animations

### Fade In
```tsx
className="animate-fade-in"
// Duration: 0.5s
```

### Slide Up
```tsx
className="animate-slide-up"
// Duration: 0.5s
```

### Slide In
```tsx
className="animate-slide-in"
// Duration: 0.5s
```

### Scale In
```tsx
className="animate-scale-in"
// Duration: 0.3s
```

### Hover Effects
- **Scale**: `hover:scale-105` (5% increase)
- **Shadow**: `hover:shadow-xl`
- **Brightness**: `hover:brightness-110`

## Layout Patterns

### Page Container
```tsx
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
  <div className="max-w-7xl mx-auto px-6 py-8">
    {/* Content */}
  </div>
</div>
```

### Card Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

### Centered Content
```tsx
<div className="flex items-center justify-center min-h-screen p-4">
  <div className="w-full max-w-md">
    {/* Content */}
  </div>
</div>
```

## Gradient Text
```tsx
className="gradient-text"
// or
className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
```

## Responsive Design

### Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Mobile-First Approach
Always design for mobile first, then add responsive classes:
```tsx
className="text-base md:text-lg lg:text-xl"
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
className="p-4 md:p-6 lg:p-8"
```

## Accessibility

### Focus States
All interactive elements must have visible focus states:
```tsx
className="focus:outline-none focus:ring-2 focus:ring-indigo-500"
```

### Color Contrast
- Ensure minimum 4.5:1 contrast ratio for normal text
- Ensure minimum 3:1 contrast ratio for large text
- Use semantic colors for states (green=success, red=error, yellow=warning)

### ARIA Labels
Always include aria-labels for icon-only buttons:
```tsx
<button aria-label="Close dialog">
  <X size={20} />
</button>
```

## Dark Mode Support
Currently, the app uses a light theme. For future dark mode implementation:
- Use Tailwind's `dark:` prefix
- Define dark mode colors in tailwind.config.js
- Test all components in both modes

## Consistency Checklist

### ✅ All Pages Should Have:
- [ ] Consistent background gradient
- [ ] Proper spacing (px-6 py-8 for main content)
- [ ] Rounded corners (rounded-2xl or rounded-3xl for cards)
- [ ] Smooth transitions (transition-all duration-300)
- [ ] Hover effects on interactive elements
- [ ] Proper loading states
- [ ] Error handling with styled messages
- [ ] Responsive design for mobile/tablet/desktop

### ✅ All Buttons Should Have:
- [ ] Consistent padding (px-6 py-3 or px-8 py-4)
- [ ] Rounded corners (rounded-xl)
- [ ] Font weight (font-semibold)
- [ ] Hover effects (hover:shadow-lg hover:scale-105)
- [ ] Disabled states (disabled:opacity-50 disabled:cursor-not-allowed)
- [ ] Smooth transitions (transition-all duration-300)

### ✅ All Cards Should Have:
- [ ] White background (bg-white)
- [ ] Rounded corners (rounded-2xl)
- [ ] Shadow (shadow-lg or shadow-xl)
- [ ] Border (border border-gray-100)
- [ ] Padding (p-6 or p-8)
- [ ] Hover effect (hover:shadow-xl)

### ✅ All Forms Should Have:
- [ ] Consistent input styling (input-field class)
- [ ] Label styling (text-sm font-semibold text-gray-700 mb-2)
- [ ] Error messages (bg-red-50 border-2 border-red-200 text-red-700)
- [ ] Success messages (bg-green-50 border-2 border-green-200 text-green-700)
- [ ] Loading states on submit buttons

## ChatBot Consistency

The ChatWidget follows the same design system:
- **Header**: Gradient background matching primary colors
- **Messages**: Rounded bubbles with proper spacing
- **Input**: Consistent with form inputs
- **Animations**: Smooth slide-in and fade effects
- **Colors**: User messages use primary gradient, assistant messages use white

## Icons

### Icon Library
Using Lucide React for all icons:
- Consistent size: 20px (default), 24px (large), 16px (small)
- Consistent stroke width: 2 (default)
- Always use semantic icons (e.g., Camera for scan, User for profile)

### Icon Sizing
```tsx
<Icon size={16} /> // Small
<Icon size={20} /> // Default
<Icon size={24} /> // Large
<Icon size={32} /> // Extra Large
```

## Best Practices

1. **Use Utility Classes**: Prefer Tailwind utilities over custom CSS
2. **Consistent Spacing**: Use the spacing scale consistently
3. **Semantic Colors**: Use colors that convey meaning
4. **Smooth Transitions**: Add transitions to all interactive elements
5. **Mobile First**: Design for mobile, enhance for desktop
6. **Accessibility**: Always consider keyboard navigation and screen readers
7. **Performance**: Optimize images and use lazy loading
8. **Error Handling**: Provide clear, helpful error messages
9. **Loading States**: Show loading indicators for async operations
10. **Feedback**: Provide visual feedback for user actions

## Testing Checklist

- [ ] Test on mobile (320px - 768px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (1024px+)
- [ ] Test all interactive states (hover, focus, active, disabled)
- [ ] Test with keyboard navigation
- [ ] Test with screen reader
- [ ] Verify color contrast ratios
- [ ] Check for layout shifts
- [ ] Verify all animations are smooth
- [ ] Test error states
- [ ] Test loading states
- [ ] Verify responsive images

---

**Last Updated**: November 30, 2025
**Version**: 1.0.0
