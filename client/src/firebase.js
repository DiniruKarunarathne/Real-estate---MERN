// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern---real-estate.firebaseapp.com",
  projectId: "mern---real-estate",
  storageBucket: "mern---real-estate.appspot.com",
  messagingSenderId: "983601286869",
  appId: "1:983601286869:web:74c18005ec43ada1e75c5c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);