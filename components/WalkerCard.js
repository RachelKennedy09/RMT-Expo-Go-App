/*
components/WalkerCard.js
Notes:
- Reusable “card” for listing/selecting walkers (pressable for detail/booking).
- Encapsulates rating, availability, and core profile info.
- Props drive reuse (name, rating, price, photo, etc.).
- Card is a Pressable so tapping anywhere can navigate or open details.
 */

import { View, Text, Image, StyleSheet, Pressable } from "react-native";

export default function WalkerCard({
  name,
  rating = 5,
  walks = 0,
  price = 35,
  photo,
  isAvailable = true,
  bio,
  onPress,
}) {
  const stars = "★★★★★".slice(0, Math.round(rating));

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Image source={{ uri: photo }} style={styles.avatar} resizeMode="cover" />

      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.name}>{name}</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: isAvailable ? "#1f9d55" : "#aaa" },
            ]}
          >
            <Text style={styles.badgeText}>
              {isAvailable ? "Available" : "Busy"}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.ratng}>{stars}</Text>
          <Text style={styles.muted}>· {walks} walks</Text>
          <Text style={styles.muted}>· ${price}/hr</Text>
        </View>

        {bio ? (
          <Text style={styles.bio} numberOfLines={2}>
            {bio}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  pressed: { opacity: 0.9 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#eee",
  },
  info: { flex: 1 },
  row: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 6 },
  name: { fontSize: 16, fontWeight: "700", color: "#111" },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  rating: { color: "#e6b800", fontSize: 14 }, // gold-ish stars
  muted: { color: "#666", fontSize: 13 },
  bio: { color: "#444", marginTop: 6 },
});
