// v9에서 필요한 함수들을 import 합니다.
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { db } from "./firebase-init.js";

// DOMPurify는 HTML에 직접 script 태그로 추가했으므로 import하지 않아도 됩니다.

document.addEventListener("DOMContentLoaded", async () => {
  const postTitle = document.getElementById("post-title");
  const postMeta = document.getElementById("post-meta");
  const postContent = document.getElementById("post-content");

  // 1. URL에서 게시글 ID 추출
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  if (!postId) {
    postContent.innerHTML = "잘못된 접근입니다.";
    return;
  }

  try {
    // --- Firestore 데이터 로드 부분 변경 (v9 방식) ---
    // 2. ID를 이용해 Firestore에서 해당 문서의 참조(reference) 만들기
    const docRef = doc(db, "posts", postId);
    // 3. 참조를 이용해 실제 문서 데이터 가져오기
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const post = docSnap.data();

      // 4. 가져온 데이터를 HTML 요소에 채우기
      postTitle.textContent = post.title;
      const postDate = post.createdAt.toDate().toLocaleDateString();
      postMeta.textContent = `카테고리: ${post.category} | 작성일: ${postDate}`;

      // 5. ※ 중요: HTML 콘텐츠는 반드시 소독(Sanitize) 후 삽입
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
