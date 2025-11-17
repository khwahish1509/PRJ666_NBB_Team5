# DermoScanner Demo Materials

This directory contains all materials needed for the Sprint 3 demo presentation.

## Contents

### Documentation Files

- **script.md** - Complete 7-minute demo script with timing, speaker roles, and transitions
- **persona-card.md** - Detailed persona for Sarah Thompson (our demo user)
- **slides.md** - Presentation slide content and design guidelines
- **demo-credentials.md** - Test user account credentials for demo
- **demo-testing-checklist.md** - Pre-demo testing and verification checklist
- **backup-video-guide.md** - Instructions for recording backup demo video

### Scripts

- **seed-demo-users.js** - Node.js script to create demo users and populate scan history

### Assets

- **sample-images/** - Directory for demo scan images (benign, suspicious, malignant)

## Quick Start

### 1. Set Up Demo Data

Run the seed script to create demo users and populate scan history:

```bash
cd demo
node seed-demo-users.js
```

This will create:
- Sarah Thompson's account with 5 pre-populated scans
- Test User account with empty history
- Power User account with 20+ scans

### 2. Prepare Sample Images

Collect 3 sample images for the demo:
- `sample-images/benign-sample.jpg`
- `sample-images/suspicious-sample.jpg`
- `sample-images/malignant-sample.jpg`

See `sample-images/README.md` for guidance on sourcing appropriate images.

### 3. Review Demo Script

Read through `script.md` to familiarize yourself with:
- Demo flow and timing
- Speaker roles and transitions
- Technical setup requirements
- Anticipated questions and answers

### 4. Complete Testing Checklist

Work through `demo-testing-checklist.md` to verify:
- All features work correctly
- Demo data is populated
- Sample images upload successfully
- Timing is within 7-minute limit

### 5. Record Backup Video

Follow `backup-video-guide.md` to create a backup recording:
- Record complete 7-minute demo walkthrough
- Save in multiple locations (laptop, USB, cloud)
- Test playback before live demo

## Demo Credentials

**Primary Demo User (Sarah Thompson)**:
- Email: `sarah.thompson.demo@dermoscanner.com`
- Password: `DemoPass2024!`

See `demo-credentials.md` for complete list of test accounts.

⚠️ **Security Note**: These credentials are for demo purposes only. Never use in production.

## Demo Flow Overview

1. **Introduction** (1 min) - Introduce Sarah's persona and problem
2. **Upload & Scan** (2 min) - Demonstrate AI analysis workflow
3. **History & Backup** (2 min) - Show scan tracking and data backup
4. **Cloud Sync** (1 min) - Demonstrate cross-device synchronization
5. **QA Summary** (1 min) - Present testing results and metrics

Total: 7 minutes

## Speaker Roles

- **Project Manager** - Introduction and problem statement
- **Frontend Developer** - Upload and scan workflow
- **Backend Developer** - History and backup features
- **DevOps Engineer** - Cloud sync and deployment
- **QA Tester** - Testing results and quality assurance

## Pre-Demo Checklist

### 1 Hour Before Demo
- [ ] Deploy latest code to production
- [ ] Run seed script to populate demo data
- [ ] Test login with Sarah's credentials
- [ ] Verify all features work correctly
- [ ] Set up projector and audio
- [ ] Load backup video on laptop

### 30 Minutes Before Demo
- [ ] Complete full demo rehearsal
- [ ] Time each section
- [ ] Test all transitions
- [ ] Verify backup laptop is ready
- [ ] Set up mobile hotspot

### 15 Minutes Before Demo
- [ ] Final feature test (one complete scan)
- [ ] Verify MongoDB connection
- [ ] Check all browser tabs are ready
- [ ] Confirm team members are present
- [ ] Review anticipated questions

## Backup Plans

### If Internet Fails
1. Switch to mobile hotspot
2. If still no connection, play backup video
3. Continue with slides and verbal explanation

### If App Crashes
1. Refresh page and retry once
2. Switch to backup laptop
3. If both fail, play backup video

### If Demo Runs Long
1. Skip showing downloaded JSON file
2. Skip mobile device demo
3. Shorten QA summary

## Success Criteria

- ✅ Demo completes within 7-minute time limit
- ✅ All features work without errors
- ✅ Audience understands user value
- ✅ Questions answered confidently
- ✅ Persona story resonates
- ✅ Technical execution is smooth

## Post-Demo Actions

- [ ] Collect audience feedback
- [ ] Document any issues encountered
- [ ] Update demo materials based on lessons learned
- [ ] Archive demo recording
- [ ] Clean up demo data

## Resources

### Internal Links
- Main README: `../README.md`
- QA Report: `../dermoscanners/QA_REPORT_SPRINT3.md`
- Testing Guide: `../dermoscanners/TESTING_GUIDE.md`

### External Resources
- DermoScanner Live Demo: [Your App URL]
- GitHub Repository: [Your Repo URL]
- Project Documentation: [Your Docs URL]

## Contact

For questions about demo materials:
- **Team Lead**: [Name] - [Email]
- **Technical Contact**: [Name] - [Email]

## Version History

- **v1.0** - Initial demo materials created for Sprint 3
- **Last Updated**: [Date]

---

**Note**: This demo represents Sprint 3 deliverables. For the most current version of the application, see the main project README.
