fetch('/module/header.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('header-container').innerHTML = html;
    });
const script = document.createElement('script');
script.src = '/js/header.js';
document.body.appendChild(script);
