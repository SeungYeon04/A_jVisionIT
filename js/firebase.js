// Firebase SDK import (CDN 버전)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// 네가 Firebase 콘솔에서 가져온 설정
const firebaseConfig = {
  apiKey: "AIzaSyDzo8CrtIHYL43DgAGhbcMDjZL4k9d1oBQ",
  authDomain: "jvisionit-web.firebaseapp.com",
  databaseURL: "https://jvisionit-web-default-rtdb.firebaseio.com",
  projectId: "jvisionit-web",
  storageBucket: "jvisionit-web.appspot.com", // ❗오타 수정했음 (밑에 설명)
  messagingSenderId: "288418922296",
  appId: "1:288418922296:web:711d0f2fb061adefa74bcd",
  measurementId: "G-DVQB1Y1M94"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firestore & Storage 인스턴스 export
export const db = getFirestore(app);
export const storage = getStorage(app);
