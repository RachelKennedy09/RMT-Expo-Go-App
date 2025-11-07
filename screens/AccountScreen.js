/*
screens/AccountScreen.js
Notes:
- If logged out: show local login form (no backend).
- If logged in: show profile card + Logout.
*/

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,
  Alert,
} from "react-native";
import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { useToast } from "../components/Toast";
import { SafeAreaView } from "react-native-safe-area-context";

const emailOk = (e) => /\S+@\S+\.\S+/.test(e);

export default function AccountScreen() {
  const { user, isLoggedIn, login, logout } = useApp();
  const { show } = useToast();

  //form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const canSubmit = useMemo(() => {
    return name.trim().length > 0 && emailOk(email);
  }, [name, email]);

  const onLogin = async () => {
    if (!canSubmit) {
      Alert.alert("Check form", "Enter your name and a valid email address.");
      return;
    }
    try {
      await login({ name, email });
      Keyboard.dismiss();
      show("Logged in");
      setName("");
      setEmail("");
    } catch {
      Alert.alert("Error", "Could not log in.");
    }
  };

  const onLogout = async () => {
    await logout();
    show("Logged out");
  };

  if (isLoggedIn) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.h1}>Profile</Text>

        <View style={styles.card}>
          <Text style={styles.row}>
            <Text style={styles.bold}>Name: </Text>
            {user.name}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.bold}>Email: </Text>
            {user.email}
          </Text>
        </View>

        <Pressable onPress={onLogout} style={[styles.btn, styles.btnDanger]}>
          <Text style={styles.btnText}>Log Out</Text>
        </Pressable>
      </View>
    );
  }

  //Logged out show login form
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrap}>
        <Text style={styles.h1}>Log In</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            returnKeyType="next"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            returnKeyType="done"
            onSubmitEditing={onLogin}
          />
        </View>

        <Pressable
          onPress={onLogin}
          disabled={!canSubmit}
          style={[styles.btn, !canSubmit && { opacity: 0.6 }]}
        >
          <Text style={styles.btnText}>Log In</Text>
        </Pressable>

        <Text style={styles.hint}>
          This is local-only mock auth for the assignment. No password is
          stored.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fafafa" },
  wrap: { flex: 1, padding: 20, gap: 10 },
  wrap: {
    flex: 1,
    padding: 20,
    paddingTop: 24,
    backgroundColor: "#fafafa",
    gap: 10,
  },
  h1: { fontSize: 22, fontWeight: "800" },
  field: { gap: 6 },
  label: { fontWeight: "700", color: "#222" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  btn: {
    marginTop: 8,
    backgroundColor: "#2f6f6f",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  btnDanger: { backgroundColor: "#b91c1c" },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  hint: { color: "#666", marginTop: 10 },
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
});
