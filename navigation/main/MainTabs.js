import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import HomeStack from "../stacks/HomeStack";
import BookingsStack from "../stacks/BookingsStack";
import AccountStack from "../stacks/AccountStack";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
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
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="BookingsStack"
        component={BookingsStack}
        options={{ title: "Bookings" }}
      />
      <Tab.Screen
        name="AccountStack"
        component={AccountStack}
        options={{ title: "Account" }}
      />
    </Tab.Navigator>
  );
}
