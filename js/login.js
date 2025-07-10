const passwordInput = document.querySelector(
  '.modal-login-input input[type="password"]'
);
const usernameInput = document.querySelector(
  '.modal-login-input input[type="text"]'
);
const loginButton = document.querySelector(".modal-login-submitBtn");

// ✅ 실시간 입력 감지: 비밀번호 + 아이디 길이 확인
function updateButtonColor() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (username.length >= 1 && password.length >= 4) {
    loginButton.style.backgroundColor = "rgb(65 185 245)";
    loginButton.disabled = false;
  } else {
    loginButton.style.backgroundColor = "#bbbbbb";
  }
}

// 이벤트 연결
passwordInput.addEventListener("input", updateButtonColor);
usernameInput.addEventListener("input", updateButtonColor);

// 클릭 이벤트: 아이디 1글자 이상, 비밀번호 1글자 이상 확인
loginButton.addEventListener("click", function () {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (username.length < 1 || password.length < 1) {
    alert("아이디와 비밀번호를 입력해주세요.");
    return;
  }

  location.href = "../index.html";
});
