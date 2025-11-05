/*
screens/HomeScreen.js
Notes:
- Main Screen
 */

import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Happy Dogs. Happy Adventures.</Text>
      <Text style={styles.sub}>
        Mountain-loving dog walks & sitting — now as a mobile app.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, justifyContent: "center", gap: 8 },
  h1: { fontSize: 22, fontWeight: "800" }, // fontWeight must be a string
  sub: { color: "#555" },
});
