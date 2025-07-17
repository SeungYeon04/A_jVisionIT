window.addEventListener('DOMContentLoaded', () => {
  fetch('/data/example.json')
    .then(response => response.json())
    .then(data => {
      const project = data.project[0];

      // 이미지
      document.querySelector('.project-main-img').src = project.mainImgSrc;
      document.querySelector('.project-section-image img').src = project.sectionImgSrc;
      document.querySelector('.footer-author-img').src = project.footerAuthorImgSrc;

      // 텍스트
      document.querySelector('.footer-author-name').textContent = project.designerName;
      document.querySelector('.project-title').textContent = project.projectTitle;
      document.querySelector('.project-client').textContent = '개발자 : ' + project.developerName;
      
      // 프로젝트 설명
      document.querySelector('.project-description').innerHTML = `
        ${project.titleDescription}
        Link : <a class="project_link" href="${project.projectLink}" target="_blank">${project.projectLink}</a>
      `;

      // 상세 설명
      document.querySelector('.project-section-text').innerHTML = project.projectDetailDescription;
    })
    .catch(error => {
      console.error('JSON 로드 실패:', error);
    });
});
