// 전역 변수 설정
let activityPosts = JSON.parse(localStorage.getItem("posts")) || [];

// DOM 요소 가져오기
const lastUpdateDate = document.getElementById("lastUpdateDate");
const activityContainer = document.getElementById("activityContainer");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const writeButton = document.getElementById("writeButton");

// 새 글 작성 모달 요소
const modalOverlay = document.getElementById("modalOverlay");
const closeModalButton = document.getElementById("closeModalButton");
const newTitleInput = document.getElementById("newTitle");
const newContentInput = document.getElementById("newContent");
const newImageFileInput = document.getElementById("newImageFile");
const imagePreviewWrapper = document.getElementById("imagePreviewWrapper");
const imagePreview = document.getElementById("imagePreview");
const addNewPostButton = document.getElementById("addNewPostButton");

// 게시글 상세 보기 모달 요소
const detailModalOverlay = document.getElementById("detailModalOverlay");
const closeDetailModalButton = document.getElementById("closeDetailModalButton");
const detailImage = document.getElementById("detailImage");
const detailTitle = document.getElementById("detailTitle");
const detailContent = document.getElementById("detailContent");
const detailDate = document.getElementById("detailDate");

// 초기 설정
updateLastModifiedDate(); // 마지막 업데이트 날짜 업데이트
renderPosts(activityPosts); // 초기 게시물 렌더링

// 이벤트 리스너 설정
// 검색 입력창에서 Enter 키 누를 때 검색
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    filterPosts();
  }
});

// 검색 버튼 클릭 시 검색
searchButton.addEventListener("click", filterPosts);

// 글쓰기 버튼 클릭 시 새 글 작성 모달 열기
writeButton.addEventListener("click", openModal);

// 새 글 작성 모달 닫기 버튼 클릭 시 모달 닫기
closeModalButton.addEventListener("click", closeModal);

// 새 글 작성 모달 오버레이 배경 클릭 시 모달 닫기 (모달 자체는 클릭해도 안 닫히게)
modalOverlay.addEventListener("click", (e) => {
  if (e.target.classList.contains('modal-overlay')) { // 오버레이만 클릭했을 때 닫히도록
    closeModal();
  }
});

// 이미지 파일 변경 시 미리보기 업데이트
newImageFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      imagePreview.src = event.target.result;
      imagePreviewWrapper.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.src = "";
    imagePreviewWrapper.style.display = "none";
  }
});

// 새 게시물 등록 버튼 클릭 시
addNewPostButton.addEventListener("click", addNewPost);

// 게시글 상세 보기 모달 닫기 버튼 클릭 시 모달 닫기
closeDetailModalButton.addEventListener("click", closeDetailModal);

// 게시글 상세 보기 모달 오버레이 배경 클릭 시 모달 닫기 (모달 자체는 클릭해도 안 닫히게)
detailModalOverlay.addEventListener("click", (e) => {
    if (e.target.classList.contains('modal-overlay')) { // 오버레이만 클릭했을 때 닫히도록
        closeDetailModal();
    }
});

// 마지막 업데이트 날짜 업데이트 함수
function updateLastModifiedDate() {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, '0')}. ${String(today.getDate()).padStart(2, '0')}`;
  lastUpdateDate.textContent = `마지막 업데이트 ${formattedDate}`;
}

// 게시물 목록 렌더링 함수
function renderPosts(posts) {
  activityContainer.innerHTML = "";

  if (posts.length === 0) {
    activityContainer.innerHTML = "<p style='text-align:center; color:#aaa; padding: 20px;'>검색 결과가 없거나, 아직 작성된 게시물이 없습니다.</p>";
    return;
  }

  posts.forEach((post, index) => { 
    const card = document.createElement("div");
    card.className = "activity-card";
    card.dataset.index = index;

    card.innerHTML = `
      <img src="${post.image}" alt="${post.title} 활동 이미지">
      <div class="activity-info">
        <h3 class="activity-title">${post.title}</h3>
        <p class="activity-date">${post.date}</p>
      </div>
    `;
    
    card.addEventListener("click", () => openDetailModal(post));

    activityContainer.appendChild(card);
  });
}

// 게시물 필터링 함수
function filterPosts() {
  const keyword = searchInput.value.toLowerCase().trim();
  const filtered = activityPosts.filter((post) =>
    post.title.toLowerCase().includes(keyword) || post.content.toLowerCase().includes(keyword) // 내용도 검색에 포함
  );
  renderPosts(filtered);
}

// 새 글 작성 모달 열기 함수
function openModal() {
  modalOverlay.classList.add('active');
}

// 새 글 작성 모달 닫기 함수
function closeModal() {
  modalOverlay.classList.remove('active');
  newTitleInput.value = "";
  newContentInput.value = "";
  newImageFileInput.value = "";
  imagePreview.src = "";
  imagePreviewWrapper.style.display = "none";
}

// 새 게시물 추가 함수
function addNewPost() {
  const title = newTitleInput.value.trim();
  const content = newContentInput.value.trim(); // 내용 가져오기
  const file = newImageFileInput.files[0];

  if (!title || !content || !file) { // 내용 필드도 검사
    alert("제목, 내용, 이미지를 모두 입력해주세요!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}.${String(
      today.getMonth() + 1
    ).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

    const newPost = {
      title: title,
      content: content,
      image: e.target.result, 
      date: formattedDate,
    };

    activityPosts.unshift(newPost);
    try {
        localStorage.setItem("posts", JSON.stringify(activityPosts));
    } catch (e) {
        console.error("로컬 스토리지 저장 실패:", e);
        alert("데이터 저장에 실패했습니다. (저장 공간 부족)");
    }
    
    renderPosts(activityPosts);
    closeModal();
    updateLastModifiedDate(); // 새 글 등록 후 마지막 업데이트 날짜 업데이트
  };

  reader.readAsDataURL(file);
}

// 게시글 상세 보기 모달 열기 함수
function openDetailModal(post) {
    detailImage.src = post.image;
    detailTitle.textContent = post.title;
    detailContent.textContent = post.content;
    detailDate.textContent = post.date;
    detailModalOverlay.classList.add('active');
}

// 게시글 상세 보기 모달 닫기 함수
function closeDetailModal() {
    detailModalOverlay.classList.remove('active');
}