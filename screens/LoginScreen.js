/*
  screens/LoginScreen.js
  - Simple local login (email and password).
  - Validates format only; no real backend.
  - Link to Register screen.
*/

import { useState, useMemo } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "../components/Toast";
import { useApp } from "../context/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";

// basic email check
const emailOk = (e) => /\S+@\S+\.\S+/.test(e ?? "");

export default function LoginScreen() {
  const nav = useNavigation();
  const { login } = useApp();
  const { show } = useToast();

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // enable button if fields look valid
  const canSubmit = useMemo(
    () => emailOk(email) && password.length >= 1,
    [email, password]
  );

  // handle login
  const onLogin = async () => {
    try {
      await login({ email, password });
      show("Welcome back!");
    } catch (e) {
      // Simple demo-mode checks
      if (e?.code === "NOT_FOUND") {
        Alert.alert("No account", "We couldn't find that email.", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Register",
            onPress: () => nav.navigate("Register", { email }),
          },
        ]);
      } else if (e?.code === "BAD_PASSWORD") {
        Alert.alert("Incorrect password", "Double-check and try again.");
      } else if (e?.code === "INVALID_FORM") {
        Alert.alert("Check form", "Enter a valid email and password.");
      } else {
        console.warn("Login error:", e);
        Alert.alert("Login error", String(e?.message ?? e));
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.wrap}>
        <Text style={styles.h1}>Log In</Text>

        {/* Email */}
        <View style={styles.field}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            returnKeyType="next"
          />
        </View>

        {/* Password */}
        <View style={styles.field}>
          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            returnKeyType="done"
            onSubmitEditing={onLogin}
          />
        </View>

        {/* Login button */}
        <Pressable
          onPress={onLogin}
          disabled={!canSubmit}
          style={[styles.btn, !canSubmit && { opacity: 0.6 }]}
        >
          <Text style={styles.btnText}>Log in</Text>
        </Pressable>

        {/* Go to Register */}
        <Pressable
          onPress={() => nav.navigate("Register", { email })}
          style={{ marginTop: 12 }}
        >
          <Text style={{ color: "#2f6f6f", fontWeight: "700" }}>
            Create an account
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fafafa" },
  wrap: { flex: 1, padding: 20, gap: 10 },
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
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
