// post.js

// 1. 로컬 설정 파일에서 db 객체를 먼저 가져옵니다. (login.js와 동일한 순서)
import { db } from "./firebaseInit.js";

// 2. 최신 버전(v10) SDK에서 필요한 함수들을 직접 가져옵니다.
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// DOMPurify는 HTML에 직접 script 태그로 추가했으므로 import하지 않아도 됩니다.

document.addEventListener("DOMContentLoaded", async () => {
  const postTitle = document.getElementById("post-title");
  const postMeta = document.getElementById("post-meta");
  const postContent = document.getElementById("post-content");

  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  if (!postId) {
    postContent.innerHTML = "잘못된 접근입니다.";
    return;
  }

  try {
    // ✅ v10 방식: doc() 함수로 문서 참조를 만듭니다.
    const docRef = doc(db, "posts", postId);

    // ✅ v10 방식: getDoc() 함수로 문서를 가져옵니다.
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const post = docSnap.data();

      postTitle.textContent = post.title;
      const postDate = post.createdAt
        ? post.createdAt.toDate().toLocaleDateString()
        : "날짜 없음";
      const authorName = post.authorName || "작성자 없음";
      postMeta.textContent = `카테고리: ${post.category} | 작성자: ${authorName} | 작성일: ${postDate}`;

      const sanitizedContent = DOMPurify.sanitize(post.content);
      postContent.innerHTML = sanitizedContent;
    } else {
      postContent.textContent = "존재하지 않는 게시물입니다.";
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    postContent.textContent = "게시물을 불러오는 중 오류가 발생했습니다.";
  }
});
