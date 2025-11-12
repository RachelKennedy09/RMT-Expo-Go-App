/*
hooks/useLocation.js
Notes:
- Requests foreground permission, fetches current coords once,
and optional reverse geocode -> { city, region, country }.
- Call getLocation() when the user taps "Use my location".
 */

import * as Location from "expo-location";

export async function getLocationOnce({ withAddress = true } = {}) {
  // Ask for permission
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return { error: "Location permission denied." };
  }

  // Get current position ( balanced accurace = faster and battery-friendly)
  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
    maximumAge: 5_000, //accept a recent cached reading (ms)
    timeout: 10_000, //fali fast if GPS is slow
  });

  const coords = {
    lat: pos.coords.latitude,
    lng: pos.coords.longitude,
    accuracy: pos.coords.accuracy,
  };

  //Optional reverse geocode to a human place
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
