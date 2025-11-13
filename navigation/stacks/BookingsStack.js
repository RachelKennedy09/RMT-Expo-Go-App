/*
  BookingsStack.js
  - Stack for the Bookings tab.
  - Shows the list of bookings -> details for a selected booking.
*/

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BookingsListScreen from "../../screens/BookingsListScreen";
import BookingDetailsScreen from "../../screens/BookingDetailsScreen";

const Stack = createNativeStackNavigator();

export default function BookingsStack() {
  return (
    <Stack.Navigator>
      {/* List of all user bookings */}
      <Stack.Screen
        name="BookingsList"
        component={BookingsListScreen}
        options={{ title: "My Bookings" }}
      />

      {/* Detailed view for a single booking */}
      <Stack.Screen
        name="BookingDetails"
        component={BookingDetailsScreen}
        options={{ title: "Booking Details" }}
      />
    </Stack.Navigator>
  );
}
