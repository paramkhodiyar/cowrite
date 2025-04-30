// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQ6Szer8a_fAUdvcFxbI4qYPi0nuh1EnI",
  authDomain: "cowrite-8f074.firebaseapp.com",
  projectId: "cowrite-8f074",
  storageBucket: "cowrite-8f074.firebasestorage.app",
  messagingSenderId: "899840102090",
  appId: "1:899840102090:web:d94a14e8219fee04ab6e33",
  measurementId: "G-094HZ0BETX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);