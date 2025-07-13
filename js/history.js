import { app, auth, db, storage } from "./firebaseInit.js";
import {
  collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// DOM
const activityContainer = document.getElementById("activityContainer");
const lastUpdateDateElement = document.getElementById("lastUpdateDate");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

const writeButton = document.getElementById("writeButton");
const modalOverlay = document.getElementById("modalOverlay");
const closeModalButton = document.getElementById("closeModalButton");
const newTitleInput = document.getElementById("newTitle");
const newContentInput = document.getElementById("newContent");
const newImageFileInput = document.getElementById("newImageFile");
const imagePreviewWrapper = document.getElementById("imagePreviewWrapper");
const imagePreview = document.getElementById("imagePreview");
let addNewPostButton = document.getElementById("addNewPostButton");

const detailModalOverlay = document.getElementById("detailModalOverlay");
const closeDetailModalButton = document.getElementById("closeDetailModalButton");
const detailImage = document.getElementById("detailImage");
const detailTitle = document.getElementById("detailTitle");
const detailContent = document.getElementById("detailContent");
const detailDate = document.getElementById("detailDate");

let allPosts = [];

// 로그인 상태에 따라 글쓰기 버튼 표시
onAuthStateChanged(auth, (user) => {
  writeButton.style.display = user ? "block" : "none";
});

// 게시글 불러오기
async function fetchPosts() {
  activityContainer.innerHTML = '';
  allPosts = [];
  try {
    const q = query(collection(db, "history"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      allPosts.push({ id: doc.id, ...doc.data() });
    });
    displayPosts(allPosts);
    updateLastUpdateDate();
  } catch (e) {
    console.error("불러오기 실패:", e);
    activityContainer.innerHTML = "<p>게시글을 불러오는 데 실패했습니다.</p>";
  }
}

// 게시글 카드 표시
function displayPosts(postsToDisplay) {
  activityContainer.innerHTML = '';
  if (postsToDisplay.length === 0) {
    activityContainer.innerHTML = "<p>게시글이 없습니다.</p>";
    return;
  }

  postsToDisplay.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("activity-card");
    postElement.dataset.id = post.id;

    const postImage = post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}" />` : '';

    postElement.innerHTML = `
      <div class="card-actions-menu">
        <div class="kebab-icon">⋮</div>
        <div class="dropdown-menu">
          <button class="edit-button">수정</button>
          <button class="delete-button">삭제</button>
        </div>
      </div>
      ${postImage}
      <div class="activity-info">
        <h2 class="activity-title">${post.title}</h2>
        <p class="activity-date">${post.date}</p>
      </div>
    `;

    activityContainer.appendChild(postElement);

    // 상세 모달
    postElement.addEventListener("click", () => openDetailModal(post));

    // 케밥 토글
    const kebabIcon = postElement.querySelector(".kebab-icon");
    const dropdownMenu = postElement.querySelector(".dropdown-menu");
    kebabIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("active");
      document.querySelectorAll(".dropdown-menu").forEach(menu => {
        if (menu !== dropdownMenu) menu.classList.remove("active");
      });
    });

    // 수정
    const editButton = postElement.querySelector(".edit-button");
    editButton.addEventListener("click", (e) => {
      e.stopPropagation();
      openEditModal(post);
    });

    // 삭제
    const deleteButton = postElement.querySelector(".delete-button");
    deleteButton.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (confirm("정말 이 게시글을 삭제하시겠습니까?")) {
        await deletePost(post.id);
        fetchPosts();
      }
    });
  });
}

// 마지막 업데이트
function updateLastUpdateDate() {
  if (allPosts.length > 0) {
    const dateObj = new Date(allPosts[0].timestamp);
    const formatted = `${dateObj.getFullYear()}.${(dateObj.getMonth() + 1).toString().padStart(2, '0')}.${dateObj.getDate().toString().padStart(2, '0')} ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
    lastUpdateDateElement.textContent = `마지막 업데이트 ${formatted}`;
  } else {
    lastUpdateDateElement.textContent = `마지막 업데이트 -`;
  }
}

// 새 글쓰기 열기
writeButton.addEventListener("click", () => {
  if (auth.currentUser) {
    modalOverlay.classList.add("active");
    resetModal();
  } else {
    alert("로그인 후 글쓰기가 가능합니다.");
  }
});

closeModalButton.addEventListener("click", () => {
  modalOverlay.classList.remove("active");
});

// 이미지 미리보기
newImageFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      imagePreview.src = ev.target.result;
      imagePreviewWrapper.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.src = "";
    imagePreviewWrapper.style.display = "none";
  }
});

// 새 글 등록
addNewPostButton.addEventListener("click", async () => {
  const title = newTitleInput.value.trim();
  const content = newContentInput.value.trim();
  const imageFile = newImageFileInput.files[0];

  if (!imageFile) return alert("이미지를 첨부해주세요.");

  const now = new Date();
  const dateStr = now.toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  }).replace(/\. /g, '.').replace(/\.$/, '');

  try {
    const storageRef = ref(storage, `images/${Date.now()}_${imageFile.name}`);
    const uploadTask = await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(uploadTask.ref);

    await addDoc(collection(db, "history"), {
      title, content, imageUrl,
      date: dateStr,
      timestamp: now.toISOString()
    });

    alert("등록되었습니다.");
    modalOverlay.classList.remove("active");
    fetchPosts();
  } catch (e) {
    alert("등록 실패: " + (e.message || e));
  }
});

// 상세 모달
function openDetailModal(post) {
  detailTitle.textContent = post.title || '(제목 없음)';
  detailContent.textContent = post.content || '(내용 없음)';
  detailDate.textContent = post.date || '-';
  if (post.imageUrl) {
    detailImage.src = post.imageUrl;
    detailImage.style.display = "block";
  } else {
    detailImage.src = "";
    detailImage.style.display = "none";
  }
  detailModalOverlay.classList.add("active");
}

closeDetailModalButton.addEventListener("click", () => {
  detailModalOverlay.classList.remove("active");
});

// 수정 모달
function openEditModal(post) {
  modalOverlay.classList.add("active");
  newTitleInput.value = post.title;
  newContentInput.value = post.content;
  imagePreview.src = post.imageUrl || "";
  imagePreviewWrapper.style.display = post.imageUrl ? "block" : "none";
  newImageFileInput.value = "";

  const newButton = addNewPostButton.cloneNode(true);
  addNewPostButton.parentNode.replaceChild(newButton, addNewPostButton);
  addNewPostButton = newButton;
  addNewPostButton.textContent = "수정하기";

  addNewPostButton.addEventListener("click", async () => {
    const newTitle = newTitleInput.value.trim();
    const newContent = newContentInput.value.trim();
    const newImage = newImageFileInput.files[0];
    let newImageUrl = post.imageUrl;

    if (newImage) {
      const storageRef = ref(storage, `images/${Date.now()}_${newImage.name}`);
      const uploadTask = await uploadBytes(storageRef, newImage);
      newImageUrl = await getDownloadURL(uploadTask.ref);
    }

    await updateDoc(doc(db, "history", post.id), {
      title: newTitle,
      content: newContent,
      imageUrl: newImageUrl,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      }).replace(/\. /g, '.').replace(/\.$/, '')
    });

    alert("수정되었습니다.");
    modalOverlay.classList.remove("active");
    fetchPosts();
  });
}

// 삭제
async function deletePost(postId) {
  try {
    await deleteDoc(doc(db, "history", postId));
  } catch (e) {
    alert("삭제 실패: " + (e.message || e));
  }
}

// 검색
searchButton.addEventListener("click", performSearch);
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") performSearch();
});

function performSearch() {
  const keyword = searchInput.value.toLowerCase().trim();
  const result = keyword
    ? allPosts.filter(p =>
        p.title.toLowerCase().includes(keyword) ||
        p.content.toLowerCase().includes(keyword)
      )
    : allPosts;
  displayPosts(result);
}

// 모달 초기화
function resetModal() {
  newTitleInput.value = "";
  newContentInput.value = "";
  newImageFileInput.value = "";
  imagePreview.src = "";
  imagePreviewWrapper.style.display = "none";
  addNewPostButton.textContent = "등록하기";
}

// 초기 로딩
document.addEventListener("DOMContentLoaded", fetchPosts);
