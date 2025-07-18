window.addEventListener("DOMContentLoaded", () => {
  // 1. URL에서 'year' 파라미터 가져오기 (없으면 2025를 기본값으로)
  const params = new URLSearchParams(window.location.search);
  const selectedYear = params.get("year") || "2025";

  // 2. UI 업데이트 (타이틀, 네비게이션 활성화)
  updateUI(selectedYear);

  // 3. 선택된 연도에 맞는 프로젝트 데이터 렌더링
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
    // 링크의 href 속성값이 '?year=YYYY'와 일치하는지 확인
    if (link.getAttribute("href") === `?year=${year}`) {
      link.classList.add("active");
    }
  });
}

/**
 * 특정 연도의 프로젝트 목록을 불러와 화면에 표시하는 함수
 * @param {string} year - 필터링할 연도 (예: "2025")
 */
function renderProjects(year) {
  const projectGrid = document.querySelector(".project-grid");
  if (!projectGrid) return;

  fetch("/data/example.json")
    .then((response) => response.json())
    .then((data) => {
      // 선택된 연도(year)와 일치하는 프로젝트만 필터링
      // JSON의 year는 숫자이므로 parseInt로 변환하여 비교
      const filteredProjects = data.project.filter(
        (p) => p.year === parseInt(year)
      );

      // 그리드 내용을 비워줍니다.
      projectGrid.innerHTML = "";

      // 해당 연도에 프로젝트가 없으면 메시지 표시
      if (filteredProjects.length === 0) {
        projectGrid.innerHTML = `<p style="text-align: center;">${year}년도 프로젝트가 아직 없습니다.</p>`;
        return;
      }

      // 필터링된 프로젝트들을 화면에 추가
      filteredProjects.forEach((project) => {
        const detailPageLink = `/projectDetail.html?id=${project.id}`;
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
    })
    .catch((error) => {
      console.error("프로젝트 데이터를 불러오는 데 실패했습니다:", error);
      projectGrid.innerHTML =
        '<p style="text-align: center;">프로젝트를 불러올 수 없습니다.</p>';
    });
}
