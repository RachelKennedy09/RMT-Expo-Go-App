/*
 navigation/HomeStack.js
Notes:
- Encapsulates Home → Booking flow under Home tab.
- We keep current screens; headers shown for page titles.
 */
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../screens/HomeScreen";
import BookingScreen from "../../screens/BookingScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Rocky Mountain Tails" }}
      />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{ title: "Book a Walk" }}
      />
    </Stack.Navigator>
  );
}
