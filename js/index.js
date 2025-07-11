        let currentIndex = 0;
        const wrapper = document.getElementById('infoCardsWrapper');
        const originalCards = Array.from(wrapper.getElementsByClassName('card'));

        function renderVisibleCards(centerIndex, direction = null) {
            const cardsLength = originalCards.length;
            const visibleCards = [
                originalCards[(centerIndex - 1 + cardsLength) % cardsLength],
                originalCards[centerIndex],
                originalCards[(centerIndex + 1) % cardsLength],
            ];

            if (direction) {
                wrapper.classList.add('animating');
                wrapper.style.transition = 'transform 0.4s ease';
                wrapper.style.transform = direction === 'left' ? 'translateX(100px)' : 'translateX(-100px)';
            }

            setTimeout(() => {
                wrapper.innerHTML = '';
                visibleCards.forEach((card, i) => {
                    card.classList.remove('active');
                    if (i === 1) card.classList.add('active');
                    card.onclick = () => slideTo((centerIndex + i - 1 + cardsLength) % cardsLength, i === 0 ? 'left' : 'right');
                    wrapper.appendChild(card);
                });

                if (direction) {
                    requestAnimationFrame(() => {
                        wrapper.style.transition = 'transform 0.4s ease';
                        wrapper.style.transform = 'translateX(0)';
                    });
                }
            }, direction ? 10 : 0);
        }

        function slideTo(index, direction) {
            currentIndex = (index + originalCards.length) % originalCards.length;
            renderVisibleCards(currentIndex, direction);
        }

        window.addEventListener('load', () => renderVisibleCards(currentIndex));

        //메인배너
        const bannerImages = [
            "/asset/img/school_main.png",
            "/asset/img/school_main.png",
            "/asset/img/school_main.png"

        ];
        let currentBannerIndex = 0;
        const bannerImg = document.getElementById('mainBannerImage');

        setInterval(() => {
            currentBannerIndex = (currentBannerIndex + 1) % bannerImages.length;
            bannerImg.src = bannerImages[currentBannerIndex];
        }, 5000);