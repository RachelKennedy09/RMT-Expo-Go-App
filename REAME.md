# 🐾 **Rocky Mountain Tails (Expo Mobile App)**

A modern, mobile-first dog-walking app built with **React Native** and **Expo SDK 54**, demonstrating full navigation structure, state management, local notifications, and thoughtful UX design for real-world usability.

---

## 📘 Table of Contents

- [🐾 **Rocky Mountain Tails (Expo Mobile App)**](#-rocky-mountain-tails-expo-mobile-app)
  - [📘 Table of Contents](#-table-of-contents)
  - [Overview](#overview)
  - [App Flow (Routing Graph)](#app-flow-routing-graph)
  - [Features](#features)
    - [**Booking Form**](#booking-form)
    - [**Local Notifications (Expo Notifications)**](#local-notifications-expo-notifications)
    - [**Reset Demo Data**](#reset-demo-data)
    - [**Authentication (Demo Mode)**](#authentication-demo-mode)
      - [Future Improvements](#future-improvements)
    - [**Like / Favorite a Walker**](#like--favorite-a-walker)
  - [Design Principles](#design-principles)
  - [Learning \& Development Notes](#learning--development-notes)
    - [Challenges \& Solutions](#challenges--solutions)
  - [How to Run \& Test](#how-to-run--test)
    - [Prerequisites](#prerequisites)
    - [Run the project (Expo For App)](#run-the-project-expo-for-app)
  - [Web Deployment (Expo for Web)](#web-deployment-expo-for-web)
    - [How to Run on the Web](#how-to-run-on-the-web)
  - [Tech Stack](#tech-stack)
  - [Future Improvements](#future-improvements-1)
  - [Reflection](#reflection)
  - [Author](#author)

---

## Overview

Rocky Mountain Tails is a mobile app designed to simulate a real dog-walking business experience.  
Users can log in, register, book walks with available walkers/nearby walkers, view their bookings, receive **local reminder notifications**, and manage their profile through the **Account tab**.

The project demonstrates:

- Clean navigation using **RootNavigator** with an **AuthStack** and **Tab Navigator**
- Organized, modular screen components
- Mobile-first interaction patterns (keyboard handling, safe areas, pressable UI)
- Local data persistence via **AsyncStorage**
- Functional demo authentication and reminder notifications

---

## App Flow (Routing Graph)

- **RootNavigator**
  - if (user == null) → **AuthStack**
    - LoginScreen
    - RegisterScreen
  - else → **MainTabs**
    - **HomeStack**
      - HomeScreen
      - BookingScreen _(fill form, save booking, set reminders)_
    - **BookingStack**
      - BookingsListScreen
      - BookingDetailsScreen
    - **AccountStack**
      - AccountScreen _(login state, logout, notifications, reset demo data)_

This architecture mirrors real production navigation:

- **RootNavigator** decides if a user is logged in or not.
- **AuthStack** handles Login and Register routes.
- **MainTabs** holds the user experience after login.

---

## Features

### **Booking Form**

- Users can schedule walks by selecting a date, time, duration, and dog name.
- Form auto-formats inputs:
  - Date → automatic dashes (`YYYY-MM-DD`)
  - Time → automatic colons (`HH:mm`)
- Validates fields before submission.
- Uses **KeyboardAvoidingView** for smooth UX (keyboard no longer blocks inputs).
- Displays success toast messages (Android) after booking creation.

### **Local Notifications (Expo Notifications)**

- Integrated **expo-notifications** with full permission handling.
- Works on **iPhone and Android** in **Expo Go** (no EAS build required).
- Adds “Remind me 10 min before” button on BookingScreen to schedule a reminder.
- Includes a **Test Notification** button under Account for demonstration.
- Updated to the latest Expo API (`shouldShowBanner` / `shouldShowList`).

### **Reset Demo Data**

- “Reset Demo Data” button on Account page clears AsyncStorage:
  - `@rmt/walkers`
  - `@rmt/bookings`
  - `@rmt/lastSelection`
- Allows quick re-seeding of demo walkers without reinstalling the app.
- Hidden in production using `__DEV__` so it’s only visible during development.

### **Authentication (Demo Mode)**

For demonstration purposes, the login screen does **not** perform real credential validation.  
Any email and password combination logs the user in and displays “Welcome back.”

This simulates an authentication flow to demonstrate:

- Navigation through RootNavigator → MainTabs
- Form handling & basic validation
- Logged-in state persistence via context

#### Future Improvements

In a production version, this flow would connect to a backend service (e.g., **Node.js + MongoDB**, **Firebase Auth**, or **Appwrite**) to securely verify user credentials.

### **Like / Favorite a Walker**

- Each walker card includes a **heart** icon that users can tap to “like” or “favorite” a walker.
- The heart toggles between **red outline** and **grey outline** states for visual feedback.
- Favorites are saved locally using **AsyncStorage**, allowing the user’s liked walkers to persist between app sessions.
- This feature demonstrates:
  - Local state updates for individual walker components
  - Interactive UI handling with `useState`
  - Real-time visual feedback and persistence in a mobile environment

---

## Design Principles

The app follows mobile-specific design principles: bottom-tab navigation for thumb reachability, safe-area padding for notched screens, large touch targets, and offline caching with AsyncStorage to support mobile use cases.

UI improvements added during development:

- Adjusted `KeyboardAvoidingView` for cross-platform consistency.
- Added **Toast notifications** for Android user feedback.
- Used consistent color palette across screens (green, white, earthy tones).
- Separated logic into **context**, **hooks**, and **screens** for clarity.

---

## Learning & Development Notes

### Challenges & Solutions

| Challenge                              | Solution / Learning Outcome                                                                                |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Started project without `@latest` flag | Re-initialized with `create-expo-app@latest` to ensure SDK 54 compatibility and smoother peer dependencies |
| Needed deeper app structure            | Switched to **Tab Navigator** mid-project to support multiple stacks                                       |
| Keyboard overlapped form fields        | Implemented `KeyboardAvoidingView` + dismiss gesture                                                       |
| Date/time input formatting             | Created custom `formatDateInput()` & `formatTimeInput()` helpers                                           |
| Android feedback missing               | Implemented **Toast** for success messages                                                                 |
| Needed reminders                       | Learned **expo-notifications**, error handling, and scheduling                                             |
| Re-seeding demo data                   | Added “Reset Demo Data” developer button using AsyncStorage                                                |
| Authentication realism                 | Added `AuthStack` with Login/Register routes and mock validation                                           |

---

## How to Run & Test

### Prerequisites

- Node 18+
- Expo CLI (`npm install -g expo-cli`)
- **Expo Go** app on your iPhone or Android device

### Run the project (Expo For App)

1. git clone https://github.com/RachelKennedy09/RMT-Expo-Go-App.git

- cd RMT-Expo-Go-App
- npm install
- npx expo start
- Scan the QR code in Expo Go.

2. Testing the Features

- Login / Register
- Use any email and password.

3. You’ll be taken to the Home tab and see “Welcome back.” (Demo mode/Beginner App)

4. Book a Walk

- Open any walker profiles from Home tab.
- Enter valid date/time/duration/dog name.
- Press Create Booking.
- Success alert + toast appear.

5. Reminders

- After booking, tap Remind me 10 min before.
- A local notification will appear after the correct delay (or in 3 s for test mode).

6. Account Tab

- Press Test Notification -> banner appears in ~3 s.
- Press Reset Demo Data (dev-only) -> clears AsyncStorage; restart app to reseed walkers.

7. Bookings Tab

- Displays created bookings; badge updates with total count.

---

## Web Deployment (Expo for Web)

In addition to running natively on iOS and Android, this project is configured to run on the **web** using Expo’s web renderer (React DOM).  
This allows the developer/professor to open and test the app in a browser without needing a mobile device.

### How to Run on the Web

1. From the project root:

- npm install
- npx expo start --web

2.  This will:

- Start the Expo web bundler.
- Automatically open the app in your default browser at http://localhost:8081 or another available port.
- Show a fully functional web version of the app with the same navigation, screens, and logic as the mobile version.
- Some mobile-native features (like expo-notifications) are limited on the web, but the app structure and navigation remain identical.

---

## Tech Stack

- **Framework**: React Native + Expo SDK 54
- **Platform Support**: Android | iOS | Web (via expo for web)
- **Language**: JavaScript (ES Modules)
- **Navigation**: @react-navigation/native, Tab + Stack Navigators
- **State**: Custom useApp() Context
- **Storage**: AsyncStorage
- **Notifications**: expo-notifications
- **UI**: React Native core components + custom styles
- **Dev Tools**: Expo Go, Metro Bundler, VS Code

---

## Future Improvements

- Real backend authentication (JWT + MongoDB)
- Persisted cloud bookings (MongoDB Atlas)
- Push notifications via Expo Push API
- Profile photos and dog avatars
- Theming and dark mode

---

## Reflection

Midway through, I restarted the project using create-expo-app@latest to learn proper dependency management and avoid peer conflicts.

Switching to Tab Navigation helped me understand nested navigators and user flow design.

Implementing notifications and AsyncStorage taught me real-world mobile patterns.  
After building the mobile app, I challenged myself to add web support so the app could also run in a browser.

Learning Expo for Web helped me understand how React Native bridges to React DOM, and how to adapt layouts for multi-platform deployment.  
Being able to demo my app both on phone and browser gives my project professional versatility.

Overall, this project represents my growth from early Expo warnings to a smooth, well-structured React Native app that feels real.

---

## Author

**Rachel Kennedy**  
Software Development Bootcamp – University of British Columbia × Circuit Stream  
Fall 2025

GitHub: [RachelKennedy09](https://github.com/RachelKennedy09)
