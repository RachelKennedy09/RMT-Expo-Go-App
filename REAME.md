1. faults - started a project with just create-expo-app without @latest and ran into lots of errors and warnings. restarted project with latest dependencies for smoother work for now and the future. Using the latest SDK demonstrates ability to initialize a modern RN/Expo environment and avoid peer-dependency conflicts.
   -- switched to tab navigator midway for a more in depth app

-- got in habbit of having tabs, with screen within and wrapping my head around that. making sure user can flow backwards to each screen or tab

-- after doing booking formed noticed the keyboard was in the way, fixed it so it was easily exitable.
the date needed automatic dashes and the time needed automatic colons

added a toast for messages for android users (delete booking success message)

set up account log in log out on account tabs, but wanted to have a real feel app to hand in so switched to have a rootnavigator and have the first screen to be a login or register route.
Used Authstack like we were taught

- created a register user for more ideal app usage
- created booking and get a number notifi ation on the tab for how many bookings you have
- learned: expo notifications, error handling for them, testing them etc.,
- - uadded real reminder button on booking screen
- -- "reset demo data" so can quickly reset it back to the initial state to test again or show a clean demo.

Routing graph (how it flows)
RootNavigator
├─ if (user == null) → AuthStack
│ ├─ LoginScreen
│ └─ RegisterScreen
└─ else → MainTabs
├─ HomeStack
│ ├─ HomeScreen
│ └─ BookingScreen (fill form, save booking)
├─ BookingStack
│ ├─ BookingsListScreen
│ └─ BookingDetailsScreen
└─ AccountStack
└─ AccountScreen (login state, logout, profile)

-- note that you have to toggle on and off the nearby only toggle button to turn it off

-“The app follows mobile-specific design principles: bottom-tab navigation for thumb reachability, safe-area padding for notched screens, large touch targets, and offline caching with AsyncStorage to support mobile use cases.”
