# 🐾 **Rocky Mountain Tails (Expo Mobile App)**

A modern, mobile-first dog-walking app built with **React Native** and **Expo SDK 54**, demonstrating structured navigation, modular state management, geolocation filterting, local notifications, and polished mobile UX patterns.

Please **Note**: "Rocky Montain Tails" is not a typo - it is a play on words!

---

# **Table of Contents**

- [🐾 **Rocky Mountain Tails (Expo Mobile App)**](#-rocky-mountain-tails-expo-mobile-app)
- [**Table of Contents**](#table-of-contents)
  - [Overview](#overview)
  - [App Flow (Routing Graph)](#app-flow-routing-graph)
  - [Features](#features)
    - [**Booking Form**](#booking-form)
  - [**Nearby Walkers + Distance Detection**](#nearby-walkers--distance-detection)
    - [**Detect Huge Distances**](#detect-huge-distances)
    - [**Local Notifications**](#local-notifications)
  - [**Reset Demo Data**](#reset-demo-data)
  - [**Authentication (Demo Mode)**](#authentication-demo-mode)
    - [How it works](#how-it-works)
    - [Future Improvements](#future-improvements)
    - [**Like / Favorite a Walker**](#like--favorite-a-walker)
  - [Design Principles](#design-principles)
  - [Learning \& Development Notes](#learning--development-notes)
    - [Key Improvements \& Lessons](#key-improvements--lessons)
  - [How to Run \& Test](#how-to-run--test)
    - [Prerequisites](#prerequisites)
    - [Run on Mobile (Expo Go)](#run-on-mobile-expo-go)
    - [Try these Features](#try-these-features)
  - [Running on Web](#running-on-web)
    - [How to Run on the Web](#how-to-run-on-the-web)
  - [Tech Stack](#tech-stack)
  - [Future Improvements](#future-improvements-1)
  - [Reflection](#reflection)
  - [Author](#author)

---

## Overview

Rocky Mountain Tails simulates a real dog-walking service based out of Banff and Lake Louise, allowing users to:

- Register or log in
- Browse and “favorite” walkers
- Toggle **Nearby Only** using real GPS
- Book dog walks
- Receive **10-minute-before** local reminders
- Manage profile & developer tools from the Account tab

The project highlights:

- Clean navigation using **RootNavigator -> AuthStack/MainTabs -> Stack Screens**
- Modular architecture across screens, hooks, utils, and context
- Real geolocation + distance math
- Local persistence via AsyncStorage
- Notifications using **expo-notifications**

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

This mirrors real-world app structure: an authentication layer, post-login tab navigation, and nested page flows.

- **RootNavigator** decides if a user is logged in or not.
- **AuthStack** handles Login and Register routes.
- **MainTabs** holds the user experience after login.

---

## Features

### **Booking Form**

- Users can schedule walks by selecting a date, time, duration, and dog name.
- Auto-formatted inputs:
  - `YYYY-MM-DD`
  - `HH:mm`
- Validation before submission
- Android **Toast** feedback
- Smarter keyboard handling with `KeyboardAvoidingView`
- **NOTE**: To reduce complexity, the BookingScreen was refactored from **390 lines → ~300 lines** by extracting all input/validation logic into a shared `bookingDateUtils.js` file.

## **Nearby Walkers + Distance Detection**

Walkers include real coordinates in Banff/Lake Louise.  
When the user taps **📍 Use My Location**, the app:

1. Requests permissions
2. Retrieves device coordinates
3. Reverse-geocodes city/region
4. Filters walkers within a **25 km radius**

### **Detect Huge Distances**

If the user is extremely far away (e.g., Ottawa → Banff), the app displays:

> “No walkers found within 25 km. Rocky Mountain Tails walkers are based around Banff / Lake Louise, so this is expected if you're far away.”

This ensures the feature behaves logically for testers outside Alberta.

### **Local Notifications**

Implemented using **expo-notifications**:

- “Remind me 10 min before” button on BookingScreen
- Test Notification button under Account
- Updated to newest Expo API (`shouldShowBanner`, `shouldShowList`)
- Works inside **Expo Go** (no custom build needed)

## **Reset Demo Data**

Located under Account tab. Clears all stored data:

- `@rmt/walkers`
- `@rmt/bookings`
- `@rmt/lastSelection`

In a real production build, this button would be hidden.

In Expo Go, **DEV** is always true, which means
the button is intentionally visible so the instructor can test resets during evaluation.

## **Authentication (Demo Mode)**

This app uses local-only demo authentication — no real backend, and passwords are not stored anywhere.

### How it works

- On Register, the app collects:

  - Name
  - Email
  - Password (required, but never saved)
  - Dog Name (optional)

- When you create an account:

  - The app saves only: { id, name, email, dogName }
  - The password is ignored on purpose (beginner-friendly, demo-only)
  - User is logged in immediately after registering

- On Login, the app accepts any email + any password
  (password isn't validated, it simply completes the demo login flow)

### Future Improvements

A real version would connect to a backend such as:

- Node.js + Express + MongoDB
- Firebase Auth
- Appwrite
- Clerk

…and would hash + verify passwords securely.

### **Like / Favorite a Walker**

Every walker card includes a heart icon. Favorites:

- Toggle instantly (❤️red outline / 🤍 grey outline)
- Persist using AsyncStorage
- Update UI in real time

---

## Design Principles

- Bottom-tab navigation for thumb reachability
- Safe-area padding for notched screens
- Large, accessible touch targets
- AsyncStorage caching for offline stability
- Consistent styling and component structure
- Short, beginner-friendly doc notes across all files

---

## Learning & Development Notes

### Key Improvements & Lessons

- Restarted project using `create-expo-app@latest` for clean dependency management
- Adopted **Tab Navigation** for realistic mobile app flow
- Shortened BookingScreen by extracting logic into shared utils
- Learned how to separate UI from business logic
- Implemented geolocation + distance calculations
- Added local notifications with scheduling and permission handling
- Wrote clean, concise documentation for every component

---

## How to Run & Test

### Prerequisites

- Node 18+
- Expo CLI (`npm install -g expo-cli`)
- **Expo Go** app on your iPhone or Android device

### Run on Mobile (Expo Go)

- git clone https://github.com/RachelKennedy09/RMT-Expo-Go-App.git
- cd RMT-Expo-Go-App
- npm install
- npx expo start
- Scan the QR code in Expo Go.

### Try these Features

1. Login/Register

- Any credentials work (demo mode)

2. Nearby Walkers

- Tap “Use My Location”
- Toggle “Nearby Only”

3. Book a Walk

- Fill form -> Create booking

4. Reminders

- Book a walk about 11 mins from your current time.
- Tap “Remind me 10 min before” and notice the notification.

5. Account Tab

- Test Notification
- Reset Demo Data

6. Bookings Tab

- Auto-updating badge count

---

## Running on Web

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

- React Native, Expo SDK 54

- React Navigation (Tabs + Stacks)

- expo-notifications

- expo-location

- AsyncStorage

- Custom hooks, context, and utilities

- Expo Go + Metro Bundler

---

## Future Improvements

- Real backend authentication (JWT + MongoDB)
- Persisted cloud bookings (MongoDB Atlas)
- Server-based push notifications
- Profile & dog avatar uploads
- Theming + dark mode support

---

## Reflection

Midway through, I restarted the project using create-expo-app@latest to learn proper dependency management and avoid peer conflicts.

Switching to Tab Navigation helped me understand nested navigators and user flow design.

Extracting BookingScreen logic taught me the importance of separation of concerns.

Implementing geolocation, distance calculations, and notifications gave me real-world mobile development experience.

Adding Expo Web allowed me to demo the app both on my phone and browser, making the project more polished and flexible.

This project represents my growth into a structured, detail-oriented mobile developer.

---

## Author

**Rachel Kennedy**  
Software Development Bootcamp – University of British Columbia × Circuit Stream  
Fall 2025

GitHub: [RachelKennedy09](https://github.com/RachelKennedy09)
