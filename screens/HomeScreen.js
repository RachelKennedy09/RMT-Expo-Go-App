/*
screens/HomeScreen.js
Notes:
- Main Screen
 */

import { View, Text, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

import WalkerCard from "../components/WalkerCard";

const WALKERS = [
  {
    id: "w1",
    name: "Alex",
    rating: 4.8,
    walks: 120,
    price: 35,
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Trail runner & dog whisperer. Loves long alpine walks.",
    isAvailable: true,
  },
  {
    id: "w2",
    name: "Maya",
    rating: 5,
    walks: 210,
    price: 40,
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
    bio: "Gentle training approach, specializes in high-energy dogs.",
    isAvailable: false,
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Find Your Mountain Walker</Text>
      <Text style={styles.sub}>Trusted locals with great reviews.</Text>

      <FlatList
        data={WALKERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 12 }}
        renderItem={({ item }) => (
          <WalkerCard
            {...item}
            onPress={() => navigation.navigate("Booking", { walker: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, paddingTop: 24, backgroundColor: "#fafafa" },
  h1: { fontSize: 22, fontWeight: "800" },
  sub: { color: "#555", marginBottom: 8 },
});
