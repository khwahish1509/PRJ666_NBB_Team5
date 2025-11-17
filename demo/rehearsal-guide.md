# Demo Rehearsal Guide

This guide helps the team practice and perfect the DermoScanner demo presentation.

## Rehearsal Schedule

### First Rehearsal (Full Run-Through)
**Goal**: Complete the demo from start to finish, identify issues  
**Duration**: 30 minutes (7 min demo + 23 min feedback)

**Agenda**:
1. Set up demo environment (5 min)
2. Run through complete demo (7 min)
3. Team feedback session (15 min)
4. Identify improvements needed (3 min)

### Second Rehearsal (Refinement)
**Goal**: Implement improvements, practice transitions  
**Duration**: 30 minutes

**Agenda**:
1. Quick setup check (2 min)
2. Run through demo with improvements (7 min)
3. Focus on weak sections (10 min)
4. Practice Q&A responses (8 min)
5. Final adjustments (3 min)

### Final Rehearsal (Polish)
**Goal**: Perfect timing, smooth execution  
**Duration**: 20 minutes

**Agenda**:
1. Final setup verification (2 min)
2. Complete demo run (7 min)
3. Time each section precisely (5 min)
4. Confirm backup plans (3 min)
5. Team confidence check (3 min)

## Rehearsal Checklist

### Before Each Rehearsal
- [ ] All team members present
- [ ] Demo environment set up and tested
- [ ] Timer ready to track sections
- [ ] Demo script printed or accessible
- [ ] Feedback forms ready
- [ ] Recording device ready (optional)

### During Rehearsal
- [ ] Designate a timekeeper
- [ ] Record timing for each section
- [ ] Note any technical issues
- [ ] Observe audience perspective
- [ ] Take notes on improvements

### After Rehearsal
- [ ] Review timing for each section
- [ ] Discuss what worked well
- [ ] Identify areas for improvement
- [ ] Assign action items
- [ ] Schedule next rehearsal

## Speaker Practice Guide

### Project Manager (Introduction - 1 minute)

**Key Points to Practice**:
- Confident opening statement
- Clear persona introduction
- Compelling problem statement
- Smooth handoff to next speaker

**Practice Script**:
> "Good [morning/afternoon]. Today we're presenting DermoScanner, our AI-powered skin health monitoring application. Meet Sarah Thompson—a 32-year-old teacher who noticed a new mole and faces a 3-4 week wait for a dermatologist. Let's see how DermoScanner helps her."

**Self-Check**:
- [ ] Spoke clearly and confidently
- [ ] Maintained eye contact
- [ ] Completed within 1 minute
- [ ] Smooth transition to next speaker

### Frontend Developer (Upload & Scan - 2 minutes)

**Key Points to Practice**:
- Smooth navigation through UI
- Clear explanation of features
- Proper timing with loading spinner
- Highlighting key UI elements

**Practice Actions**:
1. Navigate to Scan page
2. Click upload button
3. Select sample image
4. Wait for 3-second processing
5. Point out result card features
6. Scroll to recommendations

**Self-Check**:
- [ ] All clicks were smooth and deliberate
- [ ] Explained features clearly
- [ ] Waited full 3 seconds for processing
- [ ] Highlighted all key elements
- [ ] Completed within 2 minutes

### Backend Developer (History & Backup - 2 minutes)

**Key Points to Practice**:
- Clear explanation of data persistence
- Demonstrating backup feature
- Showing MongoDB connection
- Explaining dual storage system

**Practice Actions**:
1. Navigate to Scan History
2. Show list of previous scans
3. Click Download Backup button
4. Show downloaded file
5. Open browser console
6. Point to MongoDB logs

**Self-Check**:
- [ ] Explained data persistence clearly
- [ ] Backup download worked smoothly
- [ ] Console logs were visible
- [ ] Explained technical concepts simply
- [ ] Completed within 2 minutes

### DevOps Engineer (Cloud Sync - 1 minute)

**Key Points to Practice**:
- Quick device switching
- Clear sync demonstration
- Deployment explanation
- Professional technical delivery

**Practice Actions**:
1. Show app on mobile device
2. Upload new scan on mobile
3. Switch to desktop
4. Refresh and show sync
5. Mention deployment details

**Self-Check**:
- [ ] Device switch was smooth
- [ ] Sync was clearly demonstrated
- [ ] Technical details were concise
- [ ] Completed within 1 minute

### QA Tester (Testing Summary - 1 minute)

**Key Points to Practice**:
- Confident presentation of metrics
- Clear browser compatibility info
- Professional closing
- Opening for questions

**Practice Script**:
> "We've tested DermoScanner rigorously—96% test pass rate across Chrome, Safari, Edge, and Firefox. Average scan time is 3.2 seconds, and we've verified functionality on devices from 320px mobile to 1920px desktop. DermoScanner is production-ready. Thank you, and we're happy to answer questions."

**Self-Check**:
- [ ] Presented metrics confidently
- [ ] Mentioned all key browsers
- [ ] Professional closing
- [ ] Completed within 1 minute

## Timing Practice

### Section Timing Targets

| Section | Speaker | Target Time | Acceptable Range |
|---------|---------|-------------|------------------|
| Introduction | PM | 1:00 | 0:45 - 1:15 |
| Upload & Scan | Frontend | 2:00 | 1:45 - 2:15 |
| History & Backup | Backend | 2:00 | 1:45 - 2:15 |
| Cloud Sync | DevOps | 1:00 | 0:45 - 1:15 |
| QA Summary | QA | 1:00 | 0:45 - 1:15 |
| **Total** | **All** | **7:00** | **6:30 - 7:30** |

### Timing Adjustment Strategies

**If Running Long** (>7:30):
- Skip showing downloaded JSON file (-15s)
- Skip mobile device demo (-30s)
- Shorten QA details (-20s)
- Reduce console log explanation (-15s)

**If Running Short** (<6:30):
- Add detail about recommendations (+20s)
- Show additional scan example (+30s)
- Explain backup/restore in detail (+30s)
- Demonstrate error handling (+20s)

## Transition Practice

### Smooth Handoffs

**PM to Frontend**:
> "Let me hand it over to [Name] to show how Sarah uses the app."

**Frontend to Backend**:
> "Now let's see how Sarah's scan history is managed. [Name], can you show us?"

**Backend to DevOps**:
> "Let's see how this works across different devices. [Name]?"

**DevOps to QA**:
> "Finally, let's talk about quality assurance. [Name]?"

### Practice Tips
- Make eye contact during handoff
- Use speaker's name
- Gesture toward next speaker
- Step back from screen/podium
- Next speaker should acknowledge and begin immediately

## Q&A Rehearsal

### Practice Questions

**Q1**: "How accurate is the AI model?"  
**A**: "Currently we're using a mock AI to demonstrate workflow. In production, we'd integrate a trained model with clinical validation. The mock helps us perfect the user experience first."

**Q2**: "Is the data HIPAA compliant?"  
**A**: "We use HTTPS, JWT authentication, and MongoDB encryption. For full HIPAA compliance in production, we'd add audit logging and additional access controls."

**Q3**: "What happens offline?"  
**A**: "The app stores scans in localStorage for offline access. When reconnected, it automatically syncs to MongoDB. Failed operations are queued for retry."

**Q4**: "Can users share with doctors?"  
**A**: "Yes! The backup download creates a JSON file users can email to healthcare providers. Future sprints will add PDF export and direct sharing."

**Q5**: "How do you handle false positives?"  
**A**: "We emphasize DermoScanner is a screening tool, not diagnostic. Every result includes a recommendation to consult healthcare professionals. We never tell users to skip medical care."

### Q&A Practice Format
1. One person asks question
2. Designated speaker answers
3. Team provides feedback on answer
4. Refine answer if needed
5. Practice until confident

## Technical Rehearsal

### Equipment Check
- [ ] Laptop connects to projector
- [ ] Screen resolution is correct
- [ ] Audio is working (if needed)
- [ ] Backup laptop is ready
- [ ] Mobile device is charged
- [ ] Internet connection is stable

### Demo Environment Check
- [ ] App loads correctly
- [ ] Login works with demo credentials
- [ ] Sample images upload successfully
- [ ] AI processing completes in 3 seconds
- [ ] Results display correctly
- [ ] History shows all scans
- [ ] Backup download works
- [ ] MongoDB connection is active
- [ ] Mobile view displays properly

### Backup System Check
- [ ] Backup video plays correctly
- [ ] Backup laptop has demo loaded
- [ ] Mobile hotspot is configured
- [ ] USB drive has backup files
- [ ] Emergency contacts are available

## Feedback Form

Use this form after each rehearsal:

### Overall Impression
- [ ] Excellent  [ ] Good  [ ] Needs Work

### Timing
- Total time: _____ minutes
- Too long?  [ ] Yes  [ ] No
- Too short?  [ ] Yes  [ ] No

### Content
- Clear and understandable?  [ ] Yes  [ ] No
- Compelling story?  [ ] Yes  [ ] No
- Technical details appropriate?  [ ] Yes  [ ] No

### Delivery
- Confident speakers?  [ ] Yes  [ ] No
- Smooth transitions?  [ ] Yes  [ ] No
- Good pacing?  [ ] Yes  [ ] No

### Technical Execution
- All features worked?  [ ] Yes  [ ] No
- Any errors or glitches?  [ ] Yes  [ ] No
- Backup plans clear?  [ ] Yes  [ ] No

### Improvements Needed
1. _________________________________
2. _________________________________
3. _________________________________

### Strengths to Maintain
1. _________________________________
2. _________________________________
3. _________________________________

## Confidence Building

### Individual Preparation
- [ ] Read demo script 3+ times
- [ ] Practice your section alone
- [ ] Memorize key talking points
- [ ] Prepare for anticipated questions
- [ ] Visualize successful demo

### Team Preparation
- [ ] Complete 3 full rehearsals
- [ ] Practice with actual equipment
- [ ] Test all backup plans
- [ ] Build team chemistry
- [ ] Celebrate preparation efforts

### Mental Preparation
- Get good sleep night before
- Eat a healthy meal before demo
- Arrive early to set up
- Do breathing exercises if nervous
- Remember: you know this material well

## Day-Of Checklist

### 1 Hour Before
- [ ] Complete technical setup
- [ ] Run through demo once
- [ ] Verify all features work
- [ ] Review timing targets
- [ ] Check backup systems

### 30 Minutes Before
- [ ] Team huddle and pep talk
- [ ] Final equipment check
- [ ] Review Q&A responses
- [ ] Confirm speaker order
- [ ] Take deep breaths

### 5 Minutes Before
- [ ] Final confidence check
- [ ] Positive team affirmation
- [ ] Ready to present
- [ ] Smile and relax

## Success Indicators

You're ready when:
- ✅ Demo completes in 6:30-7:30 minutes consistently
- ✅ All speakers are confident in their sections
- ✅ Transitions are smooth and natural
- ✅ Technical execution is flawless
- ✅ Q&A responses are prepared
- ✅ Backup plans are tested
- ✅ Team feels confident and excited

---

**Remember**: Practice makes perfect. The more you rehearse, the more confident and natural the demo will feel. You've got this! 🚀
