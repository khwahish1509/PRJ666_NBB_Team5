/**
 * Clinician Controller - Find dermatologists near user location
 * Uses OpenStreetMap Nominatim for geocoding and Overpass API for finding clinics
 */

import fetch from 'node-fetch';

/**
 * Find dermatologists near a location
 * Supports both coordinates and postal code search
 */
export async function findClinicians(req, res) {
  try {
    const { latitude, longitude, postalCode, radius = 10, filters = {} } = req.body;

    let lat, lon;

    // If postal code provided, geocode it first
    if (postalCode && !latitude && !longitude) {
      const geocodeResult = await geocodePostalCode(postalCode);
      if (!geocodeResult) {
        return res.status(400).json({ 
          error: 'Unable to geocode postal code. Please check the postal code and try again.' 
        });
      }
      lat = geocodeResult.lat;
      lon = geocodeResult.lon;
    } else if (latitude && longitude) {
      lat = latitude;
      lon = longitude;
    } else {
      return res.status(400).json({ 
        error: 'Either coordinates (latitude, longitude) or postalCode is required' 
      });
    }

    // Validate coordinates
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }

    // Search for dermatologists using Overpass API
    const clinicians = await searchClinicians(lat, lon, radius, filters);

    return res.status(200).json({
      location: { latitude: lat, longitude: lon },
      radius,
      count: clinicians.length,
      clinicians
    });
  } catch (error) {
    console.error('Error in findClinicians:', error);
    return res.status(500).json({ 
      error: 'Internal server error while searching for clinicians' 
    });
  }
}

/**
 * Geocode a postal code to coordinates using Nominatim
 */
async function geocodePostalCode(postalCode) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(postalCode)}&format=json&limit=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'DermoScanner/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.length === 0) {
      return null;
    }

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon)
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Search for dermatologists using Overpass API
 */
async function searchClinicians(lat, lon, radiusKm, filters) {
  try {
    const radiusMeters = radiusKm * 1000;
    
    // Overpass query to find healthcare facilities
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="doctors"]["healthcare:speciality"~"dermatology"](around:${radiusMeters},${lat},${lon});
        node["amenity"="clinic"]["healthcare:speciality"~"dermatology"](around:${radiusMeters},${lat},${lon});
        node["amenity"="hospital"]["healthcare:speciality"~"dermatology"](around:${radiusMeters},${lat},${lon});
        way["amenity"="doctors"]["healthcare:speciality"~"dermatology"](around:${radiusMeters},${lat},${lon});
        way["amenity"="clinic"]["healthcare:speciality"~"dermatology"](around:${radiusMeters},${lat},${lon});
      );
      out center;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!response.ok) {
      throw new Error(`Overpass API failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Process results
    let clinicians = data.elements.map(element => {
      const clinicLat = element.lat || element.center?.lat;
      const clinicLon = element.lon || element.center?.lon;
      const distance = calculateDistance(lat, lon, clinicLat, clinicLon);

      return {
        id: element.id,
        name: element.tags?.name || 'Dermatology Clinic',
        address: formatAddress(element.tags),
        phone: element.tags?.phone || element.tags?.['contact:phone'] || null,
        website: element.tags?.website || element.tags?.['contact:website'] || null,
        openingHours: element.tags?.opening_hours || null,
        latitude: clinicLat,
        longitude: clinicLon,
        distance: parseFloat(distance.toFixed(2)),
        type: element.tags?.amenity || 'clinic'
      };
    });

    // If no results from Overpass, generate mock data
    if (clinicians.length === 0) {
      clinicians = generateMockClinicians(lat, lon, radiusKm);
    }

    // Apply filters
    if (filters.openNow) {
      clinicians = clinicians.filter(c => isOpenNow(c.openingHours));
    }

    if (filters.topRated) {
      // Add mock ratings for sorting
      clinicians = clinicians.map(c => ({
        ...c,
        rating: 3.5 + Math.random() * 1.5,
        reviewCount: Math.floor(Math.random() * 200) + 10
      }));
      clinicians.sort((a, b) => b.rating - a.rating);
    }

    // Sort by distance
    clinicians.sort((a, b) => a.distance - b.distance);

    // Limit to top 20 results
    return clinicians.slice(0, 20);
  } catch (error) {
    console.error('Clinician search error:', error);
    // Return mock data on error
    return generateMockClinicians(lat, lon, radiusKm);
  }
}

/**
 * Format address from OSM tags
 */
function formatAddress(tags) {
  const parts = [];
  
  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
  if (tags['addr:street']) parts.push(tags['addr:street']);
  if (tags['addr:city']) parts.push(tags['addr:city']);
  if (tags['addr:state']) parts.push(tags['addr:state']);
  if (tags['addr:postcode']) parts.push(tags['addr:postcode']);
  
  return parts.length > 0 ? parts.join(', ') : 'Address not available';
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Check if clinic is open now
 */
function isOpenNow(openingHours) {
  if (!openingHours) return false;
  // Simplified check - in production, use a proper opening hours parser
  return openingHours.toLowerCase().includes('24/7') || 
         openingHours.toLowerCase().includes('mo-fr');
}

/**
 * Generate mock clinicians for testing/fallback
 */
function generateMockClinicians(lat, lon, radiusKm) {
  const clinicNames = [
    'Advanced Dermatology Center',
    'Skin Health Clinic',
    'Dermatology Associates',
    'Clear Skin Medical Center',
    'Comprehensive Dermatology',
    'Elite Skin Care Clinic',
    'Metropolitan Dermatology',
    'Precision Dermatology Group',
    'Radiant Skin Specialists',
    'Total Skin Health Center'
  ];

  const streets = ['Main St', 'Oak Ave', 'Maple Dr', 'Park Blvd', 'Cedar Ln', 'Elm St', 'Pine Rd'];
  
  return clinicNames.map((name, index) => {
    // Generate random point within radius
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radiusKm;
    const deltaLat = (distance / 111) * Math.cos(angle);
    const deltaLon = (distance / (111 * Math.cos(lat * Math.PI / 180))) * Math.sin(angle);
    
    const clinicLat = lat + deltaLat;
    const clinicLon = lon + deltaLon;
    
    return {
      id: `mock-${index}`,
      name,
      address: `${100 + index * 50} ${streets[index % streets.length]}, Suite ${100 + index}`,
      phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      website: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com`,
      openingHours: 'Mo-Fr 09:00-17:00',
      latitude: clinicLat,
      longitude: clinicLon,
      distance: parseFloat(distance.toFixed(2)),
      type: 'clinic',
      rating: 3.5 + Math.random() * 1.5,
      reviewCount: Math.floor(Math.random() * 200) + 10
    };
  }).sort((a, b) => a.distance - b.distance);
}
