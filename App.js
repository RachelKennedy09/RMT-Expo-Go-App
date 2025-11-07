/*
App.js
Notes:
- Root entry of the app.
- Wraps everything with global providers (App + Toast).
- RootNavigator decides: show Login (AuthStack) or MainTabs.
*/

import { StatusBar } from "expo-status-bar";
import { AppProvider } from "./context/AppContext";
import { ToastProvider } from "./components/Toast";
import RootNavigator from "./navigation/RootNavigator";

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </ToastProvider>
    </AppProvider>
  );
}
