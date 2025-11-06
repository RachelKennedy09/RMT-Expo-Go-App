/*
screens/BookingScreen.js
Notes: Displays the booking form and selected walker info.
 */
import { View, Text, StyleSheet } from "react-native";

export default function BookingsListScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>My Bookings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, justifyContent: "center", gap: 8 },
  h1: { fontSize: 22, fontWeight: "800" },
  sub: { color: "#555" },
});
