import { auth } from "./firebaseInit.js";
import { signInWithEmailAndPassword,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 관리자 로그인 함수
function loginAdmin(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const uid = user.uid;
      console.log("로그인 성공, UID:", uid);
      console.log("✅ 관리자 권한 확인됨");
    })
    .catch((error) => {
      console.error("❌ 로그인 실패:", error.code, error.message);
      alert("로그인 실패: " + error.message);
    });
}

// ✅ 모듈 실행 진입점 (이 안에서 DOM 접근)
export function initLoginModal() {
  console.log("🟢 initLoginModal 실행됨");

  const passwordInput = document.querySelector('.modal-login-input input[type="password"]');
  const usernameInput = document.querySelector('.modal-login-input input[type="text"]');
  const loginButton = document.querySelector('.modal-login-submitBtn');

  if (!passwordInput || !usernameInput || !loginButton) {
    console.warn("⛔ 로그인 input 요소가 아직 DOM에 없습니다.");
    return;
  }

  function updateButtonState() {
    const email = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const isValid = email.length >= 1 && password.length >= 4;

    loginButton.disabled = !isValid;
    loginButton.style.backgroundColor = isValid ? 'rgb(65 185 245)' : '#bbbbbb';
  }

  passwordInput.addEventListener('input', updateButtonState);
  usernameInput.addEventListener('input', updateButtonState);

  loginButton.addEventListener('click', () => {
    const email = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    loginAdmin(email, password);
  });

  console.log("🟢 로그인 모달 로직 연결 완료");
}

