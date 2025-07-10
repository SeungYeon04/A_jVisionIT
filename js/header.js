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
        module.initLoginModal(); // ✅ 여기서 매번 초기화
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
