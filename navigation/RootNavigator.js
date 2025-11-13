/*
  RootNavigator.js
  - Top-level navigation logic.
  - Decides which part of the app to show:
      - AuthStack  -> user not logged in
      - MainTabs   -> user logged in
*/

import { useApp } from "../context/AppContext";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import AuthStack from "./auth/AuthStack";
import MainTabs from "./main/MainTabs";

// Light background theme for the whole app
const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: "#fafafa" },
};

export default function RootNavigator() {
  const { isLoggedIn } = useApp(); // global auth flag from context

  return (
    <NavigationContainer theme={navTheme}>
      {/* Switch between login/register flow vs. main app */}
      {isLoggedIn ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
