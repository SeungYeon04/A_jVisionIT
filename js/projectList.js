// 1. Firebase 관련 모듈 및 설정 가져오기
import { db } from "./firebaseInit.js"; // firebaseInit.js 경로에 맞게 수정해주세요.
import {
  collection,
  query,
  where,
  getDocs,
  doc, // doc 함수 추가
  setDoc, // setDoc 함수 추가
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.addEventListener("DOMContentLoaded", () => {
  // URL에서 'year' 파라미터 가져오기 (없으면 2025를 기본값으로)
  const params = new URLSearchParams(window.location.search);
  const selectedYear = params.get("year") || "2025";

  // UI 업데이트 (타이틀, 네비게이션 활성화)
  updateUI(selectedYear);

  // 선택된 연도에 맞는 프로젝트 데이터 렌더링
  renderProjects(selectedYear);
});

/**
 * 페이지의 제목과 네비게이션 상태를 업데이트하는 함수
 * @param {string} year - 선택된 연도 (예: "2025")
 */
function updateUI(year) {
  // 메인 타이틀 업데이트
  const mainTitle = document.querySelector(".main-title");
  if (mainTitle) {
    mainTitle.textContent = `${year}년도 개인프로젝트`;
  }

  // 연도 네비게이션 'active' 클래스 업데이트
  const yearLinks = document.querySelectorAll(".year-nav a");
  yearLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `?year=${year}`) {
      link.classList.add("active");
    }
  });
}

/**
 * 특정 연도의 프로젝트 목록을 Firestore에서 불러와 화면에 표시하는 함수
 * @param {string} year - 필터링할 연도 (예: "2025")
 */
async function renderProjects(year) {
  const projectGrid = document.querySelector(".project-grid");
  if (!projectGrid) return;

  // 로딩 중 표시 (선택 사항)
  projectGrid.innerHTML = `<p style="text-align: center;">프로젝트를 불러오는 중입니다...</p>`;

  try {
    // 2. Firestore에서 조건에 맞는 데이터 쿼리
    // 'project' 컬렉션에서 'year' 필드가 선택된 연도(숫자 타입)와 일치하는 문서들을 찾습니다.
    const projectsRef = collection(db, "project");
    const q = query(projectsRef, where("year", "==", parseInt(year)));
    const querySnapshot = await getDocs(q);

    // 그리드 내용을 비워줍니다.
    projectGrid.innerHTML = "";

    // 3. 해당 연도에 프로젝트가 없으면 메시지 표시
    if (querySnapshot.empty) {
      projectGrid.innerHTML = `<p style="text-align: center;">${year}년도 프로젝트가 아직 없습니다.</p>`;
      return;
    }

    // 4. 쿼리 결과를 화면에 추가
    querySnapshot.forEach((doc) => {
      // doc.data()는 문서의 필드 데이터를, doc.id는 문서의 고유 ID를 가져옵니다.
      const project = doc.data();
      const projectId = doc.id;

      const detailPageLink = `/projectDetail.html?id=${projectId}`; // Firestore 문서 ID를 링크로 사용
      const projectItemHTML = `
        <a href="${detailPageLink}" class="project-item">
            <img src="${project.mainImgSrc}" alt="${project.projectTitle}" class="thumbnail" loading="lazy">
            <div class="project-info">
                <p class="project-name">${project.developerName}</p>
                <p class="project-id">${project.developerId}</p>
            </div>
        </a>
      `;
      projectGrid.insertAdjacentHTML("beforeend", projectItemHTML);
    });
  } catch (error) {
    console.error("프로젝트 데이터를 불러오는 데 실패했습니다:", error);
    projectGrid.innerHTML =
      '<p style="text-align: center;">프로젝트를 불러올 수 없습니다.</p>';
  }
}
