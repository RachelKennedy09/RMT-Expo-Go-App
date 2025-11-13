// data/walkers.js
// ------------------------------------------------------------
// Seed data for the offline demo version of the app.
// In a real production build, walkers would come from:
//   • a backend API (Node.js/Express)
//   • MongoDB Atlas
//   • or another cloud data source
//
// This file provides static walkers so the app works fully
// without internet, backend, or authentication.
// ------------------------------------------------------------

const WALKERS_SEED = [
  {
    id: "w1",
    name: "Alex",
    rating: 4.8,
    walks: 120,
    price: 35,
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Trail runner & dog whisperer. Loves long alpine walks.",
    isAvailable: true,
    favorite: false,

    // Coordinates around Banff / Lake Louise area
    lat: 51.1784,
    lng: -115.5708,
  },
  {
    id: "w2",
    name: "Maya",
    rating: 5.0,
    walks: 210,
    price: 40,
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
    bio: "Gentle training approach; specializes in high-energy dogs.",
    isAvailable: false,
    favorite: true,

    lat: 51.4254,
    lng: -116.1773,
  },
  {
    id: "w3",
    name: "Riley",
    rating: 4.7,
    walks: 80,
    price: 32,
    photo: "https://randomuser.me/api/portraits/men/12.jpg",
    bio: "Early-morning walks and obedience games.",
    isAvailable: true,
    favorite: false,

    lat: 51.0892,
    lng: -115.3596,
  },
];

export default WALKERS_SEED;
