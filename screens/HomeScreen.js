/*
  HomeScreen.js
  - Main landing screen after login.
  - Shows list of walkers and lets the user filter by nearby distance.
  - Integrates mobile geolocation via getUserLocation() from context.
*/

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useApp } from "../context/AppContext";
import { useState, useMemo } from "react";
import WalkerCard from "../components/WalkerCard";
import { distanceKm } from "../utils/geo";

const RADIUS_KM = 25;

export default function HomeScreen() {
  const navigation = useNavigation();
  const { walkers, toggleFavorite, userLocation, getUserLocation } = useApp();
  const [nearbyOnly, setNearbyOnly] = useState(false);

  // Ask for location permission and store location in context
  const handleUseMyLocation = async () => {
    const res = await getUserLocation();
    if (res?.error) {
      Alert.alert("Location Error", res.error);
    }
  };

  // Build readable location string from reverse-geocoded place
  const place = userLocation?.place;
  const readableLocation = place
    ? [place.city, place.region, place.country].filter(Boolean).join(", ")
    : null;

  // Initial loading state while walkers are being fetched
  if (!walkers) {
    return (
      <View style={[styles.wrap, { alignItems: "center" }]}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading walkers…</Text>
      </View>
    );
  }

  // Toggle nearby-only filter.
  // If turning it on and we don't have a location yet, fetch it first.
  async function toggleNearby() {
    if (!nearbyOnly && !userLocation) {
      const res = await getUserLocation();
      if (res?.error) return Alert.alert("Location Error", res.error);
    }
    setNearbyOnly((v) => !v);
  }

  // Compute visible walker list.
  // When nearbyOnly is true, filter and sort by distance.
  const visible = useMemo(() => {
    if (!nearbyOnly || !userLocation?.coords) return walkers;

    const here = { lat: userLocation.coords.lat, lng: userLocation.coords.lng };

    return walkers
      .map((w) => {
        const hasCoords =
          typeof w.lat === "number" && typeof w.lng === "number";
        const d = hasCoords
          ? distanceKm(here, { lat: w.lat, lng: w.lng })
          : Infinity;
        return { ...w, _distanceKm: d };
      })
      .filter((w) => w._distanceKm <= RADIUS_KM)
      .sort((a, b) => a._distanceKm - b._distanceKm);
  }, [nearbyOnly, userLocation, walkers]);

  const farFromRockies = useMemo(() => {
    if (!userLocation?.coords || !walkers?.lenth) return false;

    const here = { lat: userLocation.coords.lat, lng: userLocation.coords.lng };

    let min = Infinity;
    for (const w of walkers) {
      const hasCoords = typeof w.lat === "number" && typeof w.lng === "number";
      if (!hasCoords) continue;
      const d = distanceKm(here, { lat: w.lat, lng: w.lng });
      if (d < min) min = d;
    }

    // If the closest walker is more than 200 km away, assume user is far from Rocky Mountains.
    return min > 200;
  }, [userLocation, walkers]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Find Your Mountain Walker</Text>
      <Text style={styles.sub}>Trusted locals with great reviews.</Text>

      {/* Location / Nearby controls */}
      <View style={styles.controls}>
        <Pressable onPress={handleUseMyLocation} style={styles.locBtn}>
          <Text style={styles.locBtnText}>📍 Use My Location</Text>
        </Pressable>

        <Pressable
          onPress={toggleNearby}
          style={[styles.chip, nearbyOnly && styles.chipActive]}
        >
          <Text style={[styles.chipText, nearbyOnly && styles.chipTextActive]}>
            {nearbyOnly ? `Nearby (${RADIUS_KM} km)` : "Nearby Only"}
          </Text>
        </Pressable>
      </View>

      {readableLocation && (
        <Text style={styles.locationText}>Current: {readableLocation}</Text>
      )}

      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 12 }}
        renderItem={({ item }) => (
          <WalkerCard
            {...item}
            // Pass distance if available (used for nearby sorting display)
            distanceKm={
              typeof item._distanceKm === "number"
                ? item._distanceKm
                : undefined
            }
            onPress={() =>
              navigation.navigate("Booking", { walkerId: item.id })
            }
            onToggleFavorite={(id) => toggleFavorite(id)}
          />
        )}
        ListEmptyComponent={
          <Text style={{ color: "#666", marginTop: 12 }}>
            {nearbyOnly
              ? farFromRockies
                ? `No walkers found within ${RADIUS_KM} km. Rocky Mountain Tails walkers are based around Banff / Lake Louise, so this is expected if you're far away.`
                : `No walkers found within ${RADIUS_KM} km.`
              : "No walkers found."}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, paddingTop: 24, backgroundColor: "#fafafa" },
  h1: { fontSize: 22, fontWeight: "800" },
  sub: { color: "#555", marginBottom: 8 },

  controls: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 6,
  },
  locBtn: {
    backgroundColor: "#EAF6F6",
    borderRadius: 8,
    padding: 10,
    alignSelf: "flex-start",
  },
  locBtnText: { color: "#007B7F", fontWeight: "600" },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#eee",
  },
  chipActive: { backgroundColor: "#2f6f6f" },
  chipText: { color: "#222", fontWeight: "600" },
  chipTextActive: { color: "#fff" },

  locationText: { marginBottom: 8, color: "#333" },
});
