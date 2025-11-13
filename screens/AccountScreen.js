/*
  screens/AccountScreen.js
  - Account view after login.
  - Shows basic profile info, test notification, dev-only reset, and logout.
*/

import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";
import { useToast } from "../components/Toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalNotifications } from "../hooks/useLocalNotifications";

export default function AccountScreen() {
  const { user, isLoggedIn, logout } = useApp();
  const { show } = useToast();
  const { scheduleInSeconds } = useLocalNotifications();

  // Log out and let RootNavigator switch back to AuthStack
  const onLogout = async () => {
    await logout();
    show("Logged out");
  };

  // Clear seeded demo data (walkers, bookings, last selection)
  const resetDemoData = async () => {
    await AsyncStorage.removeItem("@rmt/walkers");
    await AsyncStorage.removeItem("@rmt/bookings");
    await AsyncStorage.removeItem("@rmt/lastSelection");

    Alert.alert("Reset complete", "Restart the app to reload seed walkers.");
  };

  // Fire a test local notification after 3 seconds
  const sendTestNotification = () => {
    scheduleInSeconds(3, {
      title: "Test Notification 🔔",
      body: "This was sent from your Account tab!",
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.wrap}>
        <Text style={styles.h1}>Account</Text>

        {isLoggedIn && user ? (
          <>
            {/* Basic profile card */}
            <View style={styles.card}>
              <Text style={styles.row}>
                <Text style={styles.bold}>Name: </Text>
                {user.name}
              </Text>
              <Text style={styles.row}>
                <Text style={styles.bold}>Email: </Text>
                {user.email}
              </Text>
              {user.dogName ? (
                <Text style={styles.row}>
                  <Text style={styles.bold}>Dog: </Text>
                  {user.dogName}
                </Text>
              ) : null}
            </View>

            {/* Test notification button */}
            <Pressable onPress={sendTestNotification} style={styles.btn}>
              <Text style={styles.btnText}>Test Notification</Text>
            </Pressable>

            {/* Dev-only: reset seeded demo data */}
            {__DEV__ && (
              <Pressable
                onPress={resetDemoData}
                style={[styles.btn, styles.btnNeutral]}
              >
                <Text style={styles.btnText}>Reset Demo Data</Text>
              </Pressable>
            )}

            {/* Logout button */}
            <Pressable
              onPress={onLogout}
              style={[styles.btn, styles.btnDanger]}
            >
              <Text style={styles.btnText}>Log Out</Text>
            </Pressable>
          </>
        ) : (
          <Text style={styles.sub}>You’re not logged in.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fafafa" },
  wrap: { flex: 1, padding: 20, paddingTop: 24, gap: 10 },

  h1: { fontSize: 22, fontWeight: "800" },
  sub: { color: "#555" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: "#eee",
  },
  row: { color: "#222" },
  bold: { fontWeight: "800" },

  btn: {
    marginTop: 12,
    backgroundColor: "#2f6f6f",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  btnNeutral: { backgroundColor: "#555" },
  btnDanger: { backgroundColor: "#b91c1c" },

  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
