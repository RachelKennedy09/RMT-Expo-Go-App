/*
 components/Button.js
Notes:
- Reusable CTA built with Pressable; consistent styling + accessibility.

- `Pressable` gives a `pressed` state so I can tweak style on touch.

 */

import { Pressable, Text, StyleSheet } from "react-native";

export default function Button({ title, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Text style={styles.txt}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#2f6f6f",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  pressed: { opacity: 0.85 },
  txt: { color: "white", fontWeight: "700", fontSize: 16 },
});
