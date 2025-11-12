// hooks/useLocalNotifications.js

// WHAT: A custom React hook that encapsulates local notifications logic.
// WHY: Keeps App.js and screens clean; gives reusable functions.
// WORKS IN: Expo Go (local notifications only).

import * as Notifications from "expo-notifications";
import { useEffect, useCallback } from "react";
import { Platform } from "react-native";

// Show banners/lists by default when a notification fires 
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // Deprecated: shouldShowAlert
    // Use shouldShowBanner (iOS) and shouldShowList (iOS notification center)
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useLocalNotifications() {
  // one time ask permission and setup Android channel
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Notification permission not granted (user declined).");
      }

      //Android requires a notification channel to show notifications.
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
          //sound, vibration, etc. customized here
        });
      }
    })();
  }, []);

  // Helper to schedule a notification in N seconds.
  const scheduleInSeconds = useCallback(async (seconds = 5, override = {}) => {
    return Notifications.scheduleNotificationAsync({
      content: {
        title: "Test notification",
        body: `Firing in ${seconds}s`,
        ...override,
      },
      trigger: { seconds },
    });
  }, []);

  // Schedule specific Date (e.g., 10 min before a booking time).
  const scheduleAt = useCallback(async (date, override = {}) => {
    if (!(date instanceof Date) || isNaN(+date)) {
      throw new Error("Invalid Date passed to scheduleAt()");
    }
    const now = new Date();
    if (date <= now) {
      throw new Error("Chosen time is in the past");
    }
    return Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder",
        body: "Your event is coming up!",
        ...override,
      },
      trigger: { date },
    });
  }, []);

  // onReceive: fires when a notification arrives in foreground.
  // onRespond: fires when user taps the notification.
  const addListeners = useCallback((onReceive, onRespond) => {
    const sub1 = Notifications.addNotificationReceivedListener(
      onReceive ?? (() => {})
    );
    const sub2 = Notifications.addNotificationResponseReceivedListener(
      onRespond ?? (() => {})
    );
    return () => {
      sub1.remove();
      sub2.remove();
    };
  }, []);

  // Expose the 3 helpers
  return { scheduleInSeconds, scheduleAt, addListeners };
}
