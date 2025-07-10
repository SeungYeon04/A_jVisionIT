import {
  collection,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { db } from "./firebase-init.js";

document.addEventListener("DOMContentLoaded", async () => {
  const isLoggedIn = true;

  const writeButtonContainer = document.getElementById(
    "write-button-container"
  );
  if (isLoggedIn) {
    const writeLink = document.createElement("a");
    writeLink.href = "write.html";
    writeLink.innerHTML = "<button>글쓰기</button>";
    writeButtonContainer.appendChild(writeLink);
  }

  const postListContainer = document.getElementById("post-list");

  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    let postListHTML = "";
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      const date = post.createdAt
        ? post.createdAt
            .toDate()
            .toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
        : "날짜 없음";
      postListHTML += `
        <div class="post-item">
          <a href="post.html?id=${doc.id}">
            <span class="post-title">${post.title}</span>
            <span class="post-date">${date}</span>
          </a>
        </div>
      `;
    });

    postListContainer.innerHTML = postListHTML;
  } catch (error) {
    console.error("게시물을 불러오는 중 오류 발생:", error);
    postListContainer.innerHTML = "<p>게시물을 불러오는 데 실패했습니다.</p>";
  }

  // 페이지네이션 버튼에 대한 이벤트 리스너 (실제 페이지네이션 로직은 별도 구현 필요)
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      alert("이전글 버튼 클릭!");
      // 이전 페이지 로직 구현
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      alert("다음글 버튼 클릭!");
      // 다음 페이지 로직 구현
    });
  }
});
