(function() {
    const pageContainer = document.getElementById('pageContainer');
    const navItems = document.querySelectorAll('.nav-item');

    const loadedAssets = {
        css: new Set(),
        js: new Set()
    };

    function loadCSS(href) {
        if (loadedAssets.css.has(href)) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = () => { loadedAssets.css.add(href); resolve(); };
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    function loadJS(src) {
        if (loadedAssets.js.has(src)) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => { loadedAssets.js.add(src); resolve(); };
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    function removeOldPageAssets() {
        document.querySelectorAll('link[href^="css/page"]').forEach(link => link.remove());
        loadedAssets.css.clear();
    }

    async function switchPage(pageId) {
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === pageId) item.classList.add('active');
        });

        pageContainer.innerHTML = '';
        removeOldPageAssets();

        try {
            const response = await fetch(`pages/${pageId}.html`);
            if (!response.ok) throw new Error(`加载 ${pageId} 失败`);
            const html = await response.text();
            pageContainer.innerHTML = html;

            await loadCSS(`css/${pageId}.css`);
            await loadJS(`js/${pageId}.js`);

            if (typeof window[`init_${pageId}`] === 'function') {
                window[`init_${pageId}`]();
            }
        } catch (error) {
            console.error(error);
            pageContainer.innerHTML = `<div class="card" style="text-align:center; padding:40px;">页面加载失败，请刷新重试。</div>`;
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.dataset.page;
            if (pageId) switchPage(pageId);
        });
    });

    const activeNav = document.querySelector('.nav-item.active');
    const defaultPage = activeNav ? activeNav.dataset.page : 'page1';
    switchPage(defaultPage);
})();