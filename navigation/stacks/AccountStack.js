import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from "../../screens/AccountScreen";

const Stack = createNativeStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{ title: "Account" }}
      />
    </Stack.Navigator>
  );
}
