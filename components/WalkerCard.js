/*
components/WalkerCard.js
Notes:
- Reusable pressable card for a walker row.
- Includes favorite heart (toggles without triggering onPress).
*/

import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function WalkerCard({
  id,
  name,
  rating = 5,
  walks = 0,
  price = 35,
  photo,
  isAvailable = true,
  bio,
  favorite = false,
  onToggleFavorite,
  onPress,
  distanceKm,
}) {
  const stars = "★★★★★".slice(0, Math.round(rating));

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Image source={{ uri: photo }} style={styles.avatar} resizeMode="cover" />

      <View style={{ flex: 1, gap: 6 }}>
        {/* Top row: name + availability + heart */}
        <View style={styles.rowBetween}>
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

          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(id);
            }}
            hitSlop={8}
          >
            <Feather
              name="heart"
              size={20}
              color={favorite ? "#e11d48" : "#bbb"}
              fill={favorite ? "#e11d48" : "none"} // makes it filled or outlined
            />
          </Pressable>
        </View>

        {/* Meta row */}
        <View style={styles.row}>
          <Text style={styles.rating}>{stars}</Text>
          <Text style={styles.muted}> · {walks} walks</Text>
          <Text style={styles.muted}> · ${price}/hr</Text>
          {typeof distanceKm === "number" && (
            <Text style={styles.muted}> · {distanceKm.toFixed(1)} km</Text>
          )}
        </View>

        {/* Bio */}
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
  row: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 6 },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: { fontSize: 16, fontWeight: "700", color: "#111" },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  badgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  rating: { color: "#e6b800", fontSize: 14 },
  muted: { color: "#666", fontSize: 13 },
  bio: { color: "#444", marginTop: 6 },
});
