# Hero Image Setup Guide

## 📸 How to Add Your Hero Image

### Step 1: Prepare Your Image

**Recommended Specifications:**
- **Dimensions**: 1920x1080px (16:9) or 1600x900px
- **File Size**: < 500KB (optimized for fast loading)
- **Format**: JPG (recommended) or PNG
- **Content**: Skin care, dermatology, health, or wellness imagery
- **Quality**: High resolution but web-optimized

**Image Optimization Tips:**
1. Use tools like [TinyPNG](https://tinypng.com/) or [ImageOptim](https://imageoptim.com/)
2. Compress without losing quality
3. Convert to WebP for even better performance (optional)
4. Ensure good contrast for white text overlay

### Step 2: Add Your Image

**Option A: Using the Public Folder (Recommended)**

1. Place your image in: `dermoscanners/client/public/`
2. Name it: `shutterstock_2165450175.jpg.webp` or `hero-image.png`
3. Update the path in WelcomePage.tsx:
   ```typescript
   const heroImagePath = '/shutterstock_2165450175.jpg.webp';
   ```

**Option B: Using the Assets Folder**

1. Place your image in: `dermoscanners/client/src/assets/images/`
2. Name it: `shutterstock_2165450175.jpg.webp` or `hero-image.png`
3. Import it in WelcomePage.tsx:
   ```typescript
   import heroImage from '../assets/images/shutterstock_2165450175.jpg.webp';
   const heroImagePath = heroImage;
   ```

### Step 3: Verify It Works

1. Start the development server:
   ```bash
   cd dermoscanners
   npm run dev
   ```

2. Visit: http://localhost:5173/welcome

3. You should see your hero image with:
   - Smooth fade-in animation
   - Dark gradient overlay for text readability
   - Responsive sizing on all devices

### Step 4: Test Fallback

If your image doesn't load, the page will automatically show a beautiful gradient background instead. This ensures the page always looks great!

## 🎨 Current Design Features

### Hero Section Includes:
- ✅ Full-width hero image with overlay
- ✅ Smooth fade-in animation
- ✅ Responsive text layout
- ✅ Call-to-action buttons
- ✅ Trust indicators
- ✅ Feature highlight card (desktop)
- ✅ Automatic fallback to gradient

### Text Overlay:
- White text with gradient accents
- Semi-transparent background for readability
- Responsive font sizes
- Mobile-optimized layout

## 📱 Responsive Behavior

### Desktop (> 1024px)
- Two-column layout
- Hero image fills background
- Feature card on right side
- Large text and buttons

### Tablet (768px - 1024px)
- Single column layout
- Hero image fills background
- Centered content
- Medium text and buttons

### Mobile (< 768px)
- Single column layout
- Hero image fills background
- Stacked content
- Smaller text and buttons
- Touch-friendly buttons

## 🎯 Image Content Suggestions

### Good Image Choices:
- ✅ Person with healthy, glowing skin
- ✅ Dermatologist examining patient
- ✅ Skincare products arranged beautifully
- ✅ Close-up of healthy skin texture
- ✅ Medical/health professional setting
- ✅ Technology + healthcare imagery

### Avoid:
- ❌ Low resolution or blurry images
- ❌ Images with too much text
- ❌ Dark images (text won't be readable)
- ❌ Busy/cluttered compositions
- ❌ Copyrighted stock photos without license

## 🔧 Advanced Customization

### Change Overlay Color

In `WelcomePage.tsx`, find this line:
```typescript
<div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/75 to-pink-900/70"></div>
```

Adjust the colors and opacity:
- `from-indigo-900/80` - Start color with 80% opacity
- `via-purple-900/75` - Middle color with 75% opacity
- `to-pink-900/70` - End color with 70% opacity

### Change Animation Speed

In the `<style>` section:
```css
.animate-fade-in {
  animation: fadeIn 800ms ease-out; /* Change 800ms to your preference */
}
```

### Add Multiple Images for Different Devices

```typescript
const heroImagePath = window.innerWidth < 768 
  ? '/hero-image-mobile.jpg'
  : window.innerWidth < 1024
  ? '/hero-image-tablet.jpg'
  : '/hero-image-desktop.jpg';
```

## 🚀 Performance Tips

### Lazy Loading (Already Implemented)
The image loads with a fade-in effect, improving perceived performance.

### WebP Format (Optional)
For even better performance:
1. Convert your image to WebP format
2. Use both formats with fallback:
   ```html
   <picture>
     <source srcset="/hero-image.webp" type="image/webp">
     <img src="/shutterstock_2165450175.jpg.webp" alt="Hero">
   </picture>
   ```

### CDN Hosting (Production)
For production, consider hosting images on a CDN like:
- Cloudinary
- Imgix
- AWS S3 + CloudFront

## 📝 Example Images to Try

### Free Stock Photo Sources:
1. **Unsplash** - https://unsplash.com/s/photos/skincare
2. **Pexels** - https://www.pexels.com/search/dermatology/
3. **Pixabay** - https://pixabay.com/images/search/skin-care/

### Search Terms:
- "skincare routine"
- "dermatology"
- "healthy skin"
- "medical technology"
- "healthcare professional"
- "wellness"

## ✅ Checklist

Before deploying:
- [ ] Image is optimized (< 500KB)
- [ ] Image has good contrast for white text
- [ ] Image is properly licensed
- [ ] Tested on mobile devices
- [ ] Tested on different browsers
- [ ] Fallback gradient works
- [ ] Loading animation is smooth
- [ ] Text is readable on all devices

## 🎉 You're Done!

Your hero image is now set up and ready to impress users! The page will automatically:
- Load your image with a smooth fade-in
- Show a gradient overlay for text readability
- Fall back to a beautiful gradient if the image fails
- Adapt to all screen sizes
- Provide a professional, modern look

---

**Need help?** Check the main documentation or contact support.

**Want to customize more?** See the WelcomePage.tsx component for full control.
