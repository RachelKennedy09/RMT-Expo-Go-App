/*
  HomeStack.js
  - Stack for the Home tab.
  - Controls navigation from the Home list -> Booking form.
*/

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../screens/HomeScreen";
import BookingScreen from "../../screens/BookingScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      {/* Main landing page with walkers list */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Rocky Mountain Tails" }}
      />

      {/* Walk booking form */}
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{ title: "Book a Walk" }}
      />
    </Stack.Navigator>
  );
}
