// utils/geo.js
//Haversine distance between two coordinates in km.
// The Haversine formula calculates the distance between two points
// on the surface of the Earth, using lat/lng and accounting for the
// planet's curvature. Useful for “nearby” filtering in location apps.
//
// Input:  { lat: number, lng: number }
// Output: distance in kilometers.
export function distanceKm(a, b) {
  if (!a || !b) return Infinity;

  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // earth radius (km)

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  // haversine formula
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}
