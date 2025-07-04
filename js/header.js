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

console.log("✅ header.js 실행됨");

const header = document.querySelector(".header-bottom");
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


  header.addEventListener("mouseenter", () => {
    console.log("🟡 header mouseenter");
    isOver = true;
    openMenu();
  });

  header.addEventListener("mouseleave", () => {
    console.log("🟡 header mouseleave");
    isOver = false;
    closeMenu();
  });

  megaMenu.addEventListener("mouseenter", () => {
    console.log("🟢 megaMenu mouseenter");
    isOver = true;
    openMenu();
  });

  megaMenu.addEventListener("mouseleave", () => {
    console.log("🔴 megaMenu mouseleave");
    isOver = false;
    closeMenu();
  });
  
}

