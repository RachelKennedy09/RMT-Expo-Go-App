/*
RegisterScreen.js
- Create a local account (name, email, dog name)
- Auto-logins after registration
*/

import { useState, useMemo, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useToast } from "../components/Toast";
import { useApp } from "../context/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";

const emailOk = (e) => /\S+@\S+\.\S+/.test(e ?? "");

export default function RegisterScreen() {
  const route = useRoute();
  const { register } = useApp();
  const { show } = useToast();
  const { loginWithPassword } = useApp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dogName, setDogName] = useState("");
  const [password, setPassword] = useState("");

  // prefill from link (if navigating from login)
  useEffect(() => {
    if (route.params?.email) setEmail(route.params.email);
    if (route.params?.name) setName(route.params.name);
  }, [route.params]);

  const canSubmit = useMemo(
    () => name.trim().length > 0 && emailOk(email) && password.length >= 4,
    [name, email, password]
  );

  const onRegister = async () => {
    try {
      await register({ name, email, password, dogName });
      show("Account created");
    } catch (e) {
      if (e?.code === "INVALID_FORM") {
        Alert.alert("Check form", "Enter your name and a valid email.");
      } else if (e?.code === "EMAIL_EXISTS") {
        Alert.alert("Email already registered", "Try logging in instead.");
      } else {
        Alert.alert("Registration error", String(e?.message ?? e));
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.wrap}>
        <Text style={styles.h1}>Create account</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Rachel"
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
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            returnKeyType="next"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={styles.input}
            placeholder="At least 4 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={onRegister}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Dog name (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Rammi"
            value={dogName}
            onChangeText={setDogName}
            returnKeyType="done"
            onSubmitEditing={onRegister}
          />
        </View>

        <Pressable
          onPress={onRegister}
          disabled={!canSubmit}
          style={[styles.btn, !canSubmit && { opacity: 0.6 }]}
        >
          <Text style={styles.btnText}>Create account</Text>
        </Pressable>

        <Text style={styles.hint}>Local demo auth — no passwords stored.</Text>
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
  hint: { color: "#666", marginTop: 10 },
});
