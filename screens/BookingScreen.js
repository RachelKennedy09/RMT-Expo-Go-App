
/*
screens/BookingScreen.js
Booking form: date, time, duration, dog name, notes.
- Prefills walker from route params
- Validates + saves via context.createBooking()
 */


import { View, Text, StyleSheet, TextInput, Pressable, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useApp } from "../context/AppContext";
import { useEffect, useMemo, useState } from "react";

export default function BookingScreen() {
  const route = useRoute();
  const { markSelectedWalker } = useApp();
  const selected = useMemo(
    () => route.params?.walker ?? null,
    [route.params?.walker]
  );

  useEffect(() => {
    if (selected?.id) markSelectedWalker(selected.id);
  }, [selected?.id, markSelectedWalker]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Book a Walk</Text>
      {selected ? (
        <Text style={{ marginTop: 6 }}>
          Booking: {selected.name} (${selected.price}/hr, ⭐ {selected.rating})
        </Text>
      ) : (
        <Text style={styles.sub}>Select a Walker to begin.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, justifyContent: "center", gap: 8 },
  h1: { fontSize: 22, fontWeight: "800" },
  sub: { color: "#555" },
});
