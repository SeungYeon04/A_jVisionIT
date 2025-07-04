const openBtn = document.getElementById('openWriteModal');
const modal = document.getElementById('writeModal');
const closeBtn = document.getElementById('closeModal');
const form = document.getElementById('writeForm');
const activityList = document.getElementById('activityList');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');

openBtn.onclick = () => modal.style.display = 'flex';
closeBtn.onclick = () => modal.style.display = 'none';

form.onsubmit = (e) => {
    e.preventDefault();

    const file = document.getElementById('imageInput').files[0];
    const title = document.getElementById('titleInput').value;
    const desc = document.getElementById('descInput').value;

    if (!file) return alert('이미지를 선택해주세요');

    const reader = new FileReader();
    reader.onload = function (event) {
        const newItem = document.createElement('div');
        newItem.className = 'activity-item';
        newItem.innerHTML = `
        <img src="${event.target.result}" alt="활동 이미지">
        <div class="activity-text">
            <p><h3>${title}</h3><br>${desc}</p>
        </div>
        `;
        activityList.prepend(newItem);
        form.reset();
        modal.style.display = 'none';
    };
    reader.readAsDataURL(file);
};

imageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.src = '';
        imagePreview.style.display = 'none';
    }
});