# Quick Testing Checklist - Sprint 3

Use this as a quick reference while performing tests. For detailed instructions, see BROWSER_TESTING_GUIDE.md.

---

## Pre-Test Setup
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 5173)
- [ ] Test images prepared (JPEG, PNG, WebP, invalid, large)
- [ ] QA_REPORT_SPRINT3.md open for recording results

---

## Desktop Browser Tests

### Chrome
- [ ] Upload JPEG → Result displays
- [ ] Upload PNG → Result displays
- [ ] Upload WebP → Result displays
- [ ] Invalid file → Error message
- [ ] Large file → Error message
- [ ] Result card renders correctly
- [ ] Confidence meter animates
- [ ] Recommendations display
- [ ] No console errors

### Edge
- [ ] Upload JPEG → Result displays
- [ ] Upload PNG → Result displays
- [ ] Upload WebP → Result displays
- [ ] Result card renders correctly
- [ ] Recommendations display
- [ ] No console errors

### Safari
- [ ] Upload JPEG → Result displays
- [ ] Upload PNG → Result displays
- [ ] Upload WebP → Result displays
- [ ] Result card renders correctly
- [ ] Recommendations display
- [ ] No console errors

### Firefox
- [ ] Upload JPEG → Result displays
- [ ] Upload PNG → Result displays
- [ ] Upload WebP → Result displays
- [ ] Result card renders correctly
- [ ] Recommendations display
- [ ] No console errors

---

## Responsive Design Tests

### Mobile (320px)
- [ ] No horizontal scrolling
- [ ] Upload button accessible
- [ ] Image preview displays
- [ ] Result card readable
- [ ] Recommendations readable
- [ ] Buttons tappable
- [ ] Screenshot captured

### Tablet (768px)
- [ ] No horizontal scrolling
- [ ] Layout spacing appropriate
- [ ] Result card adapts
- [ ] Touch interactions work
- [ ] Screenshot captured

### Desktop (1024px)
- [ ] No horizontal scrolling
- [ ] Content centered
- [ ] Result card optimal width
- [ ] Screenshot captured

### Large Desktop (1920px)
- [ ] No horizontal scrolling
- [ ] Content doesn't stretch
- [ ] Text readable
- [ ] Screenshot captured

---

## Documentation

- [ ] All test results recorded in QA_REPORT_SPRINT3.md
- [ ] Screenshots saved with proper naming
- [ ] Console errors documented
- [ ] Known issues listed
- [ ] Browser-specific workarounds noted
- [ ] Test summary completed
- [ ] Report signed off

---

## Quick Commands

### Start Servers
```bash
# Backend
cd dermoscanners/server && npm start

# Frontend
cd dermoscanners/client && npm run dev
```

### Open DevTools
- Chrome/Edge/Firefox: F12 or Cmd+Option+I
- Safari: Cmd+Option+I (enable in Preferences → Advanced)

### Toggle Responsive Mode
- Chrome/Edge: Cmd+Shift+M or Ctrl+Shift+M
- Safari: Cmd+Option+R
- Firefox: Cmd+Option+M or Ctrl+Shift+M

### Clear Cache
- All browsers: Cmd+Shift+Delete or Ctrl+Shift+Delete

---

## Expected Results Summary

### Successful Upload
- Image preview displays
- "Analyzing..." spinner shows
- ~3 second delay
- Result card appears with fade-in
- Classification badge (green/yellow/red)
- Confidence meter (0-100%)
- Processing time (~3s)
- Formatted timestamp
- Recommendations panel below
- "Scan saved successfully!" message

### Error Cases
- Invalid format: "Invalid file format. Please upload JPEG, PNG, or WebP images only."
- Large file: "File size exceeds 5MB limit. Please choose a smaller image."
- Network error: "Network error. Please check your connection and try again."

---

## Issue Priority Guide

### Critical (Must Fix)
- Application crashes
- Cannot upload images
- Results don't display
- Data loss

### High (Should Fix)
- Console errors
- Broken animations
- Layout breaks on specific browser
- Accessibility issues

### Medium (Nice to Fix)
- Minor visual inconsistencies
- Animation timing off
- Non-critical warnings

### Low (Can Defer)
- Minor styling differences
- Edge case issues
- Cosmetic improvements

---

## Time Estimate

- Desktop browser testing: ~30 minutes per browser (2 hours total)
- Responsive design testing: ~45 minutes
- Documentation: ~30 minutes
- **Total: ~3-3.5 hours**

---

## Contact

If you encounter blocking issues:
1. Check BROWSER_TESTING_GUIDE.md for troubleshooting
2. Review design.md for expected behavior
3. Check server logs for backend errors
4. Verify environment variables are set

