// v9에서 필요한 함수들을 import 합니다.
import {
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";
import { db, storage } from "./firebase-init.js";

document.addEventListener("DOMContentLoaded", () => {
  // Quill 에디터 초기화
  const quill = new Quill("#editor", {
    theme: "snow",
    modules: {
      toolbar: [
        ["bold", "italic"],
        ["link", "image"],
      ],
    },
  });

  // 이미지 핸들러 재정의
  quill.getModule("toolbar").addHandler("image", () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          // --- Firebase Storage v9 방식으로 수정 ---
          // 1. Storage 참조 만들기
          const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
          // 2. 파일 업로드
          await uploadBytes(storageRef, file);
          // 3. 다운로드 URL 가져오기
          const downloadURL = await getDownloadURL(storageRef);

          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", downloadURL);
        } catch (error) {
          console.error("Image upload failed:", error);
          alert("이미지 업로드에 실패했습니다.");
        }
      }
    };
  });

  // 폼 제출 이벤트 처리
  const form = document.getElementById("write-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const content = quill.root.innerHTML;

    if (!title.trim() || content.trim() === "<p><br></p>") {
      alert("제목과 내용을 입력하세요.");
      return;
    }

    try {
      // --- Firestore v9 방식으로 수정 ---
      await addDoc(collection(db, "posts"), {
        title: title,
        category: category,
        content: content,
        createdAt: serverTimestamp(), // v9 방식의 타임스탬프 함수
      });

      alert("게시글 등록 성공!");
      window.location.href = "board.html";
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("등록 실패");
    }
  });
});
