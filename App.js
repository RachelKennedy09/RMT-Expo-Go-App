/*
  App.js
  - Root entry point of the mobile app.
  - Wraps everything in global providers (AppContext + Toast).
  - Loads RootNavigator, which decides: Auth screens or MainTabs.
  - Includes a small test notification button (dev/demo only).
*/

import { StatusBar } from "expo-status-bar";
import { AppProvider } from "./context/AppContext";
import { ToastProvider } from "./components/Toast";
import RootNavigator from "./navigation/RootNavigator";
import { useLocalNotifications } from "./hooks/useLocalNotifications";
import { Pressable, Text } from "react-native";

export default function App() {
  // Requests notification permission on first app open.
  const { scheduleInSeconds } = useLocalNotifications();

  return (
    <>
      {/* Global state + toast UI available to all screens */}
      <AppProvider>
        <ToastProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </ToastProvider>
      </AppProvider>

      {/* Dev-only: quick test to fire a notification in 3 seconds */}
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

