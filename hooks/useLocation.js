/* hooks/useLocation.js
- Grabs device location once (coords + optional reverse geocode).
- Used when tapping “📍 Use My Location” in HomeScreen.
*/

import * as Location from "expo-location";

export async function getLocationOnce({ withAddress = true } = {}) {
  // Ask for foreground permission
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return { error: "Location permission denied." };
  }

  // Get current position (balanced = faster + battery friendly)
  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
    maximumAge: 5000, // accept recent cached reading (ms)
    timeout: 10000, // fail fast if GPS is slow
  });

  const coords = {
    lat: pos.coords.latitude,
    lng: pos.coords.longitude,
    accuracy: pos.coords.accuracy,
  };

  // Optional reverse geocoding -> readable city/region/country
  let place = null;
  if (withAddress) {
    try {
      const [addr] = await Location.reverseGeocodeAsync({
        latitude: coords.lat,
        longitude: coords.lng,
      });

      if (addr) {
        place = {
          city: addr.city || addr.subregion || null,
          region: addr.region || null,
          country: addr.country || null,
          postalCode: addr.postalCode || null,
        };
      }
    } catch {
      // ignore reverse geocode failures
    }
  }

  return { coords, place };
}
