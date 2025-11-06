import { View, Text, StyleSheet } from "react-native-web";
import { useRoute } from "@react-navigation/native";
import { useApp } from "../context/AppContext";

export default function BookingDetailsScreen() {
  const route = useRoute();
  const { getBookingById } = useApp();
  const booking = getBookingById(route.params?.id);

  if (!booking) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.h1}>Booking Not Found</Text>
        <Text style={styles.sub}>Try again from the list.</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Booking Details</Text>
      <Text style={styles.row}>
        <Text style={styles.bold}>Walker: </Text>
        {booking.walkerName}
      </Text>
      <Text style={styles.row}>
        <Text style={styles.bold}>When: </Text>
        {new Date(booking.startISO).toLocaleString()}
      </Text>
      <Text style={styles.row}>
        <Text style={styles.bold}>Duration: </Text>
        {booking.durationMins} min
      </Text>
      <Text style={styles.row}>
        <Text style={styles.bold}>Dog: </Text>
        {booking.dogName}
      </Text>
      {booking.notes ? (
        <Text style={styles.row}>
          <Text style={styles.bold}>Notes: </Text>
          {booking.notes}
        </Text>
      ) : null}
      <Text style={styles.row}>
        <Text style={styles.bold}>Created: </Text>
        {new Date(booking.createdAt).toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 20,
    paddingTop: 24,
    backgroundColor: "#fafafa",
    gap: 8,
  },
  h1: { fontSize: 22, fontWeight: "800" },
  sub: { color: "#555" },
  row: { color: "#222" },
  bold: { fontWeight: "800" },
});
