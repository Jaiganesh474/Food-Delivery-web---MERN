// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "eatsure-foods.firebaseapp.com",
  projectId: "eatsure-foods",
  storageBucket: "eatsure-foods.firebasestorage.app",
  messagingSenderId: "256524451920",
  appId: "1:256524451920:web:48636914255a8a05691155"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)

export {app,auth}