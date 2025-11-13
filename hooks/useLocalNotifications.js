// hooks/useLocalNotifications.js
// Notes:
// - Handles local notification permissions + scheduling.
// - Exports helpers for test notifications + booking reminders.

import * as Notifications from "expo-notifications";
import { useEffect, useCallback } from "react";
import { Platform } from "react-native";

// Default notification display settings
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useLocalNotifications() {
  // Ask permission + create Android channel once
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Notification permission not granted.");
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    })();
  }, []);

  // Notification after N seconds (used by test button)
  const scheduleInSeconds = useCallback(async (seconds = 5, override = {}) => {
    return Notifications.scheduleNotificationAsync({
      content: {
        title: "Notification",
        body: `Fires in ${seconds}s`,
        ...override,
      },
      trigger: { seconds },
    });
  }, []);

  // Notification at exact date-time (used by “Remind me 10 min before”)
  const scheduleAt = useCallback(async (date, override = {}) => {
    if (!(date instanceof Date) || isNaN(+date)) {
      throw new Error("Invalid Date passed to scheduleAt()");
    }
    if (date <= new Date()) {
      throw new Error("Cannot schedule a notification in the past.");
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

  // Optional: register listeners (foreground + tapping)
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

  return { scheduleInSeconds, scheduleAt, addListeners };
}
