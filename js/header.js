import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth } from "./firebaseInit.js";

// 🔹 로그인 모달 열기
function openLoginModal() {
  fetch('/module/login.html')
    .then(res => res.text())
    .then(html => {
      const backdrop = document.getElementById('login-backdrop');
      const container = document.getElementById('login-modal-container');

      container.innerHTML = html;
      backdrop.style.display = 'block';
      container.style.display = 'block';

      backdrop.onclick = () => {
        container.innerHTML = '';
        backdrop.style.display = 'none';
        container.style.display = 'none';
      };

      import('/js/login.js').then(module => {
        module.initLoginModal();
      });
    });
}
window.openLoginModal = openLoginModal;

// 🔹 모바일 메뉴 토글
function toggleMenu() {
  const modal = document.getElementById("modal-menu");
  const backdrop = document.getElementById("menu-backdrop");
  const isOpen = modal.classList.contains("show");

  if (isOpen) {
    modal.classList.remove("show");
    backdrop.style.display = "none";
  } else {
    modal.classList.add("show");
    backdrop.style.display = "block";
  }
}
window.toggleMenu = toggleMenu;

// 🔹 Mega Menu 설정
const header = document.querySelector(".header-bottom");
const menu = document.querySelector(".menu");
const megaMenu = document.getElementById("mega-menu");
const backdrop = document.getElementById("mega-backdrop");

if (!header || !megaMenu) {
  console.warn("❌ header 또는 megaMenu가 존재하지 않음");
} else {
  let isOver = false;
  let timer;

  const openMenu = () => {
    megaMenu.classList.add("show");
    backdrop.classList.add("show");
    clearTimeout(timer);
    isOver = true;
  };

  const closeMenu = () => {
    timer = setTimeout(() => {
      if (!isOver) {
        megaMenu.classList.remove("show");
        backdrop.classList.remove("show");
      }
    }, 150);
  };

  menu.addEventListener("mouseenter", () => {
    isOver = true;
    openMenu();
  });

  megaMenu.addEventListener("mouseenter", () => {
    isOver = true;
    openMenu();
  });
  megaMenu.addEventListener("mouseleave", () => {
    isOver = false;
    closeMenu();
  });
}

// 🔹 다국어 드롭다운 - class 기반 다중 처리
document.querySelectorAll('.custom-select').forEach(customSelect => {
  const selected = customSelect.querySelector(".selected-language");
  const selectedText = selected.querySelector(".lang-text");
  const options = customSelect.querySelectorAll(".custom-options li");

  customSelect.addEventListener("click", () => {
    customSelect.classList.toggle("open");
  });

  options.forEach(option => {
    option.addEventListener("click", e => {
      e.stopPropagation();
      const value = option.getAttribute("data-value");
      const text = option.textContent;

      selectedText.textContent = text;
      customSelect.classList.remove("open");

      options.forEach(opt => opt.classList.remove("selected"));
      option.classList.add("selected");

      closeModal();
      changeLanguage(value);
    });
  });
});

// 🔹 외부 클릭 시 드롭다운 닫기
document.addEventListener("click", e => {
  document.querySelectorAll(".custom-select").forEach(cs => {
    if (!cs.contains(e.target)) {
      cs.classList.remove("open");
    }
  });
});

// 🔹 언어 변경 함수 (구현 예정)
function changeLanguage(value) {
  console.log("🌐 언어 변경:", value);
}

// 🔹 드롭다운 강제 닫기
function closeModal() {
  document.querySelectorAll(".custom-select").forEach(cs => cs.classList.remove("open"));
}

// 🔹 Firebase 로그인 상태 확인
onAuthStateChanged(auth, (user) => {
  const loginDiv = document.querySelector(".header-top .login");
  if (!loginDiv) return;

  if (user) {
    const email = user.email || "회원";
    loginDiv.textContent = `${email}님`;
    loginDiv.style.cursor = "default";
    loginDiv.onclick = null;
  } else {
    loginDiv.textContent = "로그인";
    loginDiv.style.cursor = "pointer";
    loginDiv.onclick = () => openLoginModal();
  }
});
