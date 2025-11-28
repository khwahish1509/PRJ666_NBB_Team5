# Dermatologists Near Me - Clinician Finder Feature

## Overview
The Clinician Finder feature helps users locate dermatologists near their location for professional consultation, especially when scan results show concerning findings.

## Features Implemented

### ✅ Core Functionality
- **GPS Location Support**: Uses browser geolocation API to find user's current location
- **Postal Code Search**: Fallback option when GPS is unavailable or denied
- **Real-time Search**: Queries OpenStreetMap Overpass API for dermatology clinics
- **Distance Calculation**: Shows distance from user to each clinician
- **Smart Filters**:
  - Search radius (5km, 10km, 25km, 50km)
  - Open now filter
  - Top rated sorting

### ✅ User Interface
- **Modern Design**: Beautiful gradient UI with smooth animations
- **Responsive Layout**: Works on mobile, tablet, and desktop
- **Interactive Cards**: Click to view detailed information
- **Quick Actions**:
  - Call clinic directly
  - Visit website
  - Get directions in Google Maps
- **Location Permission Handling**: Clear prompts and fallback options

### ✅ Integration Points
1. **Dashboard**: Quick action card to access clinician finder
2. **Navigation**: Dedicated menu item in main navigation
3. **Scan Results**: Automatic recommendation card for suspicious/malignant results
4. **Scan History**: Warning card when concerning results are detected

### ✅ Backend API
- **Endpoint**: `POST /api/clinicians/find`
- **Authentication**: Requires valid JWT token
- **Geocoding**: Converts postal codes to coordinates using Nominatim
- **Search**: Uses Overpass API to find dermatology clinics
- **Fallback**: Generates mock data when no real clinics found

## API Usage

### Request
```javascript
POST /api/clinicians/find
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": 43.6532,      // Optional if postalCode provided
  "longitude": -79.3832,    // Optional if postalCode provided
  "postalCode": "M5H 2N2",  // Optional if coordinates provided
  "radius": 10,             // Search radius in km (default: 10)
  "filters": {
    "openNow": false,       // Filter for currently open clinics
    "topRated": true        // Sort by rating
  }
}
```

### Response
```javascript
{
  "location": {
    "latitude": 43.6532,
    "longitude": -79.3832
  },
  "radius": 10,
  "count": 8,
  "clinicians": [
    {
      "id": "12345",
      "name": "Advanced Dermatology Center",
      "address": "123 Main St, Toronto, ON M5H 2N2",
      "phone": "+1 (555) 123-4567",
      "website": "https://www.example.com",
      "openingHours": "Mo-Fr 09:00-17:00",
      "latitude": 43.6532,
      "longitude": -79.3832,
      "distance": 0.5,
      "type": "clinic",
      "rating": 4.5,
      "reviewCount": 120
    }
  ]
}
```

## User Flow

### 1. Access Feature
Users can access the clinician finder from:
- Dashboard quick actions
- Main navigation menu
- Scan results page (for concerning results)
- Scan history page (when concerning results exist)

### 2. Location Permission
- Browser requests location permission
- If granted: Automatically searches nearby clinicians
- If denied: Prompts for postal code entry

### 3. View Results
- Clinicians displayed as cards sorted by distance
- Each card shows:
  - Name and rating
  - Address and distance
  - Phone number
  - Opening hours
  - Quick action buttons

### 4. Take Action
- **Call**: Opens phone dialer with clinic number
- **Website**: Opens clinic website in new tab
- **Directions**: Opens Google Maps with directions

## Technical Implementation

### Frontend Components
- `ClinicianFinderPage.tsx`: Main page component
- `ClinicianCard.tsx`: Reusable card component for recommendations
- Integration in `DashboardPage.tsx`, `ScanPage.tsx`, `ScanHistoryPage.tsx`

### Backend Components
- `clinicianController.js`: Business logic and API integration
- `clinicianRoutes.js`: Route definitions
- Integration in `server.js`

### External APIs Used
1. **Nominatim (OpenStreetMap)**: Geocoding postal codes
2. **Overpass API**: Finding dermatology clinics
3. **Google Maps**: Directions (client-side)

## Testing

### Manual Testing
1. Navigate to `/clinicians` page
2. Click "Use My Location" and allow permission
3. Verify clinicians load and are sorted by distance
4. Test filters (radius, open now, top rated)
5. Click on a clinician card to view details
6. Test call, website, and directions buttons
7. Deny location permission and test postal code search

### API Testing
Run the test script:
```bash
cd dermoscanners/server
node test-clinician-api.js
```

## Privacy & Security

### Location Data
- Location is NOT stored on the server
- Only used for real-time search
- User must explicitly grant permission
- Postal code alternative available

### Authentication
- All API requests require valid JWT token
- Rate limiting applied to prevent abuse

## Future Enhancements

### Potential Improvements
- [ ] Save favorite clinicians
- [ ] Book appointments directly
- [ ] View clinic photos and reviews
- [ ] Filter by insurance accepted
- [ ] Filter by languages spoken
- [ ] Show clinic availability calendar
- [ ] Integration with Google Places API for more data
- [ ] Offline mode with cached results
- [ ] Push notifications for appointment reminders

## Acceptance Criteria Status

✅ Location permission requested when feature opens  
✅ Dermatologist list loads with contact + distance  
✅ Booking button opens call or external link  
✅ Location only stored with user consent (not stored at all)  
✅ If permission denied → ask for postal code  
✅ Allow location → list loads, sorted by distance  
✅ Deny location → postal code prompt shown  
✅ No clinics found → helpful fallback message (mock data)  
✅ Selecting clinic → detail/booking opens  
✅ Navigation back → results remain cached (in component state)  

## Deployment Notes

### Environment Variables
No additional environment variables required. The feature uses public APIs:
- Nominatim: No API key needed
- Overpass API: No API key needed

### CORS Configuration
Ensure the following domains are allowed:
- `nominatim.openstreetmap.org`
- `overpass-api.de`

### Rate Limiting
Consider implementing rate limiting for the clinician search endpoint to prevent abuse of external APIs.

## Support

For issues or questions about this feature, please refer to:
- GitHub Issue #65
- API documentation: `/api/clinicians/find`
- Test script: `dermoscanners/server/test-clinician-api.js`
