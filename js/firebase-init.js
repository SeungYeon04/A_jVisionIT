// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_0cZIdyybx7uSCSeuerSaYJCeX68ZQuM",
  authDomain: "my-bulletin-board-acacf.firebaseapp.com",
  projectId: "my-bulletin-board-acacf",
  storageBucket: "my-bulletin-board-acacf.firebasestorage.app",
  messagingSenderId: "551185219470",
  appId: "1:551185219470:web:a4a4daf06d67f1fcc1eedf",
  measurementId: "G-NC3236CFK7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
