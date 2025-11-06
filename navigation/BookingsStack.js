/*
navigation/BookingsStack.js
Notes:
- Placeholder list/details flow to satisfy tabs structure.
*/

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BookingsListScreen from "../screens/BookingsListScreen";
import BookingDetailsScreen from "../screens/BookingDetailsScreen";

const Stack = createNativeStackNavigator();

export default function BookingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BookingsList"
        component={BookingsListScreen}
        options={{ title: "My Bookings" }}
      />
      <Stack.Screen
        name="BookingDetails"
        component={BookingDetailsScreen}
        options={{ title: "Booking Details" }}
      />
    </Stack.Navigator>
  );
}
