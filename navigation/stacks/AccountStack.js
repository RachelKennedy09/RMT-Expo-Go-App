/*
  AccountStack.js
  - Stack for the Account tab.
  - Currently only shows the main Account screen.
*/

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from "../../screens/AccountScreen";

const Stack = createNativeStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator>
      {/* User account settings / logout / dev tools */}
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{ title: "Account" }}
      />
    </Stack.Navigator>
  );
}
