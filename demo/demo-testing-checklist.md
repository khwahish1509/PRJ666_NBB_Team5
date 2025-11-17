# Demo Testing Checklist

Complete this checklist before the live demo to ensure everything works smoothly.

## Pre-Demo Setup (1 Hour Before)

### Environment Setup
- [ ] Deploy latest code to production (Render/Vercel)
- [ ] Verify app is accessible at live URL
- [ ] Check MongoDB Atlas connection is active
- [ ] Verify all environment variables are set correctly
- [ ] Clear browser cache and cookies
- [ ] Close unnecessary browser tabs and applications

### Demo Data Setup
- [ ] Run demo seed script: `node demo/seed-demo-users.js`
- [ ] Verify Sarah's account has 5 scans in history
- [ ] Verify Power User account has 20+ scans
- [ ] Verify Test User account has empty history
- [ ] Test login with Sarah's credentials
- [ ] Confirm scan history displays correctly

### Sample Images
- [ ] Collect 3 sample images (benign, suspicious, malignant)
- [ ] Place images in `demo/sample-images/` directory
- [ ] Test upload for each image (verify no errors)
- [ ] Verify images display correctly on result card
- [ ] Check images work on both desktop and mobile views


### Technical Setup
- [ ] Test projector/screen connection
- [ ] Verify screen resolution and aspect ratio
- [ ] Test audio (if using video backup)
- [ ] Charge laptop battery (or connect to power)
- [ ] Set up backup laptop with demo loaded
- [ ] Configure mobile hotspot as backup internet
- [ ] Disable notifications and auto-updates
- [ ] Set browser zoom to 100%

### Browser Configuration
- [ ] Open all required tabs in correct order
- [ ] Pre-load demo URL in multiple tabs
- [ ] Open browser DevTools console (for MongoDB logs)
- [ ] Bookmark key pages (scan, history, etc.)
- [ ] Test browser responsive mode (for mobile demo)
- [ ] Clear browser history and autofill data

## Feature Testing (30 Minutes Before)

### Authentication Flow
- [ ] Test login with Sarah's credentials
- [ ] Verify JWT token is generated
- [ ] Check session persists after page refresh
- [ ] Test logout functionality
- [ ] Verify protected routes require authentication

### Scan Upload & Analysis
- [ ] Upload benign sample image
- [ ] Verify loading spinner appears
- [ ] Confirm 3-second processing delay
- [ ] Check result card displays correctly
- [ ] Verify confidence meter shows percentage
- [ ] Confirm color-coding is correct (green for benign)
- [ ] Test with suspicious and malignant samples

### Recommendation Panel
- [ ] Verify recommendations load after result
- [ ] Check correct tips display for each risk level
- [ ] Test fallback message (if JSON fails to load)
- [ ] Verify smooth scroll to recommendations
- [ ] Check responsive layout on mobile

### Scan History
- [ ] Navigate to Scan History page
- [ ] Verify all 5 of Sarah's scans display
- [ ] Check scans are in reverse chronological order
- [ ] Verify timestamps are formatted correctly
- [ ] Test scroll functionality (if many scans)

### Backup & Restore
- [ ] Click "Download Backup" button
- [ ] Verify JSON file downloads successfully
- [ ] Open JSON file and verify structure
- [ ] Test "Upload Backup" functionality
- [ ] Verify scans restore correctly

### Cloud Synchronization
- [ ] Open browser console
- [ ] Verify MongoDB connection logs appear
- [ ] Upload a new scan
- [ ] Refresh page and verify scan persists
- [ ] Test on second device/browser
- [ ] Confirm cross-device sync works

### Cross-Device Testing
- [ ] Open app on mobile device (or responsive mode)
- [ ] Verify layout adapts correctly
- [ ] Test image upload on mobile
- [ ] Check scan history displays on mobile
- [ ] Verify touch interactions work
- [ ] Test at 320px, 768px, 1024px widths

## Performance Testing

### Speed Metrics
- [ ] Measure page load time (target: < 2 seconds)
- [ ] Measure scan processing time (target: ~3 seconds)
- [ ] Check API response times (target: < 500ms)
- [ ] Verify no lag or stuttering in UI
- [ ] Test with slow 3G network (if possible)

### Error Handling
- [ ] Test with invalid file format (should reject)
- [ ] Test with oversized file (>5MB, should reject)
- [ ] Test with no internet connection (should queue)
- [ ] Test with MongoDB disconnected (should fallback)
- [ ] Verify error messages are user-friendly

## Demo Flow Rehearsal

### Timing Test
- [ ] Run through complete demo script
- [ ] Time each section (should total ~7 minutes)
- [ ] Identify sections that can be shortened if needed
- [ ] Practice transitions between speakers
- [ ] Verify all features work in sequence

### Speaker Coordination
- [ ] Assign speaker roles (PM, Frontend, Backend, DevOps, QA)
- [ ] Practice handoffs between speakers
- [ ] Verify each speaker knows their section
- [ ] Test microphone/audio for each speaker
- [ ] Prepare backup if speaker is unavailable

### Audience Engagement
- [ ] Practice introducing Sarah's persona
- [ ] Rehearse key talking points
- [ ] Prepare answers to anticipated questions
- [ ] Test pacing and tone
- [ ] Verify demo tells a compelling story

## Backup Preparation

### Backup Video
- [ ] Record complete 7-minute demo walkthrough
- [ ] Save video in multiple formats (MP4, MOV)
- [ ] Store video on laptop and USB drive
- [ ] Test video playback (audio and video quality)
- [ ] Verify video is accessible without internet

### Backup Laptop
- [ ] Load demo on second laptop
- [ ] Test all features on backup laptop
- [ ] Sync demo credentials and data
- [ ] Verify backup laptop can connect to projector
- [ ] Keep backup laptop charged and ready

### Backup Internet
- [ ] Set up mobile hotspot on phone
- [ ] Test app connectivity via hotspot
- [ ] Verify hotspot has sufficient data
- [ ] Save hotspot credentials for quick access
- [ ] Test switching from WiFi to hotspot

## Documentation Review

### Demo Materials
- [ ] Review demo script (demo/script.md)
- [ ] Check persona card (demo/persona-card.md)
- [ ] Verify slides are complete (demo/slides.md)
- [ ] Print quick reference card with credentials
- [ ] Prepare QA report for display

### Presentation Slides
- [ ] Load slides in presentation software
- [ ] Test slide transitions and animations
- [ ] Verify all images and screenshots load
- [ ] Check font sizes are readable
- [ ] Test presenter mode (if using)

## Final Checks (15 Minutes Before)

### Last-Minute Verification
- [ ] Refresh app to ensure latest version
- [ ] Test one complete scan workflow
- [ ] Verify MongoDB connection is active
- [ ] Check all browser tabs are ready
- [ ] Confirm demo credentials are accessible
- [ ] Test projector display one more time

### Team Readiness
- [ ] All team members present and ready
- [ ] Roles and responsibilities confirmed
- [ ] Backup plans communicated
- [ ] Questions and answers reviewed
- [ ] Confidence level: High ✅

## Post-Demo Actions

### Immediate Follow-Up
- [ ] Collect feedback from audience
- [ ] Note any questions that were difficult to answer
- [ ] Document any technical issues encountered
- [ ] Save recording (if demo was recorded)
- [ ] Thank team members for their work

### Data Cleanup
- [ ] Log out of demo accounts
- [ ] Clear browser cache and cookies
- [ ] Reset demo data if needed
- [ ] Archive demo materials
- [ ] Update credentials if compromised

### Retrospective
- [ ] What went well?
- [ ] What could be improved?
- [ ] Were there any surprises?
- [ ] How was the timing?
- [ ] Did the story resonate with the audience?

## Emergency Procedures

### If Internet Fails
1. Switch to mobile hotspot immediately
2. If hotspot fails, play backup video
3. Explain technical difficulty calmly
4. Continue with slides and verbal explanation

### If App Crashes
1. Refresh page and retry once
2. If error persists, switch to backup laptop
3. If both fail, play backup video
4. Apologize and continue with presentation

### If Demo Runs Long
1. Skip showing downloaded JSON file (saves 15s)
2. Skip mobile device demo (saves 30s)
3. Shorten QA summary (saves 20s)
4. Jump directly to conclusion

### If Demo Runs Short
1. Add more detail about recommendations (adds 20s)
2. Show additional scan examples (adds 30s)
3. Demonstrate backup/restore in detail (adds 30s)
4. Open for questions early

## Success Criteria

- ✅ Demo completes within 7-minute time limit
- ✅ All features work without errors
- ✅ Audience understands user value proposition
- ✅ Questions answered confidently
- ✅ Persona story resonates with audience
- ✅ Technical execution is smooth
- ✅ Team coordination is seamless

---

**Checklist Completed By**: ___________________  
**Date**: ___________________  
**Time**: ___________________  
**Ready for Demo**: ☐ Yes  ☐ No (explain): ___________________
