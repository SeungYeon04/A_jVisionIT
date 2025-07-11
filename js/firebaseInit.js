
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
// ✅ Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyDzo8CrtIHYL43DgAGhbcMDjZL4k9d1oBQ",
  authDomain: "jvisionit-web.firebaseapp.com",
  projectId: "jvisionit-web",
  storageBucket: "jvisionit-web.firebaseapp.com",
  messagingSenderId: "288418922296",
  appId: "1:288418922296:web:711d0f2fb061adefa74bcd",
  measurementId: "G-DVQB1Y1M94"
};

// ✅ App 및 Auth 객체 생성
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ 모듈로 내보내기
export { app, auth };