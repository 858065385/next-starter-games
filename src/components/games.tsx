document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a.game-thumbnail').forEach(link => {
        link.addEventListener('click', function(e) {
            // Check if the link is handled by the inline script (data-url exists)
            if (this.hasAttribute('data-url')) {
                return; // Let the inline script in index.html handle it
            }

            e.preventDefault();
            
            const url = this.href;
            const gameId = this.getAttribute('data-id');
            
            let destinationUrl = new URL(url);

            if (gameId) {
                destinationUrl.searchParams.set('id', gameId);
            }
            
            window.location.href = destinationUrl.toString();
        });
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const gameCategories = document.querySelectorAll('.game-category');

            gameCategories.forEach(category => {
                const games = category.querySelectorAll('.game-thumbnail');
                let hasVisibleGame = false;

                games.forEach(game => {
                    const titleElement = game.querySelector('h5');
                    if (titleElement) {
                        const title = titleElement.textContent.toLowerCase();
                        if (title.includes(searchTerm)) {
                            game.style.display = '';
                            hasVisibleGame = true;
                        } else {
                            game.style.display = 'none';
                        }
                    }
                });

                if (hasVisibleGame) {
                    category.style.display = 'block';
                } else {
                    category.style.display = 'none';
                }
            });
        });
    }
}); 

/**
 * 游戏加载器
 * 负责从games.json加载游戏数据并渲染到页面
 */

class GameLoader {
    constructor() {
        this.gamesData = null;
        this.mainContent = document.querySelector('.main-content');
    }

    /**
     * 初始化游戏加载器
     */
    async init() {
        try {
            const response = await fetch('/js/games/games.json');
            this.gamesData = await response.json();
            this.renderCategories();
        } catch (error) {
            console.error('Error loading games data:', error);
        }
    }

    /**
     * 渲染所有游戏分类
     */
    renderCategories() {
        if (!this.gamesData || !this.gamesData.categories) return;

        // 清空主内容区
        this.mainContent.innerHTML = '';

        // 将分类对象转换为数组并按权重排序
        const sortedCategories = Object.entries(this.gamesData.categories)
            .sort(([, a], [, b]) => (b.weight || 0) - (a.weight || 0));

        // 遍历排序后的分类并渲染
        sortedCategories.forEach(([categoryId, category]) => {
            this.renderCategory(categoryId, category);
        });
    }

    /**
     * 渲染单个分类
     * @param {string} categoryId - 分类ID
     * @param {object} category - 分类数据
     */
    renderCategory(categoryId, category) {
        const section = document.createElement('section');
        section.className = 'game-category';
        
        // 创建分类标题和描述
        const headerDiv = document.createElement('div');
        headerDiv.innerHTML = `
            <h1 style="margin-right:16px">${category.title}</h1>
            <p>${category.description}</p>
        `;

        // 创建游戏画廊
        const galleryDiv = document.createElement('div');
        galleryDiv.className = 'game-gallery';

        // 获取并排序该分类下的所有游戏
        const sortedGames = category.games
            .map(gameId => this.gamesData.games[gameId])
            .filter(game => game) // 确保游戏存在
            .sort((a, b) => (b.weight || 0) - (a.weight || 0));

        // 渲染排序后的游戏
        sortedGames.forEach(game => {
            const gameElement = this.createGameElement(game);
            galleryDiv.appendChild(gameElement);
        });

        section.appendChild(headerDiv);
        section.appendChild(galleryDiv);
        this.mainContent.appendChild(section);
    }

    /**
     * 创建单个游戏元素
     * @param {object} game - 游戏数据
     * @returns {HTMLElement} 游戏元素
     */
    createGameElement(game) {
        const gameLink = document.createElement('a');
        gameLink.className = 'game-thumbnail';
        gameLink.href = 'play.html';
        gameLink.setAttribute('data-url', game.url);
        gameLink.setAttribute('data-id', game.id);

        const img = document.createElement('img');
        img.src = game.thumb;
        img.alt = game.title;
        img.loading = 'lazy'; // 懒加载图片

        const titleDiv = document.createElement('div');
        titleDiv.className = 'title-overlay';
        titleDiv.innerHTML = `<h5>${game.title}</h5>`;

        gameLink.appendChild(img);
        gameLink.appendChild(titleDiv);

        return gameLink;
    }

    /**
     * 搜索游戏
     * @param {string} query - 搜索关键词
     */
    searchGames(query) {
        if (!query.trim()) {
            this.renderCategories();
            return;
        }

        const searchResults = Object.values(this.gamesData.games).filter(game => {
            const searchString = `${game.title} ${game.description} ${game.tags.join(' ')}`.toLowerCase();
            return searchString.includes(query.toLowerCase());
        });

        this.renderSearchResults(searchResults);
    }

    /**
     * 渲染搜索结果
     * @param {Array} results - 搜索结果
     */
    renderSearchResults(results) {
        this.mainContent.innerHTML = '';

        const section = document.createElement('section');
        section.className = 'game-category';

        const headerDiv = document.createElement('div');
        headerDiv.innerHTML = `
            <h1 style="margin-right:16px">🔍 搜索结果</h1>
            <p>找到 ${results.length} 个游戏</p>
        `;

        const galleryDiv = document.createElement('div');
        galleryDiv.className = 'game-gallery';

        results.forEach(game => {
            const gameElement = this.createGameElement(game);
            galleryDiv.appendChild(gameElement);
        });

        section.appendChild(headerDiv);
        section.appendChild(galleryDiv);
        this.mainContent.appendChild(section);
    }
}

// 当页面加载完成后初始化游戏加载器
document.addEventListener('DOMContentLoaded', () => {
    const gameLoader = new GameLoader();
    gameLoader.init();

    // 添加搜索功能
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                gameLoader.searchGames(e.target.value);
            }, 300);
        });
    }
}); 