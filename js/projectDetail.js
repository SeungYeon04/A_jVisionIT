window.addEventListener("DOMContentLoaded", () => {
  // 1. 현재 URL에서 'id' 파라미터 값 가져오기
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id");

  // projectId가 없으면 페이지에 오류 메시지를 표시하고 중단
  if (!projectId) {
    document.body.innerHTML =
      '<h1 style="text-align: center; margin-top: 50px;">잘못된 접근입니다.</h1>';
    console.error("URL에서 프로젝트 ID를 찾을 수 없습니다.");
    return;
  }

  fetch("/data/example.json")
    .then((response) => response.json())
    .then((data) => {
      // 2. URL의 id와 일치하는 프로젝트 데이터를 배열에서 찾기
      // URL 파라미터는 문자열이므로 숫자로 변환(parseInt)하여 비교합니다.
      const project = data.project.find((p) => p.id === parseInt(projectId));

      // 3. 일치하는 프로젝트가 있을 경우에만 페이지 내용을 채웁니다.
      if (project) {
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
    })
    .catch((error) => {
      console.error("JSON 로드 실패:", error);
    });
});
