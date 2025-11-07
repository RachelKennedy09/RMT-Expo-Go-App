import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from "../../screens/AccountScreen"; //login form lives here

const Stack = createNativeStackNavigator();

// shows login as the only screen pre-auth

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={AccountScreen}
        options={{ title: "Log in" }}
      />
    </Stack.Navigator>
  );
}
