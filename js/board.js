import {
  collection,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { db, auth } from "./firebaseInit.js"; // firebase-init.js 사용

document.addEventListener("DOMContentLoaded", () => {
  const writeButtonContainer = document.getElementById(
    "write-button-container"
  );
  const postListContainer = document.getElementById("post-list");

  // 실시간으로 로그인 상태를 감지합니다.
  onAuthStateChanged(auth, (user) => {
    // user 객체가 있으면 로그인된 상태, 없으면 로그아웃 상태입니다.
    if (user) {
      // 로그인 상태: 글쓰기 버튼을 보여줍니다.
      writeButtonContainer.innerHTML = `<a href="write.html"><button>글쓰기</button></a>`;
    } else {
      // 로그아웃 상태: 글쓰기 버튼을 숨깁니다.
      writeButtonContainer.innerHTML = "";
    }
  });

  // Firestore에서 게시물 목록을 불러오는 비동기 함수
  const fetchPosts = async () => {
    try {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      let postListHTML = "";
      querySnapshot.forEach((doc) => {
        const post = doc.data();
        const date = post.createdAt
          ? post.createdAt.toDate().toLocaleDateString("ko-KR")
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
  };

  // 함수 실행
  fetchPosts();
});
