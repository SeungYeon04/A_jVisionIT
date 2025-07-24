// 1. Firebase 관련 모듈 및 설정 가져오기
import { app, db } from "./firebaseInit.js"; // firebaseInit.js 경로에 맞게 수정해주세요.
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let subimg = {
  img :[
    "asset/img/project_test.png",
    "asset/img/school_main.png",
    "asset/img/박형석.png",
    "asset/img/AI임시01.png",
    "asset/img/poster.png",
  ]
}

window.addEventListener("DOMContentLoaded", async () => {
  // 2. 현재 URL에서 'id' 파라미터 값 가져오기
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id");

  // projectId가 없으면 페이지에 오류 메시지를 표시하고 중단
  if (!projectId) {
    document.body.innerHTML =
      '<h1 style="text-align: center; margin-top: 50px;">잘못된 접근입니다.</h1>';
    console.error("URL에서 프로젝트 ID를 찾을 수 없습니다.");
    return;
  }

  try {
    // 3. Firestore에서 projectId와 일치하는 문서 가져오기
    // 'project'는 컬렉션 이름, projectId는 문서 ID입니다.
    const docRef = doc(db, "project", projectId);
    const docSnap = await getDoc(docRef);

    // 4. 일치하는 프로젝트가 있을 경우에만 페이지 내용을 채웁니다.
    if (docSnap.exists()) {
      const project = docSnap.data();

      // 이미지
      document.querySelector(".project-main-img").src = project.mainImgSrc;
      document.querySelector(".footer-author-img").src =
        project.footerAuthorImgSrc;

        ////////////////

let currentIndex = 0;

const track = document.getElementById("slider-track");

function renderSlider() {
  track.innerHTML = "";

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

    // 중앙 이미지: prev가 없으면 0번, 있으면 1번
    const currentImg = trackImgs.length === 3 ? trackImgs[1] : trackImgs[0];
    const clickedImg = document.querySelector(
      direction > 0 ? ".next-preview" : ".prev-preview"
    );

    // 반대쪽 preview 이미지 즉시 숨김
    const oppositeImg = document.querySelector(
      direction > 0 ? ".prev-preview" : ".next-preview"
    );
    if (oppositeImg) oppositeImg.classList.add("fade-out");

    // 클릭된 이미지 → 커지며 이동
 if (clickedImg) {
  clickedImg.classList.add(direction > 0 ? "clicked-next" : "clicked-prev");
}

    // 기존 중앙 이미지 → 작아지며 밀림
    if (currentImg) currentImg.classList.add("outgoing");

    // 일정 시간 후 슬라이드 교체
    setTimeout(() => {
      currentIndex = newIndex;
      renderSlider();
    }, 400);
  }
}
renderSlider();


      ///////////////////////

      // 텍스트
      document.querySelector(".footer-author-name").textContent =
        project.developerName;
      document.querySelector(".project-title").textContent =
        project.projectTitle;
      document.querySelector(".project-client").textContent =
        "개발자 : " + project.developerName;

      // 프로젝트 설명
      document.querySelector(".project-description").innerHTML = `
        ${project.titleDescription}
        Link : <a class="project_link" href="${project.projectLink}" target="_blank">${project.projectLink}</a>
      `;

      // 상세 설명
      document.querySelector(".project-section-text").innerHTML =
        project.projectDetailDescription;
    } else {
      // 일치하는 프로젝트가 없을 경우 에러 메시지를 표시합니다.
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
