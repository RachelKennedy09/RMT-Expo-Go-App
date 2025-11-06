

import { View, Text, StyleSheet } from "react-native-web";

export default function AccountScreen() {
    return (
        <View style={styles.wrap}>
            <Text style={styles.h1}>Account</Text>
            <Text style={styles.sub}>Login/Profile</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, justifyContent: "center", gap: 8 },
  h1: { fontSize: 22, fontWeight: "800" },
  sub: { color: "#555" },
});