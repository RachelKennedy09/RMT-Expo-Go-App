/*
  screens/BookingsListScreen.js
  - Shows all saved bookings.
  - Tap -> open details page.
  - Long press -> quick delete option.
*/

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useApp } from "../context/AppContext";
import { useToast } from "../components/Toast";

// Simple shared formatter for readable date/time
function formatDate(iso) {
  return new Date(iso).toLocaleString();
}

export default function BookingsListScreen() {
  const navigation = useNavigation();
  const { bookings, deleteBooking } = useApp();
  const { show } = useToast();

  // Empty-state -> no bookings created yet
  if (!bookings || bookings.length === 0) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.h1}>My Bookings</Text>
        <Text style={styles.sub}>No bookings yet — create one from Home.</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>My Bookings</Text>

      <FlatList
        data={bookings}
        keyExtractor={(b) => b.id}
        contentContainerStyle={{ paddingTop: 10 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate("BookingDetails", { id: item.id })
            }
            onLongPress={() => {
              Alert.alert(
                "Delete Booking",
                `Delete ${item.walkerName} on ${formatDate(item.startISO)}?`,
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                      deleteBooking(item.id);
                      show("Booking deleted");
                    },
                  },
                ]
              );
            }}
          >
            <Text style={styles.title}>
              {item.walkerName} · {item.durationMins} min
            </Text>
            <Text style={styles.sub}>
              {formatDate(item.startISO)} · {item.dogName}
            </Text>
          </Pressable>
        )}
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  title: { fontWeight: "800", fontSize: 16, color: "#111" },
});
