import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"; // Firestore 추가
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js"; // Storage 추가
// ✅ Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyDzo8CrtIHYL43DgAGhbcMDjZL4k9d1oBQ",
  authDomain: "jvisionit-web.firebaseapp.com",
  projectId: "jvisionit-web",
  storageBucket: "jvisionit-web.firebasestorage.app", //이 부분 때문에 내 3시간 날아감 ㅠㅠㅠㅠ
  messagingSenderId: "288418922296",
  appId: "1:288418922296:web:711d0f2fb061adefa74bcd",
  measurementId: "G-DVQB1Y1M94",
};

// ✅ App 및 Auth 객체 생성
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ 모듈로 내보내기
export { app, auth, db, storage };
