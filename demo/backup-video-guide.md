# Backup Video Recording Guide

This guide explains how to record a backup video of the complete DermoScanner demo.

## Purpose

The backup video serves as a safety net in case of technical difficulties during the live demo. It ensures the presentation can continue even if:
- Internet connection fails
- App crashes or becomes unresponsive
- Database connection is lost
- Hardware issues occur
- Live demo encounters unexpected errors

## Recording Requirements

### Video Specifications
- **Duration**: 7 minutes (match live demo timing)
- **Resolution**: 1920x1080 (Full HD) minimum
- **Frame Rate**: 30 fps minimum
- **Format**: MP4 (H.264 codec for compatibility)
- **Audio**: Clear narration with minimal background noise
- **File Size**: Under 500MB for easy storage/transfer

### Content Requirements
- Follow the exact demo script (demo/script.md)
- Include all 5 sections (Introduction, Upload, History, Sync, QA)
- Show all key features working correctly
- Include persona introduction (Sarah Thompson)
- Display clear, readable UI elements
- Demonstrate smooth workflow without errors

## Recording Tools

### Option 1: OBS Studio (Recommended)
**Pros**: Free, professional quality, cross-platform  
**Download**: https://obsproject.com/

**Setup**:
1. Install OBS Studio
2. Create new scene
3. Add "Display Capture" or "Window Capture" source
4. Add "Audio Input Capture" for microphone
5. Set output to 1920x1080, 30fps, MP4 format
6. Configure bitrate: 5000-8000 kbps

### Option 2: macOS QuickTime Player
**Pros**: Built-in, simple, no installation  
**Cons**: Limited editing features

**Setup**:
1. Open QuickTime Player
2. File → New Screen Recording
3. Click options to select microphone
4. Click record button
5. Select full screen or specific window

### Option 3: Windows Game Bar
**Pros**: Built-in Windows 10/11, easy to use  
**Cons**: Limited customization

**Setup**:
1. Press Win + G to open Game Bar
2. Click "Capture" widget
3. Click record button (or Win + Alt + R)
4. Speak clearly into microphone

### Option 4: Zoom Recording
**Pros**: Familiar interface, good quality  
**Cons**: Requires Zoom account

**Setup**:
1. Start Zoom meeting (just yourself)
2. Share screen
3. Click "Record" button
4. Choose "Record on this Computer"
5. End meeting to save recording

## Recording Process

### Pre-Recording Checklist
- [ ] Complete all items in demo-testing-checklist.md
- [ ] Verify app is working perfectly
- [ ] Test microphone audio quality
- [ ] Close unnecessary applications
- [ ] Disable notifications (Do Not Disturb mode)
- [ ] Set browser zoom to 100%
- [ ] Clear desktop of sensitive information
- [ ] Have demo script visible (second monitor or printed)
- [ ] Practice narration at least once

### Recording Steps

#### 1. Set Up Recording Environment
- Find quiet location with minimal background noise
- Use good quality microphone (or headset)
- Ensure good lighting (if showing face)
- Close doors and windows to reduce noise
- Inform others not to interrupt

#### 2. Prepare Browser and App
- Open app in full-screen browser window
- Log in to Sarah's demo account
- Have all tabs ready (scan, history, etc.)
- Pre-load sample images in file explorer
- Open browser console (for MongoDB logs)
- Test one scan to warm up the app

#### 3. Start Recording
- Launch recording software
- Select full screen or browser window
- Enable microphone audio
- Do a 3-2-1 countdown
- Start with title slide or app homepage

#### 4. Follow Demo Script
- Speak clearly and at moderate pace
- Follow demo/script.md exactly
- Maintain consistent energy throughout
- Pause briefly between sections
- Show all key features working
- Keep timing to 7 minutes

#### 5. End Recording
- Conclude with thank you message
- Pause for 2 seconds
- Stop recording
- Save file immediately

### Narration Tips

**Voice and Delivery**:
- Speak clearly and confidently
- Use moderate pace (not too fast or slow)
- Vary tone to maintain interest
- Smile while speaking (improves tone)
- Avoid filler words (um, uh, like)

**Script Adherence**:
- Follow demo script closely
- Don't improvise too much
- Keep timing consistent
- Transition smoothly between sections
- Maintain professional tone

**Technical Narration**:
- Explain what you're clicking
- Describe what's happening on screen
- Point out key features verbally
- Mention loading times and delays
- Highlight successful outcomes

## Post-Recording

### Review and Quality Check
- [ ] Watch entire video start to finish
- [ ] Verify audio is clear and audible
- [ ] Check video quality is sharp and readable
- [ ] Confirm all features are demonstrated
- [ ] Verify timing is approximately 7 minutes
- [ ] Look for any errors or glitches
- [ ] Check for sensitive information in frame

### Editing (Optional)
If minor edits are needed:
- Use iMovie (Mac), Windows Video Editor, or DaVinci Resolve (free)
- Trim beginning/end if needed
- Add title slide at start
- Add "Thank You" slide at end
- Adjust audio levels if needed
- Export in MP4 format

### File Management
- [ ] Save original recording (unedited)
- [ ] Save edited version (if applicable)
- [ ] Name file: `dermoscanner-demo-backup-[date].mp4`
- [ ] Store on laptop hard drive
- [ ] Copy to USB drive (backup)
- [ ] Upload to cloud storage (Google Drive, Dropbox)
- [ ] Test playback on demo laptop
- [ ] Verify file size is reasonable (<500MB)

## Using the Backup Video

### When to Use
Use the backup video if:
- Internet connection is lost and cannot be restored
- App crashes repeatedly
- Database connection fails
- Live demo encounters critical errors
- Hardware issues prevent live demonstration

### How to Use
1. Calmly explain: "We're experiencing technical difficulties. Let me show you a recording of the demo."
2. Open video file (have it ready on desktop)
3. Play video in full screen
4. Mute your microphone (video has narration)
5. Let video play through
6. Resume live presentation after video ends

### Presentation Tips
- Don't apologize excessively
- Remain calm and professional
- Explain that the video shows the same features
- Answer questions after video ends
- Offer to show live demo later if possible

## Multiple Takes

### When to Re-Record
Re-record if:
- Audio quality is poor
- Video has visible errors or glitches
- Timing is significantly off (>30 seconds)
- Important features are missing
- Narration is unclear or confusing

### Best Practices
- Record 2-3 takes to have options
- Take breaks between recordings
- Review each take before deciding
- Choose the best overall take
- Keep all versions until demo is complete

## Storage and Access

### Primary Storage
- **Location**: Laptop desktop or Documents folder
- **Filename**: `dermoscanner-demo-backup.mp4`
- **Access**: Quick access during demo

### Backup Storage
- **USB Drive**: Keep in laptop bag
- **Cloud Storage**: Google Drive, Dropbox, OneDrive
- **Team Shared**: Share with all team members
- **Mobile Device**: Copy to phone as last resort

### Pre-Demo Verification
- [ ] Video file is on demo laptop
- [ ] Video file is on backup laptop
- [ ] Video file is on USB drive
- [ ] Video plays without errors
- [ ] Audio is clear and audible
- [ ] Video is in easily accessible location

## Troubleshooting

### Video Won't Play
- Try different media player (VLC, Windows Media Player)
- Check file isn't corrupted
- Use backup copy from USB drive
- Convert to different format if needed

### Audio Issues
- Check laptop volume is turned up
- Verify audio output device is correct
- Test with headphones
- Use backup video with better audio

### File Too Large
- Compress video using HandBrake (free tool)
- Reduce resolution to 1280x720 if needed
- Lower bitrate to 3000-4000 kbps
- Split into multiple parts if necessary

## Sample Recording Script

Here's a condensed script for recording:

```
[0:00 - 0:30] Introduction
"Hello, I'm [Name] from the DermoScanner team. Today I'll show you our AI-powered skin health monitoring application. Meet Sarah Thompson, a 32-year-old teacher who recently noticed a new mole and wants quick guidance before her dermatologist appointment."

[0:30 - 2:00] Upload & Scan
"Sarah opens DermoScanner and navigates to the Scan page. She uploads a photo of her mole... The AI analyzes the image... And in 3 seconds, she receives her result: Benign - Low Risk with 87% confidence. Below, she sees personalized health recommendations."

[2:00 - 4:00] History & Backup
"All of Sarah's scans are automatically saved to her history. She can track changes over time, download a backup with one click, and her data is synced to the cloud for safety."

[4:00 - 5:30] Cloud Sync
"The app works seamlessly across devices. Sarah's data syncs automatically through MongoDB Atlas, so she can access her history from any device."

[5:30 - 7:00] QA & Conclusion
"We've tested DermoScanner on all major browsers and devices with a 96% test pass rate. It's fast, reliable, and ready for production. Thank you for watching."
```

---

**Last Updated**: [Date]  
**Maintained By**: DermoScanner Team
