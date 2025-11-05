/**
screens/BookingScreen.js
Notes: Form
 */

import { View, Text, StyleSheet } from "react-native";

export default function BookingScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Book a Walk</Text>
      <Text style={styles.sub}>Form</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, justifyContent: "center", gap: 8 },
  h1: { fontSize: 22, fontWeight: "800" },
  sub: { color: "#555" },
});
