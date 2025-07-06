fetch('/module/header.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('header-container').innerHTML = html;

    // ✅ header가 삽입된 이후에 script 삽입
    const script = document.createElement('script');
    script.src = '/js/header.js';
    document.body.appendChild(script);
  });
