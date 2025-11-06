/*
screens/BookingScreen.js
Notes: Displays the booking form and selected walker info.
 */
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useApp } from "../context/AppContext";
import { useEffect, useMemo } from "react";

export default function BookingScreen() {
  const route = useRoute();
  const { markSelectedWalker } = useApp();

  // Get the selected walker once from route params
  const selected = useMemo(
    () => route.params?.walker ?? null,
    [route.params?.walker]
  );

  useEffect(() => {
    if (selected?.id) {
      markSelectedWalker(selected.id);
    }
  }, [selected?.id, markSelectedWalker]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Book a Walk</Text>

      {selected ? (
        <Text style={{ marginTop: 6 }}>
          Booking: {selected.name} (${selected.price}/hr, ⭐ {selected.rating})
        </Text>
      ) : (
        <Text style={styles.sub}>Select a walker to begin.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, justifyContent: "center", gap: 8 },
  h1: { fontSize: 22, fontWeight: "800" },
  sub: { color: "#555" },
});
