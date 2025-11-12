/*
screens/HomeScreen.js
Notes:
- Main Screen
-integrates mobile geolocation using expo-location.
- Uses getUserLocation() from context to request and store coordinates/address.
- Shows a simple "Use My Location" button + current city/region if available.
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

  //Handle permission + fetch location
  const handleUseMyLocation = async () => {
    const res = await getUserLocation();
    if (res?.error) {
      Alert.alert("Location Error", res.error);
    }
  };

  //Build readable location string
  const place = userLocation?.place;
  const readableLocation = place
    ? [place.city, place.region, place.country].filter(Boolean).join(", ")
    : null;

  if (!walkers) {
    return (
      <View style={[styles.wrap, { alignItems: "center" }]}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading walkers…</Text>
      </View>
    );
  }

  //Toggle nearby: if turning on and we dont have a location yet, fetch it first

  async function toggleNearby() {
    if (!nearbyOnly && !userLocation) {
      const res = await getUserLocation();
      if (res?.error) return Alert.alert("Location Error", res.error);
    }
    setNearbyOnly((v) => !v);
  }

  //computer visiblelist (filter and sort by distance wh nearbyOnly is on)
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
            distanceKm={
              typeof item._distanceKm === "number"
                ? item._distanceKm
                : undefined
            } // optional
            onPress={() =>
              navigation.navigate("Booking", { walkerId: item.id })
            }
            onToggleFavorite={(id) => toggleFavorite(id)}
          />
        )}
        ListEmptyComponent={
          <Text style={{ color: "#666", marginTop: 12 }}>
            {nearbyOnly
              ? `No walkers found within ${RADIUS_KM} km.`
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
