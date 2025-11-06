/*
screens/BookingScreen.js
Notes: Displays the booking form and selected walker info.
 */
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useApp } from "../context/AppContext";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}

export default function BookingsListScreen() {
  const navigation = useNavigation();
  const { bookings } = useApp();
  if (!bookings || bookings.length === 0) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.h1}>My Bookings</Text>
        <Text style={styles.sub}>
          (No bookings yet — create one from Home.)
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>My Books</Text>
      <FlatList
        data={bookings}
        keyExtractor={(b) => b.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate("BookingDetails", { id: item.id })
            }
          >
            <Text style={styles.title}>
              {item.walkerName} · {item.durationMins} min
            </Text>
            <Text style={styles.sub}>
              {formatDate(item.startISO)} · {item.dogName}
            </Text>
          </Pressable>
        )}
        contentContainerStyle={{ paddingTop: 10 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, paddingTop: 24, backgroundColor: "#fafafa" },
  h1: { fontSize: 22, fontWeight: "800" },
  sub: { color: "#555", marginTop: 6 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#eee",
  },
  title: { fontWeight: "800", fontSize: 16, color: "#111" },
});