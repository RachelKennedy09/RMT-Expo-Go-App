/*
context/AppContext.js
Notes:
- Centralizes domain data (walkers, last selection) and exposes actions.
- Persistence strategy: load once on mount, write-through on changes.
- Context = a “global store” you can read/write from any screen.
- AsyncStorage only stores strings; we JSON.stringify objects.
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AppContext = createContext(null);

// keys for storage
const STORAGE_KEYS = {
  WALKERS: "@rmt/walkers",
  LAST_SELECTION: "@rmt/lastSelection",
  BOOKINGS: "@rmt/bookings",
};

// seed data for now (can be replaced by API)
const DEFAULT_WALKERS = [
  {
    id: "w1",
    name: "Alex",
    rating: 4.8,
    walks: 120,
    price: 35,
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Trail runner & dog whisperer. Loves long alpine walks.",
    isAvailable: true,
    favorite: false,
  },
  {
    id: "w2",
    name: "Maya",
    rating: 5,
    walks: 210,
    price: 40,
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
    bio: "Gentle training approach; specializes in high-energy dogs.",
    isAvailable: false,
    favorite: true,
  },
];

export function AppProvider({ children }) {
  const [walkers, setWalkers] = useState(null); //null until loaded
  const [lastSelection, setLastSelection] = useState(null); // { walkerId, at }
  const [bookings, setBookings] = useState(null); //null until loaded

  // --- Load persisted state once on mount ---
  useEffect(() => {
    (async () => {
      try {
        const [w, sel, b] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.WALKERS),
          AsyncStorage.getItem(STORAGE_KEYS.LAST_SELECTION),
          AsyncStorage.getItem(STORAGE_KEYS.BOOKINGS),
        ]);

        setWalkers(w ? JSON.parse(w) : DEFAULT_WALKERS);
        setLastSelection(sel ? JSON.parse(sel) : null);
        setBookings(b ? JSON.parse(b) : []);
      } catch (err) {
        console.warn("Failed to load storage:", err);
        // Fallback to defaults if parsing failed
        setWalkers(DEFAULT_WALKERS);
      }
    })();
  }, []);

  // --- Write-through persistence helpers ---
  const persistWalkers = async (next) => {
    setWalkers(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WALKERS, JSON.stringify(next));
    } catch (err) {
      console.warn("Failed to save walkers:", err);
    }
  };

  const persistLastSelection = async (sel) => {
    setLastSelection(sel);
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_SELECTION,
        JSON.stringify(sel)
      );
    } catch (err) {
      console.warn("Failed to save selection:", err);
    }
  };

  const persistBookings = async (next) => {
    setBookings(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(next));
    } catch (err) {
      console.warn("Failed to save bookings:", err);
    }
  };

  // --- Actions exposed to screens ---
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
        await persistLastSelection(sel);
      },

      // Example: update a walker’s availability (would come from server later)
      setAvailability: async (walkerId, isAvailable) => {
        if (!walkers) return;
        const next = walkers.map((w) =>
          w.id === walkerId ? { ...w, isAvailable } : w
        );
        await persistWalkers(next);
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
          startISO: input.startISO, // "2025-11-16T14....."
          durationMins: input.durationMins, // 30, 45, 60, 90
          dogName: input.dogName.trim(),
          notes: input.notes?.trim() || "",
          createdAt: new Date().toISOString(),
        };

        const next = [booking, ...(bookings ?? [])]; //newest first
        await persistBookings(next);
        return booking.id;
      },

      getBookingById: (id) => {
        if (!bookings) return null;
        return bookings.find((b) => b.id === id) || null;
      },

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }),
    [walkers, bookings]
  );

  const value = useMemo(
    () => ({
      walkers,
      lastSelection,
      bookings,
      ...actions,
    }),
    [walkers, lastSelection, bookings, actions]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook for consumers
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
