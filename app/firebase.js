// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Required for side-effects
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7_RKL3Wo2IfZiXHBU6JtDd_57lgWsS3g",
  authDomain: "expense-tracker-ed0fa.firebaseapp.com",
  projectId: "expense-tracker-ed0fa",
  storageBucket: "expense-tracker-ed0fa.firebasestorage.app",
  messagingSenderId: "418522448704",
  appId: "1:418522448704:web:4bafb903add7dc2551b0a5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
