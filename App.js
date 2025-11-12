/*
App.js
Notes:
- Root entry of the app.
- Wraps everything with global providers (App + Toast).
- RootNavigator decides: show Login (AuthStack) or MainTabs.
*/

import { StatusBar } from "expo-status-bar";
import { AppProvider } from "./context/AppContext";
import { ToastProvider } from "./components/Toast";
import RootNavigator from "./navigation/RootNavigator";
import { useLocalNotifications } from "./hooks/useLocalNotifications";
import { Pressable, Text } from "react-native";

export default function App() {
  const { scheduleInSeconds } = useLocalNotifications(); // triggers persmission prompt(first run)
  return (
    <>
      <AppProvider>
        <ToastProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </ToastProvider>
      </AppProvider>

      {/* //Test button for Gurneesh/user to verify in 3 seconds */}
      <Pressable
        onPress={() =>
          scheduleInSeconds(3, {
            title: "Hello!",
            body: "This fired from App.js",
          })
        }
        style={{
          position: "absolute",
          right: 16,
          bottom: 100,
          padding: 12,
          backgroundColor: "#222",
          borderRadius: 12,
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>
          Test Notification
        </Text>
      </Pressable>
    </>
  );
}
