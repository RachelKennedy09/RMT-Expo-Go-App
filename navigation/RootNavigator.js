/*
navigation/RootNavigator.js
Notes:
- Centralizes route definitions. Semantic names, explicit headers.
- Defines how screens switch; each <Screen> is a route.
 */

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Rocky Mountain Tails" }}
      />
    </Stack.Navigator>
  );
}
