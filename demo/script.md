# DermoScanner Sprint 3 Demo Script

**Total Duration**: 7 minutes  
**Demo Date**: [To be scheduled]  
**Audience**: Stakeholders, instructors, and peers

---

## Demo Overview

This demo showcases the complete AI-powered skin lesion scanning workflow implemented in Sprint 3, featuring mock AI integration, real-time result visualization, persistent data storage, cloud synchronization, and cross-device compatibility.

---

## Persona: Sarah Thompson

**Age**: 32  
**Occupation**: Elementary School Teacher  
**Location**: Toronto, ON  
**Tech Comfort**: Moderate (uses smartphone daily, comfortable with apps)

**Background Story**:  
Sarah noticed a new mole on her left forearm about two weeks ago. As someone who spends time outdoors during recess and field trips, she's concerned about sun exposure. She wants to check if the mole is concerning before scheduling a dermatologist appointment, which typically has a 3-4 week wait time. Sarah values quick, actionable health information and wants to track any changes over time.

**Pain Points**:
- Long wait times for dermatologist appointments
- Uncertainty about whether a skin change requires immediate attention
- No easy way to track skin changes over time
- Concerns about losing health records if switching devices

---

## Demo Flow

### **[0:00 - 1:00] Introduction & Problem Statement**
**Speaker**: Project Manager  
**Duration**: 1 minute

**Script**:
> "Good [morning/afternoon], everyone. Today we're excited to show you DermoScanner, our AI-powered skin health monitoring application.
>
> Meet Sarah Thompson. She's a 32-year-old teacher who recently noticed a new mole on her arm. Like many Canadians, she faces a common problem: dermatologist appointments can take weeks to schedule, and she's unsure if her concern warrants immediate attention.
>
> Sarah needs a solution that can provide quick, preliminary guidance while she waits for her appointment. Let's see how DermoScanner helps her."

**Slide 1**: Title slide with DermoScanner logo  
**Slide 2**: Persona card showing Sarah's photo, background, and pain points  
**Slide 3**: Problem statement with statistics (e.g., "Average wait time for dermatologist: 3-4 weeks")

**Transition Cue**: "Let me hand it over to [Frontend Developer] to show how Sarah uses the app."

---

### **[1:00 - 3:00] Upload & Scan Workflow**
**Speaker**: Frontend Developer  
**Duration**: 2 minutes

**Script**:
> "Thanks! Sarah opens DermoScanner on her phone and navigates to the Scan page. The interface is clean and intuitive—she simply clicks 'Upload Image' and selects a photo of her mole that she took earlier.
>
> [ACTION: Click 'Choose File' and select benign-sample.jpg]
>
> Once she uploads the image, our AI model begins analyzing it. You'll notice a loading spinner with the message 'Analyzing your scan...' This simulates the 3-second processing time of a real AI model.
>
> [WAIT: 3 seconds for processing]
>
> And there we go! The result card appears with a classification of 'Benign - Low Risk' and an 87% confidence score. The color-coded badge makes it immediately clear—green means low risk.
>
> Below the result, Sarah sees the Recommendation Panel with personalized health tips based on her scan result. In this case, she's advised to continue regular skin monitoring, use SPF 30+ sunscreen daily, and schedule an annual dermatology checkup.
>
> This gives Sarah peace of mind while she waits for her appointment."

**Actions**:
1. Navigate to `/scan` page
2. Click "Choose File" button
3. Select `demo/sample-images/benign-sample.jpg`
4. Click "Analyze Scan" button
5. Show loading spinner (3 seconds)
6. Point to result card with classification and confidence meter
7. Scroll to recommendation panel
8. Highlight the 3 health tips displayed

**Slide 4**: Screenshot of Scan page with upload button  
**Slide 5**: Screenshot of result card with annotations pointing to key features

**Transition Cue**: "Now let's see how Sarah's scan history is managed. [Backend Developer], can you show us?"

---

### **[3:00 - 5:00] Scan History & Backup**
**Speaker**: Backend Developer  
**Duration**: 2 minutes

**Script**:
> "Absolutely. One of Sarah's concerns was tracking changes over time. DermoScanner automatically saves every scan to her history.
>
> [ACTION: Navigate to Scan History page]
>
> Here you can see all of Sarah's previous scans listed in reverse chronological order—newest first. Each entry shows the classification, confidence score, and timestamp.
>
> Now, what if Sarah switches phones or clears her browser data? We've got her covered with our backup and restore feature.
>
> [ACTION: Click 'Download Backup' button]
>
> With one click, Sarah can download all her scan history as a JSON file. This file is stored locally on her device and can be uploaded later to restore her complete history.
>
> [ACTION: Show downloaded JSON file in file explorer]
>
> But we don't stop there. Behind the scenes, every scan is also saved to MongoDB Atlas, our cloud database. This means Sarah's data is backed up automatically and accessible from any device.
>
> [ACTION: Open browser console and show MongoDB connection logs]
>
> You can see here in the console that we're connected to MongoDB and syncing data in real-time. Even if Sarah loses her phone, her scan history is safe in the cloud."

**Actions**:
1. Click "Scan History" in navigation menu
2. Show list of previous scans with timestamps
3. Click "Download Backup" button
4. Show downloaded `dermoscanner-backup-[timestamp].json` file
5. Open browser DevTools console
6. Point to MongoDB connection status logs
7. Refresh page to demonstrate data persistence

**Slide 6**: Screenshot of Scan History page  
**Slide 7**: Diagram showing dual storage (localStorage + MongoDB)

**Transition Cue**: "Let's see how this works across different devices. [DevOps Engineer]?"

---

### **[5:00 - 6:00] Cloud Sync & Cross-Device Demo**
**Speaker**: DevOps Engineer  
**Duration**: 1 minute

**Script**:
> "Thanks! One of the key features we implemented is seamless cross-device synchronization.
>
> [ACTION: Open app on mobile device or responsive view]
>
> Here's DermoScanner on a mobile device. Notice that Sarah's scan history appears immediately—it's pulling from the same MongoDB database.
>
> [ACTION: Upload a new scan on mobile]
>
> Let's upload a new scan from the mobile device. The upload works perfectly, and the result appears just as smoothly as on desktop.
>
> [ACTION: Switch back to desktop and refresh]
>
> Now, if we switch back to the desktop and refresh, you'll see the new scan appears here too. That's the power of cloud synchronization—Sarah's data follows her wherever she goes.
>
> The app is fully deployed on Render with HTTPS, CORS configured correctly, and environment variables secured. It's production-ready."

**Actions**:
1. Open app on mobile device (or use browser responsive mode at 375px width)
2. Navigate to Scan History
3. Show same scans appear on mobile
4. Upload a new scan on mobile (suspicious-sample.jpg)
5. Switch back to desktop browser
6. Refresh page
7. Show new scan appears in history

**Slide 8**: Screenshot of mobile view  
**Slide 9**: Deployment architecture diagram (Render + MongoDB Atlas)

**Transition Cue**: "Finally, let's talk about quality assurance. [QA Tester]?"

---

### **[6:00 - 7:00] Testing & Quality Assurance**
**Speaker**: QA Tester  
**Duration**: 1 minute

**Script**:
> "Thanks! We've put DermoScanner through rigorous testing to ensure it works flawlessly for users like Sarah.
>
> We tested the app on Chrome, Edge, Safari, and Firefox—all major browsers. We also tested on devices ranging from 320px mobile screens to 1920px desktop monitors. Everything works consistently.
>
> [ACTION: Show QA report document]
>
> Our QA report shows we achieved a 96% test pass rate with 24 out of 25 tests passing. The one failing test was a file size validation issue that we've already prioritized for Sprint 4.
>
> We also measured performance: the average scan time is 3.2 seconds, page load time is 1.8 seconds, and our Lighthouse score is 92 out of 100.
>
> [ACTION: Show browser compatibility matrix]
>
> Most importantly, we tested the complete end-to-end workflow: upload, AI analysis, recommendation display, history save, and backup—all working seamlessly.
>
> Sarah can trust DermoScanner to give her reliable, fast results whenever she needs them."

**Actions**:
1. Open `dermoscanners/QA_REPORT_SPRINT3.md`
2. Scroll to test summary section
3. Point to browser compatibility matrix
4. Show performance metrics
5. Highlight 96% pass rate

**Slide 10**: QA report summary with test metrics  
**Slide 11**: Browser compatibility matrix  
**Slide 12**: Thank you slide with team names and contact info

**Closing Script**:
> "That's DermoScanner. We've built a complete AI-powered skin health monitoring solution that's fast, reliable, and accessible. Thank you for your time. We're happy to answer any questions."

---

## Speaker Roles & Assignments

| Section | Speaker | Duration | Key Responsibilities |
|---------|---------|----------|---------------------|
| Introduction | Project Manager | 1 min | Set context, introduce persona, state problem |
| Upload & Scan | Frontend Developer | 2 min | Demonstrate UI, show result card, explain recommendations |
| History & Backup | Backend Developer | 2 min | Show data persistence, backup feature, MongoDB sync |
| Cloud Sync | DevOps Engineer | 1 min | Demonstrate cross-device sync, deployment |
| QA & Testing | QA Tester | 1 min | Present test results, browser compatibility |

**Backup Presenter**: If any speaker is unavailable, the Project Manager can cover their section using the script.

---

## Timing Markers

- **0:00** - Start timer, begin introduction
- **1:00** - Transition to upload demo
- **3:00** - Transition to history demo
- **5:00** - Transition to cloud sync demo
- **6:00** - Transition to QA summary
- **7:00** - End demo, open for questions

**Time Management Tips**:
- If running behind, skip showing the downloaded JSON file (saves 15 seconds)
- If running ahead, add more detail about recommendation tips (adds 20 seconds)
- Keep console logs pre-opened to save time during demo

---

## Technical Setup Checklist

### Pre-Demo (30 minutes before)

- [ ] Deploy latest code to production (Render)
- [ ] Verify app is accessible at live URL
- [ ] Test upload functionality on production
- [ ] Seed database with demo data (Sarah's previous scans)
- [ ] Clear browser cache and localStorage
- [ ] Open all required tabs in browser
- [ ] Load sample images in file explorer
- [ ] Test mobile device or responsive mode
- [ ] Open QA report document
- [ ] Set up backup internet connection (mobile hotspot)
- [ ] Start screen recording as backup
- [ ] Test audio/video equipment

### Browser Tabs to Open

1. DermoScanner home page
2. Scan page
3. Scan History page
4. Browser DevTools console (for MongoDB logs)
5. QA report document
6. File explorer with sample images

### Equipment Needed

- Laptop with HDMI/display connection
- Mobile device (or browser responsive mode)
- Backup laptop with demo loaded
- Mobile hotspot for backup internet
- Presentation slides loaded
- Backup video ready to play

---

## Anticipated Questions & Answers

### Q1: "How accurate is the AI model?"
**A**: "Currently, we're using a mock AI endpoint to demonstrate the workflow. In production, we would integrate a trained model with clinical validation. The mock model helps us perfect the user experience before deploying real AI."

### Q2: "Is the data secure and HIPAA compliant?"
**A**: "Great question. We use HTTPS for all connections, JWT authentication for API access, and MongoDB Atlas with encryption at rest. For full HIPAA compliance in production, we would add additional audit logging and access controls."

### Q3: "What happens if the user is offline?"
**A**: "The app stores scans in localStorage immediately, so users can view their history offline. When they reconnect, the app automatically syncs to MongoDB. We also queue failed operations for retry."

### Q4: "Can users share their scan history with doctors?"
**A**: "Yes! The backup download feature creates a JSON file that users can email to their healthcare provider. In future sprints, we plan to add PDF export and direct sharing features."

### Q5: "How do you handle false positives/negatives?"
**A**: "We always emphasize that DermoScanner is a screening tool, not a diagnostic tool. Every result includes a recommendation to consult a healthcare professional. We never tell users to skip medical care."

### Q6: "What's the cost to run this in production?"
**A**: "MongoDB Atlas free tier supports up to 512MB storage, which is sufficient for thousands of scans. Render free tier handles the API. For scaling, we estimate $25-50/month for 10,000 active users."

### Q7: "Why did you choose MongoDB over PostgreSQL?"
**A**: "MongoDB's flexible schema works well for evolving scan data structures. We can easily add new fields (like image metadata or AI model versions) without migrations. Plus, MongoDB Atlas has excellent free tier support."

### Q8: "How long does it take to train the real AI model?"
**A**: "That's outside the scope of this sprint, but typically, training a skin lesion classifier requires 10,000+ labeled images and 24-48 hours on GPU hardware. We're focusing on the application infrastructure first."

---

## Backup Plan

### If Live Demo Fails

1. **Internet Connection Lost**:
   - Switch to mobile hotspot immediately
   - If still no connection, play backup video

2. **App Crashes or Errors**:
   - Refresh page and retry once
   - If error persists, switch to backup laptop
   - If both fail, play backup video

3. **Database Connection Issues**:
   - Demonstrate localStorage functionality only
   - Explain that cloud sync would work normally
   - Show MongoDB connection logs from earlier test

4. **Time Runs Over**:
   - Skip showing downloaded JSON file
   - Skip mobile device demo
   - Jump directly to QA summary

### Backup Video

- Pre-record complete 7-minute demo
- Store on laptop and USB drive
- Test video playback before demo
- Have video ready to play at any moment

---

## Post-Demo Actions

- [ ] Collect feedback from audience
- [ ] Note any questions that stumped the team
- [ ] Document any technical issues encountered
- [ ] Update demo script based on lessons learned
- [ ] Share recording with team for review
- [ ] Archive demo materials for future reference

---

## Success Criteria

- ✅ Demo completes within 7-minute time limit
- ✅ All features work without errors
- ✅ Audience understands user value proposition
- ✅ Questions answered confidently
- ✅ Persona story resonates with audience
- ✅ Technical execution is smooth
- ✅ Team coordination is seamless

---

**Last Updated**: [Date]  
**Version**: 1.0  
**Contact**: [Team Lead Email]
