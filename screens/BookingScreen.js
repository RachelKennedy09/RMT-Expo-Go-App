/*
  screens/BookingScreen.js
  Booking form: date, time, duration, dog name, notes.
  - Prefills walker from walkerId param (or lastSelection fallback)
  - Validates + saves via context.createBooking()
  - (NEW) Schedules a local notification 10 minutes before the walk start time
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
import { useApp } from "../context/AppContext";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "../components/Toast";
import { useLocalNotifications } from "../hooks/useLocalNotifications";

// ───────────────────────────────────────────────────────────────
// CONSTANTS / PURE HELPERS
// ───────────────────────────────────────────────────────────────

const DURATIONS = [30, 45, 60, 90];

/** digitsOnly(s): strip all non-digits (used by formatters) */
function digitsOnly(s = "") {
  return s.replace(/\D+/g, "");
}

/** formatDateInput: live-format to 'YYYY-MM-DD' as the user types */
function formatDateInput(raw) {
  const d = digitsOnly(raw).slice(0, 8);
  const y = d.slice(0, 4);
  const m = d.slice(4, 6);
  const day = d.slice(6, 8);
  let out = y;
  if (m.length) out += "-" + m;
  if (day.length) out += "-" + day;
  return out;
}

/** formatTimeInput: live-format to 'HH:mm' (24h) with clamping */
function formatTimeInput(raw) {
  let d = digitsOnly(raw).slice(0, 4);
  let h = d.slice(0, 2);
  let m = d.slice(2, 4);
  if (h.length === 2)
    h = String(Math.max(0, Math.min(23, +h))).padStart(2, "0");
  if (m.length === 2)
    m = String(Math.max(0, Math.min(59, +m))).padStart(2, "0");
  return m.length ? `${h}:${m}` : h;
}

export default function BookingScreen() {
  // ─────────────────────────────────────────────────────────────
  // NAV/CONTEXT HOOKS
  // ─────────────────────────────────────────────────────────────
  const route = useRoute();
  const navigation = useNavigation();
  const { walkers, lastSelection, markSelectedWalker, createBooking } =
    useApp();
  const { show } = useToast();

  // ─────────────────────────────────────────────────────────────
  // NOTIFICATIONS (local)
  // ─────────────────────────────────────────────────────────────
  // scheduleAt(date, override): schedules a local notification at an absolute Date.
  // Works on iOS + Android in Expo Go; requires notification permission (handled in the hook).
  const { scheduleAt } = useLocalNotifications();

  /** handleReminder(bookingStart: Date)
   * Schedules a "10 minutes before" reminder for the given start time.
   * Validates the incoming Date and shows user-friendly Alerts on errors.
   */
  async function handleReminder(bookingStart) {
    try {
      if (!(bookingStart instanceof Date) || isNaN(+bookingStart)) {
        Alert.alert("Pick a valid date/time first");
        return;
      }
      const remindAt = new Date(bookingStart.getTime() - 10 * 60 * 1000); // -10 min
      await scheduleAt(remindAt, {
        title: "Walk starts soon 🐶",
        body: "Your walker arrives in ~10 minutes.",
      });
      Alert.alert("Reminder set!", "We’ll ping you 10 minutes before.");
    } catch (e) {
      Alert.alert("Couldn't schedule", e.message);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // WALKER RESOLUTION (param → object → lastSelection)
  // ─────────────────────────────────────────────────────────────
  /** Resolve active walker id from multiple possible sources */
  const walkerId =
    route.params?.walkerId ??
    route.params?.walker?.id ??
    lastSelection?.walkerId ??
    null;

  /** Derive the selected walker object from the current list */
  const selected = useMemo(() => {
    if (!walkers || !walkerId) return null;
    return walkers.find((w) => w.id === walkerId) ?? null;
  }, [walkers, walkerId]);

  /** Persist last selected for convenience/deeplinks */
  useEffect(() => {
    if (selected?.id) markSelectedWalker(selected.id);
  }, [selected?.id, markSelectedWalker]);

  // ─────────────────────────────────────────────────────────────
  // FORM STATE
  // ─────────────────────────────────────────────────────────────
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");
  const [duration, setDuration] = useState(60);
  const [dogName, setDogName] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ─────────────────────────────────────────────────────────────
  // VALIDATION HELPERS
  // ─────────────────────────────────────────────────────────────
  /** Basic format checks for date/time */
  const isValidDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
  const isValidTime = (s) => /^\d{2}:\d{2}$/.test(s);

  /** isFuture(iso): true if ISO string represents a future moment */
  const isFuture = (iso) => new Date(iso).getTime() > Date.now();

  /** buildStartISO(): safely compose ISO string from form fields in local time */
  const buildStartISO = () => {
    const [yy, mm, dd] = dateStr.split("-").map(Number);
    const [HH, MM] = timeStr.split(":").map(Number);
    if (!yy || !mm || !dd || HH === undefined || MM === undefined) return null;
    const local = new Date(yy, mm - 1, dd, HH, MM, 0);
    return local.toISOString();
  };

  /** getBookingStartDate(): same as buildStartISO but returns a Date (for notifications) */
  const getBookingStartDate = () => {
    const [yy, mm, dd] = dateStr.split("-").map(Number);
    const [HH, MM] = timeStr.split(":").map(Number);
    if (!yy || !mm || !dd || HH === undefined || MM === undefined) return null;
    return new Date(yy, mm - 1, dd, HH, MM, 0); // local time Date object
  };

  /** canSubmit: memoized gatekeeper for enabling the submit button */
  const canSubmit = useMemo(() => {
    if (!selected?.id) return false;
    if (!dogName.trim()) return false;
    if (!isValidDate(dateStr) || !isValidTime(timeStr)) return false;
    const iso = buildStartISO();
    if (!iso || !isFuture(iso)) return false;
    return true;
  }, [selected?.id, dogName, dateStr, timeStr, duration]);

  // ─────────────────────────────────────────────────────────────
  // SUBMIT HANDLER
  // ─────────────────────────────────────────────────────────────
  /** onSubmit: validates and creates the booking via context.createBooking() */
  const onSubmit = async () => {
    setError("");
    if (!canSubmit) {
      setError("Please complete all required fields with valid values");
      return;
    }
    try {
      setSubmitting(true);
      const startISO = buildStartISO();

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

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
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

            {/* Reminder button (builds Date from current form values) */}
            <Pressable
              onPress={() => {
                const startDate = getBookingStartDate();
                if (!startDate) {
                  Alert.alert("Pick a valid date/time first");
                  return;
                }
                handleReminder(startDate);
              }}
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
