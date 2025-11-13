/*
  screens/BookingScreen.js
  - Lets the user book a walk with a selected walker.
  - Handles form state, validation, and scheduling a local reminder.
*/
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";

import { useApp } from "../context/AppContext";
import { useToast } from "../components/Toast";
import { useLocalNotifications } from "../hooks/useLocalNotifications";
import {
  DURATIONS,
  formatDateInput,
  formatTimeInput,
  isValidDate,
  isValidTime,
  buildStartISO,
  getBookingStartDate,
  isFuture,
} from "../utils/bookingDateUtils";

export default function BookingScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { walkers, lastSelection, markSelectedWalker, createBooking } =
    useApp();
  const { show } = useToast();
  const { scheduleAt } = useLocalNotifications();

  // Resolve active walker (route params -> lastSelection fallback)
  const walkerId =
    route.params?.walkerId ??
    route.params?.walker?.id ??
    lastSelection?.walkerId ??
    null;

  const selected = useMemo(() => {
    if (!walkers || !walkerId) return null;
    return walkers.find((w) => w.id === walkerId) ?? null;
  }, [walkers, walkerId]);

  // Remember last selected walker in context (for convenience)
  useEffect(() => {
    if (selected?.id) markSelectedWalker(selected.id);
  }, [selected?.id, markSelectedWalker]);

  // Form state
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");
  const [duration, setDuration] = useState(60);
  const [dogName, setDogName] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Basic validation gate for enabling the submit button
  const canSubmit = useMemo(() => {
    if (!selected?.id) return false;
    if (!dogName.trim()) return false;
    if (!isValidDate(dateStr) || !isValidTime(timeStr)) return false;
    const iso = buildStartISO(dateStr, timeStr);
    if (!iso || !isFuture(iso)) return false;
    return true;
  }, [selected?.id, dogName, dateStr, timeStr, duration]);

  // Create and save booking in context and show feedback
  const onSubmit = async () => {
    setError("");
    if (!canSubmit) {
      setError("Please complete all required fields with valid values");
      return;
    }

    try {
      setSubmitting(true);
      const startISO = buildStartISO(dateStr, timeStr);

      await createBooking({
        walkerId: selected.id,
        walkerName: selected.name,
        pricePerHour: selected.price,
        startISO,
        durationMins: duration,
        dogName,
        notes,
      });

      Alert.alert("Success", "Your booking was created.");
      show("Booking created");
      navigation.navigate("BookingsTab", { screen: "BookingsList" });
    } catch (e) {
      console.warn(e);
      setError("Could not save booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Schedule a local notification 10 minutes before the chosen time
  const handleReminder = async () => {
    const bookingStart = getBookingStartDate(dateStr, timeStr);
    if (!bookingStart || isNaN(+bookingStart)) {
      Alert.alert("Pick a valid date/time first");
      return;
    }

    try {
      const remindAt = new Date(bookingStart.getTime() - 10 * 60 * 1000);
      await scheduleAt(remindAt, {
        title: "Walk starts soon 🐶",
        body: "Your walker arrives in ~10 minutes.",
      });
      Alert.alert("Reminder set!", "We’ll ping you 10 minutes before.");
    } catch (e) {
      Alert.alert("Couldn't schedule", e.message);
    }
  };

  // KeyboardAvoidingView and ScrollView so the form is usable on small screens
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.wrap}>
            <Text style={styles.h1}>Book a Walk</Text>

            {selected ? (
              <Text style={styles.sub}>
                {`Walker: ${selected.name} ($${selected.price}/hr, ⭐ ${selected.rating})`}
              </Text>
            ) : (
              <Text style={styles.sub}>Select a walker to begin.</Text>
            )}

            {/* Date */}
            <View style={styles.field}>
              <Text style={styles.label}>Date (YYYY-MM-DD) *</Text>
              <TextInput
                style={styles.input}
                placeholder="2025-11-16"
                value={dateStr}
                onChangeText={(t) => setDateStr(formatDateInput(t))}
                inputMode="numeric"
                maxLength={10}
                returnKeyType="next"
              />
            </View>

            {/* Time */}
            <View style={styles.field}>
              <Text style={styles.label}>Start Time (HH:mm, 24h) *</Text>
              <TextInput
                style={styles.input}
                placeholder="14:00"
                value={timeStr}
                onChangeText={(t) => setTimeStr(formatTimeInput(t))}
                inputMode="numeric"
                maxLength={5}
                returnKeyType="next"
              />
            </View>

            {/* Duration */}
            <View style={styles.field}>
              <Text style={styles.label}>Duration *</Text>
              <View style={styles.row}>
                {DURATIONS.map((d) => (
                  <Pressable
                    key={d}
                    onPress={() => setDuration(d)}
                    style={[styles.pill, duration === d && styles.pillActive]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        duration === d && styles.pillTextActive,
                      ]}
                    >
                      {d} min
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Dog Name */}
            <View style={styles.field}>
              <Text style={styles.label}>Dog Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Rammi"
                value={dogName}
                onChangeText={setDogName}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>

            {/* Notes */}
            <View style={styles.field}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: "top" }]}
                placeholder="Any special instructions?"
                value={notes}
                onChangeText={setNotes}
                multiline
              />
            </View>

            {!!error && <Text style={styles.error}>{error}</Text>}

            {/* Submit */}
            <Pressable
              onPress={onSubmit}
              disabled={!canSubmit || submitting}
              style={[
                styles.submit,
                (!canSubmit || submitting) && { opacity: 0.6 },
              ]}
            >
              <Text style={styles.submitText}>
                {submitting ? "Saving…" : "Create Booking"}
              </Text>
            </Pressable>

            {/* Reminder */}
            <Pressable
              onPress={handleReminder}
              style={{
                padding: 12,
                backgroundColor: "#4a6",
                borderRadius: 8,
                marginTop: 12,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                + Remind me 10 min before +
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  wrap: {
    flex: 1,
    padding: 20,
    paddingTop: 24,
    backgroundColor: "#fafafa",
    gap: 10,
  },
  h1: { fontSize: 22, fontWeight: "800" },
  sub: { color: "#555", marginBottom: 6 },
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
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  pillActive: { backgroundColor: "#2f6f6f" },
  pillText: { fontWeight: "700", color: "#222" },
  pillTextActive: { color: "#fff" },
  error: { color: "#b91c1c", marginTop: 4 },
  submit: {
    marginTop: 8,
    backgroundColor: "#2f6f6f",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
