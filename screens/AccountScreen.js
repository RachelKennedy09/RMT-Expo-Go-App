/*
screens/AccountScreen.js
Notes:
- Profile + Logout view (no login here).
- Safe area padding so it doesn’t overlap the clock/notch.
*/

import { View, Text, StyleSheet, Pressable, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";
import { useToast } from "../components/Toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AccountScreen() {
  const { user, isLoggedIn, logout } = useApp();
  const { show } = useToast();

  const onLogout = async () => {
    await logout();
    show("Logged out");
    // RootNavigator will switch back to AuthStack automatically.
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.wrap}>
        <Text style={styles.h1}>Account</Text>

        <Button
          title="Reset demo data"
          onPress={async () => {
            await AsyncStorage.removeItem("@rmt/walkers");
            // optionally also clear bookings etc:
            // await AsyncStorage.removeItem("@rmt/bookings");
            // await AsyncStorage.removeItem("@rmt/lastSelection");
            Alert.alert(
              "Reset complete",
              "Restart the app to reload seed walkers."
            );
          }}
        />

        {isLoggedIn && user ? (
          <>
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
  btnDanger: { backgroundColor: "#b91c1c" },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
