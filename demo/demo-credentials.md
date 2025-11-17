# Demo User Credentials

This document contains test user account credentials for the DermoScanner demo.

⚠️ **SECURITY WARNING**: These credentials are for demo/testing purposes only. Never use these in production or commit real user credentials to version control.

---

## Demo User Account

### Primary Demo User (Sarah Thompson)

**Email**: `sarah.thompson.demo@dermoscanner.com`  
**Password**: `DemoPass2024!`  
**User ID**: `demo-user-sarah-001`

**Profile Information**:
- Name: Sarah Thompson
- Age: 32
- Role: Patient/End User
- Account Created: [Date of demo setup]
- Scan History: Pre-seeded with 5 sample scans

**Purpose**: This account represents our persona "Sarah" and should be used for the main demo flow.

---

## Additional Test Accounts

### Test User 2 (New User Experience)

**Email**: `test.user@dermoscanner.com`  
**Password**: `TestPass2024!`  
**User ID**: `demo-user-test-002`

**Profile Information**:
- Name: Test User
- Scan History: Empty (for demonstrating first-time user experience)

**Purpose**: Use this account to show the onboarding experience for new users.

---

### Test User 3 (Power User)

**Email**: `power.user@dermoscanner.com`  
**Password**: `PowerPass2024!`  
**User ID**: `demo-user-power-003`

**Profile Information**:
- Name: Power User
- Scan History: Pre-seeded with 20+ scans over 3 months

**Purpose**: Use this account to demonstrate extensive scan history and tracking over time.

---

## Admin/Developer Account (Optional)

### Admin User

**Email**: `admin.demo@dermoscanner.com`  
**Password**: `AdminPass2024!`  
**User ID**: `demo-admin-001`

**Purpose**: For backend testing and database verification during demo (not shown to audience).

---

## Creating Demo Accounts

### Option 1: Manual Registration
1. Navigate to the registration page: `https://[your-app-url]/register`
2. Fill in the form with demo credentials
3. Verify email (if email verification is enabled, use a test email service)
4. Log in and seed data manually

### Option 2: Database Seed Script
Use the provided seed script to create all demo accounts automatically:

```bash
cd dermoscanners/server
node demo/seed-demo-users.js
```

This script will:
- Create all demo user accounts
- Hash passwords securely
- Pre-populate scan history for Sarah's account
- Verify accounts are created successfully

### Option 3: API Calls
Use the API directly to create accounts:

```bash
# Create Sarah's account
curl -X POST https://[your-app-url]/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Thompson",
    "email": "sarah.thompson.demo@dermoscanner.com",
    "password": "DemoPass2024!",
    "age": 32
  }'
```

---

## Pre-Seeded Scan History for Sarah

Sarah's account should have the following scan history pre-loaded:

### Scan 1 (2 weeks ago)
- **Date**: [Current Date - 14 days]
- **Result**: Benign
- **Confidence**: 87%
- **Notes**: "New mole on left forearm - first scan"

### Scan 2 (1 week ago)
- **Date**: [Current Date - 7 days]
- **Result**: Benign
- **Confidence**: 89%
- **Notes**: "Follow-up scan - no visible changes"

### Scan 3 (5 days ago)
- **Date**: [Current Date - 5 days]
- **Result**: Benign
- **Confidence**: 85%
- **Notes**: "Checking after sun exposure"

### Scan 4 (3 days ago)
- **Date**: [Current Date - 3 days]
- **Result**: Suspicious
- **Confidence**: 72%
- **Notes**: "Slight color change noticed - scheduling doctor appointment"

### Scan 5 (Today)
- **Date**: [Current Date]
- **Result**: Benign
- **Confidence**: 88%
- **Notes**: "Pre-appointment scan for doctor records"

**Purpose**: This history shows Sarah's journey from initial concern to ongoing monitoring, demonstrating the app's value for tracking changes over time.

---

## Demo Login Flow

### Before Demo Starts
1. Clear browser cache and cookies
2. Navigate to login page
3. Have credentials ready in a text file (don't type during demo)
4. Test login to ensure account works

### During Demo
**Option A: Skip Login (Recommended)**
- Log in before demo starts
- Keep session active
- Jump straight to scan functionality

**Option B: Show Login (If Time Permits)**
- Demonstrate login process
- Use autofill or paste credentials (don't type)
- Show successful authentication
- Navigate to dashboard

### After Demo
- Log out of demo account
- Clear any sensitive data from browser
- Reset demo account if needed

---

## Password Security

### Password Requirements
The demo passwords meet the following criteria:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### Changing Demo Passwords
If you need to change demo passwords:

```bash
# Using the API
curl -X PATCH https://[your-app-url]/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [JWT_TOKEN]" \
  -d '{
    "currentPassword": "DemoPass2024!",
    "newPassword": "NewDemoPass2024!"
  }'
```

Or update directly in the database (for testing only):
```javascript
// In MongoDB shell or seed script
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash('NewDemoPass2024!', 10);
await User.updateOne(
  { email: 'sarah.thompson.demo@dermoscanner.com' },
  { password: hashedPassword }
);
```

---

## Troubleshooting

### Can't Log In
- Verify account exists in database
- Check password is correct (case-sensitive)
- Ensure email is exact match
- Clear browser cache and try again
- Check server logs for authentication errors

### Account Locked
If account gets locked after failed login attempts:
```bash
# Reset account lock status
node dermoscanners/server/scripts/unlock-user.js sarah.thompson.demo@dermoscanner.com
```

### Scan History Not Showing
- Verify scans are associated with correct userId
- Check MongoDB connection is active
- Run seed script again to repopulate data
- Check browser console for API errors

---

## Security Best Practices

### For Demo Environment
✅ **DO**:
- Use clearly marked demo credentials
- Create separate demo database
- Use test email addresses
- Reset demo data after each presentation
- Keep demo credentials in secure location

❌ **DON'T**:
- Use real user data
- Use production database
- Share demo credentials publicly
- Commit credentials to public repositories
- Reuse demo passwords for real accounts

### For Production
When moving to production:
- Delete all demo accounts
- Use strong, unique passwords
- Implement email verification
- Add rate limiting on login attempts
- Enable two-factor authentication
- Use environment variables for sensitive data

---

## Demo Account Maintenance

### Before Each Demo
- [ ] Verify all demo accounts exist
- [ ] Test login for primary demo account (Sarah)
- [ ] Confirm scan history is populated
- [ ] Check that backup/restore works
- [ ] Clear any test data from previous demos

### After Each Demo
- [ ] Log out of all demo accounts
- [ ] Review and clean up any test data
- [ ] Reset scan history if needed
- [ ] Document any issues encountered
- [ ] Update credentials if compromised

### Monthly Maintenance
- [ ] Rotate demo passwords
- [ ] Verify database seed script works
- [ ] Update scan history dates to be recent
- [ ] Test all demo accounts
- [ ] Archive old demo data

---

## Quick Reference Card

Print this card and keep it handy during demos:

```
┌─────────────────────────────────────────────┐
│     DERMOSCANNER DEMO CREDENTIALS           │
├─────────────────────────────────────────────┤
│ Primary Demo User (Sarah Thompson)          │
│ Email: sarah.thompson.demo@dermoscanner.com │
│ Password: DemoPass2024!                     │
├─────────────────────────────────────────────┤
│ Demo URL: [Your App URL]                    │
│ Admin Panel: [Admin URL]                    │
├─────────────────────────────────────────────┤
│ Emergency Contact: [Team Lead Phone]        │
│ Backup Laptop: [Location]                   │
└─────────────────────────────────────────────┘
```

---

**Last Updated**: [Date]  
**Maintained By**: DermoScanner Team  
**Classification**: Demo/Testing Only - Not for Production Use
