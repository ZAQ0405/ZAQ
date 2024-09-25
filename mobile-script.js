let carouselInterval;
let isTransitioning = false;

function initMobileCarousel() {
    const carousel = document.querySelector('#recent-updates .carousel');
    if (carousel) {
        const items = carousel.querySelectorAll('.carousel-item');
        const prevButton = document.querySelector('#recent-updates .carousel-button.prev');
        const nextButton = document.querySelector('#recent-updates .carousel-button.next');
        let currentIndex = 0;

        function showItem(index) {
            if (isTransitioning) return;
            isTransitioning = true;

            items.forEach((item, i) => {
                if (i === index) {
                    item.style.opacity = '0';
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        isTransitioning = false;
                    }, 50);
                } else {
                    item.style.display = 'none';
                }
            });
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % items.length;
            showItem(currentIndex);
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            showItem(currentIndex);
        }

        function resetAutoPlay() {
            if (carouselInterval) {
                clearInterval(carouselInterval);
            }
            carouselInterval = setInterval(showNext, 5000);
        }

        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => {
                showPrev();
                resetAutoPlay();
            });
            nextButton.addEventListener('click', () => {
                showNext();
                resetAutoPlay();
            });
        }

        // 初始化显示第一个项目
        showItem(currentIndex);

        // 设置自动轮播
        resetAutoPlay();
    }
}

function handleResize() {
    if (window.innerWidth <= 767) {
        initMobileCarousel();
    } else {
        // 如果是PC端，清除自动轮播
        if (carouselInterval) {
            clearInterval(carouselInterval);
        }
        // 重置所有轮播项的显示状态
        const items = document.querySelectorAll('#recent-updates .carousel-item');
        items.forEach(item => {
            item.style.display = '';
            item.style.opacity = '';
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    handleResize(); // 初始化时调用一次
    window.addEventListener('resize', handleResize); // 监听窗口大小变化
});