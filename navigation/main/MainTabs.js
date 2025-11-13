/*
  MainTabs.js
  - Bottom tab navigation shown after login.
  - Tabs: Home, Bookings (with badge), Account.
*/

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import HomeStack from "../stacks/HomeStack";
import BookingsStack from "../stacks/BookingsStack";
import AccountStack from "../stacks/AccountStack";
import { useApp } from "../../context/AppContext";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { bookings } = useApp(); // total bookings for badge
  const badge = bookings?.length ? bookings.length : undefined;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2f6f6f",

        // Default icon mapping if not overridden
        tabBarIcon: ({ color, size }) => {
          const map = {
            HomeStack: "home",
            BookingsStack: "calendar",
            AccountStack: "settings",
          };
          return <Feather name={map[route.name]} size={size} color={color} />;
        },
      })}
    >
      {/* Home */}
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" color={color} size={size} />
          ),
        }}
      />

      {/* Bookings */}
      <Tab.Screen
        name="BookingsTab"
        component={BookingsStack}
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
          tabBarBadge: badge, // shows number of bookings
        }}
      />

      {/* Account */}
      <Tab.Screen
        name="AccountTab"
        component={AccountStack}
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
