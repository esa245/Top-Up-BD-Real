import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCmZMSZEqZbgjY6q9rBp1N4FJDqa20T6WE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "count-time-7e879.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://count-time-7e879-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "count-time-7e879",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "count-time-7e879.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "38354668085",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:38354668085:web:2454db9219b908acbc3f7c",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-J12WRP3LEE"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
