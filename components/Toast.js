/*
  components/Toast.js
  - Simple global toast system for short feedback messages.
  - <ToastProvider> wraps the app and renders a bottom toast.
  - useToast().show("Saved!") to trigger a message.
*/

import { createContext, useContext, useRef, useState, useMemo } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState("");
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  // show(text, options): fades toast in, waits, then fades out
  const show = (text, { duration = 1800 } = {}) => {
    setMsg(String(text));
    setVisible(true);

    // fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start(() => {
      // hold message, then fade out
      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease),
        }).start(() => setVisible(false));
      }, duration);
    });
  };

  // stable object passed down via context
  const api = useMemo(() => ({ show }), []);

  return (
    <ToastCtx.Provider value={api}>
      <View style={{ flex: 1 }}>{children}</View>

      {visible ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.wrap,
            { opacity, bottom: Platform.select({ web: 24, default: 48 }) },
          ]}
        >
          <View style={styles.bubble}>
            <Text style={styles.text}>{msg}</Text>
          </View>
        </Animated.View>
      ) : null}
    </ToastCtx.Provider>
  );
}

// Hook to access toast API: const { show } = useToast()
export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 0, right: 0, alignItems: "center" },
  bubble: {
    backgroundColor: "rgba(0,0,0,0.85)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    maxWidth: 360,
  },
  text: { color: "#fff", fontWeight: "600" },
});
