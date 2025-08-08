// 1. Firebase 관련 모듈 및 설정 가져오기
import { app, db } from "./firebaseInit.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// subimg 변수를 전역 스코프에 선언합니다.
// Firestore 데이터 로드 전에는 빈 배열로 초기화합니다.
let subimg = {
  img: [],
};

let currentIndex = 0;
let track; // #slider-track 요소를 담을 변수 (DOMContentLoaded 이후 할당)

function renderSlider() {
  // track 요소가 아직 할당되지 않았다면 여기서 할당합니다.
  if (!track) {
    track = document.getElementById("slider-track");
    if (!track) {
      console.error("슬라이더 트랙 HTML 요소를 찾을 수 없습니다! (ID: slider-track)");
      return;
    }
  }

  track.innerHTML = "";

  // 이미지가 없으면 렌더링하지 않습니다.
  if (subimg.img.length === 0) {
    console.warn("슬라이더에 표시할 이미지가 없습니다.");
    return;
  }

  const prevImg = currentIndex > 0 ? subimg.img[currentIndex - 1] : null;
  const currentImg = subimg.img[currentIndex];
  const nextImg = currentIndex < subimg.img.length - 1 ? subimg.img[currentIndex + 1] : null;

  // 왼쪽에 자리만 차지하는 투명 이미지
  if (!prevImg) {
    const placeholder = document.createElement("div");
    placeholder.style.width = "15vw";
    track.appendChild(placeholder);
  } else {
    const img = document.createElement("img");
    img.src = prevImg;
    img.classList.add("prev-preview");
    img.onclick = () => slide(-1);
    track.appendChild(img);
  }

  const img = document.createElement("img");
  img.src = currentImg;
  img.classList.add("main");
  track.appendChild(img);

  // 오른쪽도 마찬가지
  if (!nextImg) {
    const placeholder = document.createElement("div");
    placeholder.style.width = "15vw";
    track.appendChild(placeholder);
  } else {
    const img = document.createElement("img");
    img.src = nextImg;
    img.classList.add("next-preview");
    img.onclick = () => slide(1);
    track.appendChild(img);
  }
}

function slide(direction) {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < subimg.img.length) {
        const trackImgs = document.querySelectorAll("#slider-track img");

        const currentImg = trackImgs.length === 3 ? trackImgs[1] : trackImgs[0];
        const clickedImg = document.querySelector(
            direction > 0 ? ".next-preview" : ".prev-preview"
        );
        const oppositeImg = document.querySelector(
            direction > 0 ? ".prev-preview" : ".next-preview"
        );

        if (oppositeImg) oppositeImg.classList.add("fade-out");
        if (clickedImg) {
            clickedImg.classList.add(direction > 0 ? "clicked-next" : "clicked-prev");
        }
        if (currentImg) currentImg.classList.add("outgoing");

        setTimeout(() => {
            currentIndex = newIndex;
            renderSlider();
        }, 650);
    }
}

// DOMContentLoaded 이벤트 리스너
window.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id");

  if (!projectId) {
    document.body.innerHTML =
      '<h1 style="text-align: center; margin-top: 50px;">잘못된 접근입니다.</h1>';
    console.error("URL에서 프로젝트 ID를 찾을 수 없습니다.");
    return;
  }

  try {
    const docRef = doc(db, "project", projectId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const project = docSnap.data();

      document.querySelector(".project-main-img").src = project.mainImgSrc;
      document.querySelector(".footer-author-img").src =
        project.footerAuthorImgSrc;

      // --- subimg 로드 핵심 부분 ---
        subimg.img = project.sectionImage; // Firestore에서 가져온 이미지를 subimg.img에 할당
      // --- subimg 로드 끝 ---

      // Firestore 데이터 로드 및 subimg.img 할당 후 슬라이더를 초기 렌더링합니다.
      renderSlider();

      document.querySelector(".footer-author-name").textContent =
        project.developerName;
      document.querySelector(".project-title").textContent =
        project.projectTitle;
      document.querySelector(".project-client").textContent =
        "개발자 : " + project.developerName;

      document.querySelector(".project-description").innerHTML = `
        ${project.titleDescription}
        Link : <a class="project_link" href="${project.projectLink}" target="_blank">${project.projectLink}</a>
      `;

      document.querySelector(".project-section-text").innerHTML =
        project.projectDetailDescription;
    } else {
      document.querySelector(".project-title").textContent =
        "프로젝트를 찾을 수 없습니다.";
      console.error(`ID가 ${projectId}인 프로젝트를 찾을 수 없습니다.`);
    }
  } catch (error) {
    console.error("데이터 로드 실패:", error);
    document.body.innerHTML =
      '<h1 style="text-align: center; margin-top: 50px;">데이터를 불러오는 중 오류가 발생했습니다.</h1>';
  }
});
