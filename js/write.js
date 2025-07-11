import {
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { db, storage, auth } from "./firebaseInit.js"; // firebase-init.js 사용
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
          const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
          await uploadBytes(storageRef, file);
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

    // 현재 로그인한 사용자가 있는지 확인
    const user = auth.currentUser;
    if (!user) {
      alert("글을 작성하려면 로그인이 필요합니다.");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        title: title,
        category: category,
        content: content,
        createdAt: serverTimestamp(),
        authorId: user.uid, // 작성자 UID 추가
        authorName: user.email || "익명", // 작성자 이름 추가
      });

      alert("게시글 등록 성공!");
      window.location.href = "board.html";
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("등록 실패");
    }
  });
});
