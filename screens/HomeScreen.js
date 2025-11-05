/*
screens/HomeScreen.js
Notes:
- Main Screen
 */

import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Button from "../components/Button";

export default function HomeScreen() {
  const navigation = useNavigation(); //using instead of props

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Happy Dogs. Happy Adventures.</Text>
      <Text style={styles.sub}>
        Mountain-loving dog walks & sitting — now as a mobile app.
      </Text>

      <View style={{ height: 12 }} />
      <Button title="Book Now" onPress={() => navigation.navigate("Booking")} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, justifyContent: "center", gap: 8 },
  h1: { fontSize: 22, fontWeight: "800" },
  sub: { color: "#555" },
});
