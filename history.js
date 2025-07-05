// 전역 변수 설정
let activityPosts = JSON.parse(localStorage.getItem("posts")) || [];
let currentEditPostId = null; // 현재 수정 중인 게시글의 ID를 저장할 변수

// DOM 요소 가져오기
const lastUpdateDate = document.getElementById("lastUpdateDate");
const activityContainer = document.getElementById("activityContainer");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const writeButton = document.getElementById("writeButton");

// 새 글 작성/수정 모달 요소
const modalOverlay = document.getElementById("modalOverlay");
const closeModalButton = document.getElementById("closeModalButton");
const modalTitle = document.getElementById("modalTitle"); // 모달 제목 요소
const newTitleInput = document.getElementById("newTitle");
const newContentInput = document.getElementById("newContent");
const newImageFileInput = document.getElementById("newImageFile");
const imagePreviewWrapper = document.getElementById("imagePreviewWrapper");
const imagePreview = document.getElementById("imagePreview");
const addNewPostButton = document.getElementById("addNewPostButton"); // 등록/수정 버튼

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

// 검색 입력창에서 Enter 키 누를 때 검색
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    filterPosts();
  }
});

// 검색 버튼 클릭 시 검색
searchButton.addEventListener("click", filterPosts);

// 글쓰기 버튼 클릭 시 새 글 작성 모달 열기
writeButton.addEventListener("click", () => openModal());

// 새 글 작성/수정 모달 닫기 버튼 클릭 시 모달 닫기
closeModalButton.addEventListener("click", closeModal);

// 새 글 작성/수정 모달 오버레이 배경 클릭 시 모달 닫기 (모달 자체는 클릭해도 안 닫히게)
modalOverlay.addEventListener("click", (e) => {
  if (e.target.classList.contains('modal-overlay')) {
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

// 등록/수정 버튼 클릭 시 (로직 변경 없음)
addNewPostButton.addEventListener("click", () => {
    if (currentEditPostId) { // 수정 모드일 경우
        updatePost();
    } else { // 새 글 작성 모드일 경우
        addNewPost();
    }
});

// 게시글 상세 보기 모달 닫기 버튼 클릭 시 모달 닫기
closeDetailModalButton.addEventListener("click", closeDetailModal);

// 게시글 상세 보기 모달 오버레이 배경 클릭 시 모달 닫기 (모달 자체는 클릭해도 안 닫히게)
detailModalOverlay.addEventListener("click", (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeDetailModal();
    }
});

document.addEventListener('click', (e) => {
    document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
        const kebabIcon = menu.previousElementSibling; 
        if (!kebabIcon || (!kebabIcon.contains(e.target) && !menu.contains(e.target))) {
            menu.classList.remove('active');
        }
    });
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

  posts.forEach((post) => {
    const card = document.createElement("div");
    card.className = "activity-card";
    card.dataset.id = post.id; // 게시글의 고유 ID 저장

    card.innerHTML = `
      <img src="${post.image}" alt="${post.title} 활동 이미지">
      <div class="activity-info">
        <h3 class="activity-title">${post.title}</h3>
        <p class="activity-date">${post.date}</p>
      </div>
      <div class="card-actions-menu">
          <span class="kebab-icon">&#x22EE;</span>
          <div class="dropdown-menu">
              <button class="edit-card-btn">수정</button>
              <button class="delete-card-btn">삭제</button>
          </div>
      </div>
    `;

    // 카드 클릭 시 상세 모달 열기 이벤트 리스너 (기존과 동일)
    card.addEventListener("click", (e) => {
        // 클릭된 요소가 케밥 메뉴나 드롭다운 메뉴 내부가 아닐 때만 상세 모달 열기
        if (!e.target.closest('.card-actions-menu')) {
            openDetailModal(post);
        }
    });

    activityContainer.appendChild(card);

    // 케밥 메뉴 및 드롭다운 버튼 이벤트 리스너 추가
    const kebabIcon = card.querySelector('.kebab-icon');
    const dropdownMenu = card.querySelector('.dropdown-menu');
    const editBtn = card.querySelector('.edit-card-btn');
    const deleteBtn = card.querySelector('.delete-card-btn');

    kebabIcon.addEventListener('click', (e) => {
        e.stopPropagation(); // 카드 클릭 이벤트가 부모로 전파되지 않도록 방지
        // 다른 열려있는 드롭다운 메뉴 닫기
        document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
            if (menu !== dropdownMenu) {
                menu.classList.remove('active');
            }
        });
        dropdownMenu.classList.toggle('active'); // 현재 드롭다운 메뉴 토글
    });

    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeDetailModal();
        openModal(post); // 수정 모드로 글쓰기 모달 열기
        dropdownMenu.classList.remove('active'); // 드롭다운 메뉴 닫기
    });

    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deletePost(post.id); // 게시글 삭제 함수 호출
        dropdownMenu.classList.remove('active'); // 드롭다운 메뉴 닫기
    });
  });
}

// 게시물 필터링 함수 (기존과 동일)
function filterPosts() {
  const keyword = searchInput.value.toLowerCase().trim();
  console.log("검색 함수 호출됨! 키워드:", keyword);
  const filtered = activityPosts.filter((post) =>
    post.title.toLowerCase().includes(keyword) || (post.content && post.content.toLowerCase().includes(keyword))
  );
  console.log("필터링된 게시물:", filtered);
  renderPosts(filtered);
}

// 새 글 작성/수정 모달 열기 함수 (기존과 동일)
function openModal(postToEdit = null) {
  modalOverlay.classList.add('active');

  if (postToEdit) { // 수정 모드
    modalTitle.textContent = "글 수정";
    addNewPostButton.textContent = "수정하기";
    newTitleInput.value = postToEdit.title;
    newContentInput.value = postToEdit.content;
    newImageFileInput.value = ""; // 파일 입력 필드 초기화 (새 이미지 선택 유도)
    imagePreview.src = postToEdit.image;
    imagePreviewWrapper.style.display = "block";
    currentEditPostId = postToEdit.id; // 현재 수정 중인 게시글 ID 설정
  } else { // 새 글 작성 모드
    modalTitle.textContent = "새 글 작성";
    addNewPostButton.textContent = "등록하기";
    newTitleInput.value = "";
    newContentInput.value = "";
    newImageFileInput.value = ""; // 파일 입력 필드 초기화
    imagePreview.src = "";
    imagePreviewWrapper.style.display = "none";
    currentEditPostId = null; // 새 글 작성 모드일 때는 ID 초기화
  }
}

// 새 글 작성/수정 모달 닫기 함수 (기존과 동일)
function closeModal() {
  modalOverlay.classList.remove('active');
  newTitleInput.value = "";
  newContentInput.value = "";
  newImageFileInput.value = "";
  imagePreview.src = "";
  imagePreviewWrapper.style.display = "none";
  currentEditPostId = null; // 모달 닫을 때 현재 수정 ID 초기화
}

// 새 게시물 추가 함수 (ID 부여 로직 추가, 기존과 동일)
function addNewPost() {
  const title = newTitleInput.value.trim();
  const content = newContentInput.value.trim();
  const file = newImageFileInput.files[0];

  if (!title || !content || !file) {
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
      id: Date.now(), // 고유 ID 부여
      title: title,
      content: content,
      image: e.target.result,
      date: formattedDate,
    };

    activityPosts.unshift(newPost);
    savePostsToLocalStorage(); // 로컬 스토리지 저장 함수 호출
    renderPosts(activityPosts);
    closeModal();
    updateLastModifiedDate();
  };

  reader.readAsDataURL(file);
}

// 게시물 수정 함수 (기존과 동일)
function updatePost() {
    const title = newTitleInput.value.trim();
    const content = newContentInput.value.trim();
    const file = newImageFileInput.files[0]; // 새 이미지 파일

    if (!title || !content) {
        alert("제목과 내용을 모두 입력해주세요!");
        return;
    }

    const postIndex = activityPosts.findIndex(post => post.id === currentEditPostId);

    if (postIndex === -1) {
        alert("수정할 게시글을 찾을 수 없습니다.");
        return;
    }

    const reader = new FileReader();
    if (file) { // 새 이미지가 첨부되었을 경우
        reader.onload = function (e) {
            activityPosts[postIndex].title = title;
            activityPosts[postIndex].content = content;
            activityPosts[postIndex].image = e.target.result; // 새 이미지로 업데이트
            savePostsToLocalStorage();
            renderPosts(activityPosts);
            closeModal();
        };
        reader.readAsDataURL(file);
    } else { // 새 이미지가 첨부되지 않았을 경우
        activityPosts[postIndex].title = title;
        activityPosts[postIndex].content = content;
        // 이미지는 기존 이미지 유지
        savePostsToLocalStorage();
        renderPosts(activityPosts);
        closeModal();
    }
}

// 게시물 삭제 함수 (기존과 동일)
function deletePost(postId) {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
        return;
    }

    activityPosts = activityPosts.filter(post => post.id !== postId);
    savePostsToLocalStorage();
    renderPosts(activityPosts);
    closeDetailModal(); // 상세 모달 닫기
    updateLastModifiedDate();
}

// 로컬 스토리지에 저장하는 유틸리티 함수 (기존과 동일)
function savePostsToLocalStorage() {
    try {
        localStorage.setItem("posts", JSON.stringify(activityPosts));
    } catch (e) {
        console.error("로컬 스토리지 저장 실패:", e);
        alert("데이터 저장에 실패했습니다. (저장 공간 부족)");
    }
}

// 게시글 상세 보기 모달 열기 함수 (수정/삭제 버튼 관련 로직 제거)
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