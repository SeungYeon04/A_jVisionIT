import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth } from "./firebaseInit.js";

// 🔹 로그인 모달 열기
function openLoginModal() {
  fetch("/module/login.html")
    .then((res) => res.text())
    .then((html) => {
      const backdrop = document.getElementById("login-backdrop");
      const container = document.getElementById("login-modal-container");

      container.innerHTML = html;
      backdrop.style.display = "block";
      container.style.display = "block";

      backdrop.onclick = () => {
        container.innerHTML = "";
        backdrop.style.display = "none";
        container.style.display = "none";
      };

      import("/js/login.js").then((module) => {
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

  function activateOpenMenu() {
    setTimeout(() => {
      menu.addEventListener("mouseenter", () => {
        isOver = true;
        openMenu();
      });

      megaMenu.addEventListener("mouseenter", () => {
        isOver = true;
        openMenu();
      });
    }, 50);
  }

  if (document.readyState === "complete") {
    activateOpenMenu();
  } else {
    window.addEventListener("load", activateOpenMenu);
  }

  megaMenu.addEventListener("mouseleave", () => {
    isOver = false;
    closeMenu();
  });
}

// ✅ custom-select 여러 개 처리
document.querySelectorAll(".custom-select").forEach((customSelect) => {
  const selected = customSelect.querySelector("#selected-language");
  const selectedText = selected.querySelector(".lang-text");
  const options = customSelect.querySelectorAll(".custom-options li");

  customSelect.addEventListener("click", () => {
    customSelect.classList.toggle("open");
  });

  options.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();

      const value = option.getAttribute("data-value");
      const text = option.textContent;

      selectedText.textContent = text;
      customSelect.classList.remove("open");

      options.forEach((opt) => opt.classList.remove("selected"));
      option.classList.add("selected");

      closeModal(customSelect);
      changeLanguage(value);
    });
  });

  // 바깥 클릭 시 닫기
  document.addEventListener("click", (e) => {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove("open");
    }
  });
});

function changeLanguage(value) {
  console.log("🌐 언어 변경:", value);

  // 모든 선택된 언어 영역 업데이트
  document.querySelectorAll("#selected-language .lang-text").forEach((el) => {
    if (value === "ko") el.textContent = "한국어";
    else if (value === "en") el.textContent = "English";
    else if (value === "miyanma") el.textContent = "မြန်မာ";
  });

  // TODO: 추가적인 언어 변경 로직이 있다면 여기에
}

function closeModal(customSelect) {
  customSelect.classList.remove("open");
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

function activateTransitions() {
  setTimeout(() => {
    const megaMenu = document.getElementById("mega-menu");
    if (megaMenu) {
      megaMenu.classList.add("transition-ready");
    }
  }, 50);
}

// 현재 문서의 로딩 상태를 확인합니다.
if (document.readyState === "complete") {
  // 이미 로딩이 완료되었다면, 함수를 즉시 실행합니다.
  activateTransitions();
} else {
  // 아직 로딩 중이라면, load 이벤트가 발생했을 때 실행하도록 등록합니다.
  window.addEventListener("load", activateTransitions);
}
