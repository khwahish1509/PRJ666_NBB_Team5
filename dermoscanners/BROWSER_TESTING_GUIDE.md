# Cross-Browser Compatibility Testing Guide

## Overview
This guide provides step-by-step instructions for performing comprehensive cross-browser compatibility testing for the DermoScanner Sprint 3 AI scan workflow.

---

## Prerequisites

### 1. Application Setup
Before starting tests, ensure the application is running:

```bash
# Terminal 1: Start backend server
cd dermoscanners/server
npm start

# Terminal 2: Start frontend dev server
cd dermoscanners/client
npm run dev
```

Verify both servers are running:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173 (or your configured port)

### 2. Test Images
Prepare test images in the following formats:
- **JPEG**: `test-benign.jpg` (< 5MB)
- **PNG**: `test-suspicious.png` (< 5MB)
- **WebP**: `test-malignant.webp` (< 5MB)
- **Invalid**: `test-invalid.txt` (for error testing)
- **Large**: `test-large.jpg` (> 5MB, for size validation)

You can find sample images in `dermoscanners/test-images/` or use your own.

### 3. Browsers to Test
Install the latest versions of:
- Google Chrome
- Microsoft Edge
- Safari (macOS only)
- Mozilla Firefox

---

## Testing Workflow

### Phase 1: Desktop Browser Testing

For each browser (Chrome, Edge, Safari, Firefox), perform the following tests:

#### Step 1: Initial Setup
1. Open the browser
2. Clear cache and cookies (Cmd+Shift+Delete / Ctrl+Shift+Delete)
3. Open Developer Tools (F12 or Cmd+Option+I)
4. Navigate to Console tab
5. Navigate to http://localhost:5173

#### Step 2: Image Upload Tests

**Test 2.1: Upload JPEG Image**
1. Click the upload area on the scan page
2. Select a JPEG test image
3. Verify image preview displays correctly
4. Click "Analyze Image" button
5. Wait for analysis to complete (~3 seconds)
6. **Expected Results**:
   - Loading spinner appears with "Analyzing..." text
   - Result card appears after ~3 seconds
   - Classification badge shows (benign/suspicious/malignant)
   - Confidence meter displays percentage
   - Processing time shows ~3 seconds
   - Timestamp is formatted correctly
   - No console errors
7. Record results in QA_REPORT_SPRINT3.md

**Test 2.2: Upload PNG Image**
1. Click "Cancel" to reset
2. Repeat steps from Test 2.1 with PNG image
3. Record results

**Test 2.3: Upload WebP Image**
1. Click "Cancel" to reset
2. Repeat steps from Test 2.1 with WebP image
3. Record results

**Test 2.4: Invalid File Format**
1. Click "Cancel" to reset
2. Try to upload a .txt file
3. **Expected Results**:
   - Error message displays: "Invalid file format. Please upload JPEG, PNG, or WebP images only."
   - No console errors
4. Record results

**Test 2.5: Oversized File**
1. Click "Cancel" to reset
2. Try to upload a file > 5MB
3. **Expected Results**:
   - Error message displays: "File size exceeds 5MB limit. Please choose a smaller image."
   - No console errors
4. Record results

#### Step 3: Result Card Rendering Tests

**Test 3.1: Visual Inspection**
After a successful scan, verify:
- [ ] Classification badge displays with correct icon
- [ ] Badge color matches risk level (green/yellow/red)
- [ ] Confidence percentage is displayed
- [ ] Progress bar fills to correct percentage
- [ ] Processing time is shown in seconds
- [ ] Timestamp is formatted correctly
- [ ] Card has fade-in animation (300ms)
- [ ] Card is centered on page
- [ ] Card has proper shadow and border

**Test 3.2: Confidence Meter Animation**
1. Upload a new image
2. Watch the confidence meter as result appears
3. **Expected Results**:
   - Progress bar animates smoothly from 0% to final percentage
   - Animation takes ~500ms
   - No visual glitches or jumps

#### Step 4: Recommendation Panel Tests

**Test 4.1: Benign Result Recommendations**
1. Upload an image that returns "benign" result
2. Scroll to recommendation panel
3. **Expected Results**:
   - Title: "Low Risk Detected"
   - 3-4 health tips displayed
   - Tips include: monitoring, sunscreen, checkup advice
   - Panel has proper styling and spacing

**Test 4.2: Suspicious Result Recommendations**
1. Upload an image that returns "suspicious" result
2. Scroll to recommendation panel
3. **Expected Results**:
   - Title: "Moderate Risk - Consult Doctor"
   - Tips include: dermatologist appointment, documentation advice
   - Proper styling with yellow/warning theme

**Test 4.3: Malignant Result Recommendations**
1. Upload an image that returns "malignant" result
2. Scroll to recommendation panel
3. **Expected Results**:
   - Title: "High Risk - Immediate Action Required"
   - Tips include: immediate consultation, urgency messaging
   - Proper styling with red/alert theme

#### Step 5: Console Error Check
1. Review the browser console
2. **Expected Results**:
   - No errors (red messages)
   - No warnings (yellow messages)
   - Only info/log messages if any
3. Record any errors in QA report

#### Step 6: Repeat for All Browsers
Complete Steps 1-5 for:
- [ ] Chrome
- [ ] Edge
- [ ] Safari
- [ ] Firefox

---

### Phase 2: Responsive Design Testing

#### Test Setup
Use browser DevTools to emulate different screen sizes:
- Chrome/Edge: F12 → Toggle device toolbar (Cmd+Shift+M)
- Safari: Develop → Enter Responsive Design Mode
- Firefox: F12 → Responsive Design Mode (Cmd+Option+M)

#### Test 2.1: Mobile Layout (320px width)

**Setup**:
1. Set viewport to 320px × 568px (iPhone SE)
2. Refresh page

**Tests**:
1. **No Horizontal Scrolling**
   - Scroll horizontally
   - **Expected**: No horizontal scrollbar, all content fits

2. **Upload Button Accessibility**
   - Check upload area size
   - **Expected**: Touch target is at least 44×44px

3. **Image Preview**
   - Upload an image
   - **Expected**: Image scales to fit, no distortion

4. **Result Card Readability**
   - Complete a scan
   - **Expected**:
     - Text is legible (min 16px)
     - Elements stack vertically
     - No text overflow
     - Proper spacing between elements

5. **Recommendation Panel**
   - View recommendations
   - **Expected**:
     - Tips display in readable format
     - Proper line breaks
     - No text cutoff

6. **Button Tappability**
   - Try tapping all buttons
   - **Expected**:
     - "Analyze Image" button is easy to tap
     - "Cancel" button is accessible
     - "View Scan History" button works
     - No mis-taps or overlapping touch areas

**Screenshot**: Take screenshot and save as `mobile-320px.png`

#### Test 2.2: Tablet Layout (768px width)

**Setup**:
1. Set viewport to 768px × 1024px (iPad)
2. Refresh page

**Tests**:
1. **No Horizontal Scrolling**
   - **Expected**: All content fits within viewport

2. **Layout Spacing**
   - Check margins and padding
   - **Expected**: Elements have proper spacing, not cramped

3. **Result Card Layout**
   - Complete a scan
   - **Expected**:
     - Card width adjusts appropriately
     - Metadata grid displays in 2 columns
     - Proper spacing maintained

4. **Touch Interactions**
   - Test all interactive elements
   - **Expected**: Buttons respond to touch events

**Screenshot**: Take screenshot and save as `tablet-768px.png`

#### Test 2.3: Desktop Layout (1024px width)

**Setup**:
1. Set viewport to 1024px × 768px
2. Refresh page

**Tests**:
1. **No Horizontal Scrolling**
   - **Expected**: All content fits within viewport

2. **Content Centering**
   - **Expected**: Content container is centered with max-width

3. **Result Card Width**
   - Complete a scan
   - **Expected**: Card is max 600px wide, centered

**Screenshot**: Take screenshot and save as `desktop-1024px.png`

#### Test 2.4: Large Desktop Layout (1920px width)

**Setup**:
1. Set viewport to 1920px × 1080px
2. Refresh page

**Tests**:
1. **No Horizontal Scrolling**
   - **Expected**: All content fits within viewport

2. **Content Width Constraint**
   - **Expected**: Content doesn't stretch too wide, maintains max-width

3. **Text Readability**
   - **Expected**: Font sizes remain appropriate, line lengths not too long

**Screenshot**: Take screenshot and save as `desktop-1920px.png`

---

### Phase 3: Mobile Device Testing (Optional but Recommended)

If you have access to physical devices:

#### iOS Testing (iPhone/iPad)
1. Connect device to same network as dev server
2. Find your computer's local IP (e.g., 192.168.1.100)
3. Open Safari on device
4. Navigate to http://[YOUR_IP]:5173
5. Perform upload and scan tests
6. Test touch interactions
7. Check for any iOS-specific issues

#### Android Testing
1. Connect device to same network
2. Open Chrome on device
3. Navigate to http://[YOUR_IP]:5173
4. Perform upload and scan tests
5. Test touch interactions
6. Check for any Android-specific issues

---

## Common Issues to Watch For

### Browser-Specific Issues

**Safari**:
- [ ] WebP format support (may not work on older versions)
- [ ] CSS animations may behave differently
- [ ] File input styling may differ

**Firefox**:
- [ ] Progress bar animations may render differently
- [ ] File upload dialog may look different

**Edge**:
- [ ] Generally similar to Chrome (Chromium-based)
- [ ] Check for any Edge-specific quirks

### CSS Issues to Document

1. **Layout Problems**:
   - Elements overlapping
   - Incorrect spacing
   - Alignment issues

2. **Animation Issues**:
   - Choppy animations
   - Animations not playing
   - Timing issues

3. **Typography Issues**:
   - Font rendering differences
   - Text overflow
   - Line height problems

4. **Color/Contrast Issues**:
   - Colors displaying differently
   - Contrast too low
   - Theme inconsistencies

---

## Recording Results

### For Each Test:
1. Mark Pass/Fail in QA_REPORT_SPRINT3.md
2. Add detailed notes for any failures
3. Take screenshots of issues
4. Copy console errors if any
5. Document workarounds if found

### Screenshot Naming Convention:
- `[browser]-[test]-[status].png`
- Example: `chrome-upload-pass.png`
- Example: `safari-animation-fail.png`

### Console Error Documentation:
When recording console errors, include:
- Error message
- Stack trace
- File and line number
- Steps to reproduce

---

## Completion Checklist

### Desktop Browser Testing
- [ ] Chrome - All tests completed
- [ ] Edge - All tests completed
- [ ] Safari - All tests completed
- [ ] Firefox - All tests completed

### Responsive Design Testing
- [ ] 320px (Mobile) - All tests completed
- [ ] 768px (Tablet) - All tests completed
- [ ] 1024px (Desktop) - All tests completed
- [ ] 1920px (Large Desktop) - All tests completed

### Documentation
- [ ] QA_REPORT_SPRINT3.md filled out completely
- [ ] All screenshots captured and saved
- [ ] Known issues documented
- [ ] Browser-specific workarounds noted

### Final Review
- [ ] All test results reviewed
- [ ] Critical issues flagged
- [ ] Report signed off

---

## Tips for Effective Testing

1. **Test Systematically**: Complete all tests for one browser before moving to the next
2. **Clear Cache**: Always clear cache between browser tests
3. **Take Notes**: Document everything, even minor observations
4. **Screenshot Everything**: Visual evidence is invaluable
5. **Test Edge Cases**: Try unusual inputs and interactions
6. **Check Console**: Always monitor console for errors
7. **Test Real Devices**: Emulation is good, but real devices are better
8. **Document Workarounds**: If you find a fix, document it

---

## Need Help?

If you encounter issues during testing:
1. Check the console for error messages
2. Verify backend server is running
3. Check network tab for failed requests
4. Try clearing cache and reloading
5. Test in incognito/private mode
6. Consult the design document for expected behavior

---

## Next Steps After Testing

Once testing is complete:
1. Review QA_REPORT_SPRINT3.md
2. Prioritize any issues found
3. Create bug tickets for critical issues
4. Share report with development team
5. Plan fixes for next sprint if needed

