import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { useApp } from "../context/AppContext";

export default function BookingDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { getBookingById, deleteBooking } = useApp();
  const booking = getBookingById(route.params?.id);

  useLayoutEffect(() => {
    if (!booking) return;
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Delete"
          color="#b91c1c"
          onPress={() => {
            Alert.alert(
              "Delete Booking",
              `Delete ${booking.walkerName} on ${new Date(
                booking.startISO
              ).toLocaleString()}?`,
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => {
                    deleteBooking(booking.id);
                    navigation.goBack();
                  },
                },
              ]
            );
          }}
        />
      ),
    });
  }, [navigation, booking, deleteBooking]);

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
