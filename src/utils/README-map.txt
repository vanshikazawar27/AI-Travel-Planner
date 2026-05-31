Leaflet Map Integration Notes

- Extract candidates: src/utils/itineraryLocations.js -> extractLocationsFromDays
- Geocode via Nominatim (OpenStreetMap): src/utils/itineraryLocations.js -> geocodeLocations
- Render markers: src/components/ItineraryMap.jsx
- Integrated into: src/pages/Result.jsx

Nominatim usage considerations:
- Rate limiting may occur; caching is enabled using localStorage key: itinerary-geocode-cache-v1
- Display is limited (maxPlaces / maxToGeocode) to keep requests bounded.

