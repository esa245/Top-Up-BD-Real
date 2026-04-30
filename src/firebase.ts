import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDQpGthu85N1VWb6mZNhJpMqhSkQ0tBVD8",
  authDomain: "top-up-bd-767a0.firebaseapp.com",
  databaseURL: "https://top-up-bd-767a0-default-rtdb.firebaseio.com",
  projectId: "top-up-bd-767a0",
  storageBucket: "top-up-bd-767a0.firebasestorage.app",
  messagingSenderId: "815713733718",
  appId: "1:815713733718:web:91d5809c0bce2727adfff7",
  measurementId: "G-ZC3SP25RTR"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
