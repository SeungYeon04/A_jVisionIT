// 1. Firebase 관련 모듈 및 설정 가져오기
import { app, db } from "./firebaseInit.js"; // firebaseInit.js 경로에 맞게 수정해주세요.
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
      document.querySelector(".project-section-image img").src =
        project.sectionImgSrc;
      document.querySelector(".footer-author-img").src =
        project.footerAuthorImgSrc;

      // 텍스트
      document.querySelector(".footer-author-name").textContent =
        project.designerName;
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
