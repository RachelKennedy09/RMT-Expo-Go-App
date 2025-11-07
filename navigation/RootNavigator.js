/*
RootNavigator
- If not logged in -> AuthStack (Login)
- If logged in     -> MainTabs (Home, Bookings, Account)
*/

import { useApp } from "../context/AppContext";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import AuthStack from "./auth/AuthStack";
import MainTabs from "./main/MainTabs";

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: "#fafafa" },
};

export default function RootNavigator() {
  const { isLoggedIn } = useApp();
  return (
    <NavigationContainer theme={navTheme}>
      {isLoggedIn ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
