/*
App.js
Notes:
- Acts as the root component of the app.
- Every React Native app starts here.
- <View> = container, <Text> = basic text node.
- NavigationContainer provides navigation state/context app-wide.
 */

import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import RootNavigator from "./navigation/RootNavigator";

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: "#fafafa" },
};

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="dark" />
      <RootNavigator />
    </NavigationContainer>
  );
}
