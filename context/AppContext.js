/**
 * context/AppContext.js
 * Notes:
 * - Centralizes all app state (walkers, bookings, user, location).
 * - Loads persisted data if available, otherwise falls back to seed walkers.
 * - Exposes reusable actions (toggleFavorite, getUserLocation, etc.).
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocationOnce } from "../hooks/useLocation";
import WALKERS_SEED from "../data/walkers";

const AppContext = createContext(null);

const STORAGE_KEYS = {
  WALKERS: "@rmt/walkers",
  LAST_SELECTION: "@rmt/lastSelection",
  BOOKINGS: "@rmt/bookings",
  USER: "@rmt/user",
};

export function AppProvider({ children }) {
  const [walkers, setWalkers] = useState(null);
  const [lastSelection, setLastSelection] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // --- Load persisted state on mount ---
  useEffect(() => {
    (async () => {
      try {
        const [w, sel, b, u] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.WALKERS),
          AsyncStorage.getItem(STORAGE_KEYS.LAST_SELECTION),
          AsyncStorage.getItem(STORAGE_KEYS.BOOKINGS),
          AsyncStorage.getItem(STORAGE_KEYS.USER),
        ]);
        // start with saved or seed
        let loadedWalkers = w ? JSON.parse(w) : WALKERS_SEED;

        const looksOld =
          !Array.isArray(loadedWalkers) ||
          loadedWalkers.length < WALKERS_SEED.length ||
          loadedWalkers.some(
            (x) => typeof x.lat !== "number" || typeof x.lng !== "number"
          );

        if (looksOld) {
          loadedWalkers = WALKERS_SEED;
          await AsyncStorage.setItem(
            STORAGE_KEYS.WALKERS,
            JSON.stringify(WALKERS_SEED)
          );
        }

        setWalkers(loadedWalkers);
        setLastSelection(sel ? JSON.parse(sel) : null);
        setBookings(b ? JSON.parse(b) : []);
        setUser(u ? JSON.parse(u) : null);
      } catch (err) {
        console.warn("⚠️ Failed to load storage:", err);
        setWalkers(WALKERS_SEED);
        setBookings([]);
      }
    })();
  }, []);

  // --- Persistence helpers ---
  const persistWalkers = async (next) => {
    setWalkers(next);
    await AsyncStorage.setItem(STORAGE_KEYS.WALKERS, JSON.stringify(next));
  };

  const persistBookings = async (next) => {
    setBookings(next);
    await AsyncStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(next));
  };

  const persistUser = async (u) => {
    setUser(u);
    if (u) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    }
  };

  // --- Actions ---
  const actions = useMemo(
    () => ({
      toggleFavorite: async (walkerId) => {
        if (!walkers) return;
        const next = walkers.map((w) =>
          w.id === walkerId ? { ...w, favorite: !w.favorite } : w
        );
        await persistWalkers(next);
      },

      markSelectedWalker: async (walkerId) => {
        const sel = { walkerId, at: Date.now() };
        setLastSelection(sel);
        await AsyncStorage.setItem(
          STORAGE_KEYS.LAST_SELECTION,
          JSON.stringify(sel)
        );
      },

      createBooking: async (input) => {
        const id = `${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .slice(2, 8)}`;

        const booking = {
          id,
          walkerId: input.walkerId,
          walkerName: input.walkerName,
          pricePerHour: input.pricePerHour,
          startISO: input.startISO,
          durationMins: input.durationMins,
          dogName: (input.dogName ?? "").trim(),
          notes: input.notes?.trim() || "",
          createdAt: new Date().toISOString(),
        };

        const next = [booking, ...(bookings ?? [])];
        await persistBookings(next);
        return booking.id;
      },

      getBookingById: (id) => bookings?.find((b) => b.id === id) || null,

      deleteBooking: async (id) => {
        const next = (bookings ?? []).filter((b) => b.id !== id);
        await persistBookings(next);
      },

      updateBooking: async (id, patch) => {
        const next = (bookings ?? []).map((b) =>
          b.id === id ? { ...b, ...patch } : b
        );
        await persistBookings(next);
      },

      // --- Geolocation actions ---
      getUserLocation: async () => {
        const res = await getLocationOnce({ withAddress: true });
        if (res.error) return res;
        setUserLocation(res);
        return res;
      },

      clearUserLocation: () => setUserLocation(null),

      // --- Simple mock auth actions ---
      register: async ({ name, email }) => {
        const newUser = { id: `u_${Date.now()}`, name, email };
        await persistUser(newUser);
        return newUser;
      },

      login: async ({ email }) => {
        const existing = { id: `u_${Date.now()}`, name: "Guest", email };
        await persistUser(existing);
        return existing;
      },

      logout: async () => {
        await persistUser(null);
      },
    }),
    [walkers, bookings]
  );

  // --- Context value ---
  const value = useMemo(
    () => ({
      walkers,
      lastSelection,
      bookings,
      user,
      isLoggedIn: !!user,
      userLocation,
      ...actions,
    }),
    [walkers, lastSelection, bookings, user, userLocation, actions]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
