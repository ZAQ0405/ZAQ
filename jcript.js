document.addEventListener('DOMContentLoaded', () => {
    // 加载动画
    const loadingScreen = document.getElementById('loading-screen');
    const loadingContent = loadingScreen.querySelector('.loading-content h1');

    // 显示1秒后开始淡出
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingContent.style.opacity = '0';

        // 2秒淡出后隐藏加载屏幕
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 2000);
    }, 1000);

    // 最近更新轮播
    class Carousel {
        constructor(element) {
            this.element = element;
            this.items = element.querySelectorAll('.carousel-item');
            this.totalItems = this.items.length;
            this.currentIndex = 0;
            this.interval = null;
            this.autoPlayDelay = 5000;
            this.pauseAfterInteractionDelay = 10000;
            this.resizeHandler = this.handleResize.bind(this);
            window.addEventListener('resize', this.resizeHandler);
        }

        init() {
            this.showItems();
            const prevButton = this.element.parentElement.querySelector('.carousel-button.prev');
            const nextButton = this.element.parentElement.querySelector('.carousel-button.next');
            
            if (prevButton) {
                prevButton.addEventListener('click', () => this.userInteraction(() => this.prev()));
            }
            if (nextButton) {
                nextButton.addEventListener('click', () => this.userInteraction(() => this.next()));
            }
            
            this.element.addEventListener('mouseenter', () => this.pause());
            this.element.addEventListener('mouseleave', () => this.play());
            
            this.play();
            this.handleResize();
        }

        showItems() {
            this.items.forEach((item, index) => {
                item.classList.remove('left', 'center', 'right');
                let position = (index - this.currentIndex + this.totalItems) % this.totalItems;
                if (position === this.totalItems - 1) {
                    item.classList.add('left');
                    item.style.order = -1;
                    item.querySelector('a').style.pointerEvents = 'none';
                } else if (position === 0) {
                    item.classList.add('center');
                    item.style.order = 0;
                    item.querySelector('a').style.pointerEvents = 'auto';
                } else if (position === 1) {
                    item.classList.add('right');
                    item.style.order = 1;
                    item.querySelector('a').style.pointerEvents = 'none';
                } else {
                    item.style.order = 2;
                }
                item.style.display = (position === this.totalItems - 1 || position === 0 || position === 1) ? 'flex' : 'none';
            });
        }

        next() {
            this.currentIndex = (this.currentIndex + 1) % this.totalItems;
            this.showItems();
        }

        prev() {
            this.currentIndex = (this.currentIndex - 1 + this.totalItems) % this.totalItems;
            this.showItems();
        }

        play() {
            if (this.interval) {
                clearInterval(this.interval);
            }
            this.interval = setInterval(() => this.next(), this.autoPlayDelay);
        }

        pause() {
            if (this.interval) {
                clearInterval(this.interval);
            }
        }

        userInteraction(action) {
            this.pause();
            action();
            clearTimeout(this.resumeTimeout);
            this.resumeTimeout = setTimeout(() => this.play(), this.pauseAfterInteractionDelay);
        }

        handleResize() {
            this.showItems();
        }

        destroy() {
            window.removeEventListener('resize', this.resizeHandler);
            clearInterval(this.interval);
            clearTimeout(this.resumeTimeout);
        }
    }

    const updateCarousel = new Carousel(document.querySelector('#recent-updates .carousel'));
    updateCarousel.init();

    // 添加平滑滚动效果
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const headerOffset = 70; // 根据实际导航栏高度调整
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        });
    });
});

// 检测设备类型
function isMobile() {
    return window.innerWidth <= 767;
}

// PC端特定功能
function pcSpecificFunction() {
    console.log("这是PC端特定功能");
    // 在这里添加PC端特定的JavaScript代码
}

// 移动端特定功能
function mobileSpecificFunction() {
    console.log("这是移动端特定功能");
    // 在这里添加移动端特定的JavaScript代码
}

// 根据设备类型执行相应的功能
if (isMobile()) {
    mobileSpecificFunction();
} else {
    pcSpecificFunction();
}

// 通用功能
function commonFunction() {
    console.log("这是通用功能");
    // 在这里添加both PC和移动端都需要的JavaScript代码
}

// 执行通用功能
commonFunction();

// 监听窗口大小变化，动态调整功能
window.addEventListener('resize', function() {
    if (isMobile()) {
        mobileSpecificFunction();
    } else {
        pcSpecificFunction();
    }
});

// 这里可以添加更多的JavaScript功能，比如动态加载资源列表等

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    let captions = document.getElementsByClassName("text"); // 新增：获取所有文字说明

    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        captions[i].style.display = "none"; // 新增：隐藏所有文字说明
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    slides[slideIndex-1].style.display = "block";
    captions[slideIndex-1].style.display = "block"; // 新增：显示当前图片对应的文字说明
    dots[slideIndex-1].className += " active";
}

// ... existing code ...