/*
App.js
Notes:
- Acts as the root component of the app.
- Every React Native app starts here.
- <View> = container, <Text> = basic text node.
 */

import { View, Text, StyleSheet } from "react-native";

export default function App() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}> Rocky Mountain Tails </Text>
      <Text style={styles.subtitle}>Website turned App!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1, // fill the entire screen
    alignItems: "center", // center horizontally
    justifyContent: "center", // center vertically
    backgroundColor: "#fafafa", // neutral background
  },
  title: { fontSize: 24, fontWeight: "800" },
  subtitle: { color: "#555", marginTop: 8 },
});
