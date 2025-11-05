/*
index.js
Notes:
- Registers the root React component (App) with Expo’s runtime.
- Expo loads this first, then renders <App />.
 */

import { registerRootComponent } from "expo";
import App from "./App";

//Ensures proper setup across iOS, Android, and Web
registerRootComponent(App);
