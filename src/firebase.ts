import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBtA6IuG9Z74tT1JQwmRMp9LrXXh4i2Zqw",
  authDomain: "rn-incam.firebaseapp.com",
  databaseURL: "https://rn-incam-default-rtdb.firebaseio.com",
  projectId: "rn-incam",
  storageBucket: "rn-incam.firebasestorage.app",
  messagingSenderId: "811957444320",
  appId: "1:811957444320:web:8ced488b713f71a3c67a85"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
