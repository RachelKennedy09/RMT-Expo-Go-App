/*
screens/BookingScreen.js
Notes: Displays the booking form and selected walker info.
 */
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

export default function BookingScreen() {
  const route = useRoute();
  const selected = route.params?.walker;

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
