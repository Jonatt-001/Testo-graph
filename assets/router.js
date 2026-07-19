class SmartRouter {
    constructor() {
        this.currentPath = window.location.pathname;
        this.currentPage = this.detectCurrentPage();
        this.init();
    }

    init() {
        this.autoLinkElements();
        this.setupEventListeners();
        this.updateActiveStates();
        this.handleBackButton();
    }

    // Detect current page from URL
    detectCurrentPage() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        for (const [key, route] of Object.entries(APP_ROUTES)) {
            if (route.path === path) return key;
        }
        return null;
    }

    // Auto-link elements with data-route attribute
    autoLinkElements() {
        // Elements with data-route
        document.querySelectorAll('[data-route]').forEach(el => {
            const routeName = el.getAttribute('data-route');
            const route = APP_ROUTES[routeName];
            if (route) {
                if (el.tagName === 'A') {
                    el.href = route.path;
                } else {
                    el.onclick = () => this.navigate(route.path);
                }
                el.dataset.routeLoaded = 'true';
            }
        });

        // Elements with data-action
        document.querySelectorAll('[data-action]').forEach(el => {
            const action = el.getAttribute('data-action');
            this.bindAction(el, action);
        });

        // Auto-back buttons
        document.querySelectorAll('[data-back]').forEach(el => {
            el.onclick = () => this.goBack();
        });

        // Navigation items
        document.querySelectorAll('.nav-item, .drawer-item').forEach(el => {
            if (!el.dataset.routeLoaded) {
                const href = el.getAttribute('href');
                if (href && !href.startsWith('#') && !href.startsWith('http')) {
                    el.onclick = (e) => {
                        e.preventDefault();
                        this.navigate(href);
                    };
                }
            }
        });
    }

    // Bind actions to elements
    bindAction(element, action) {
        const actions = {
            'go-back': () => this.goBack(),
            'refresh': () => window.location.reload(),
            'home': () => this.navigate('index.html'),
            'settings': () => this.navigate(APP_ROUTES.settings.path),
            'explore': () => this.navigate(APP_ROUTES.explore.path),
            'dashboard': () => this.navigate(APP_ROUTES.dashboard.path),
            'bin': () => this.navigate(APP_ROUTES.bin.path),
            'repositories': () => this.navigate(APP_ROUTES.repositories.path),
            'private-repos': () => this.navigate(APP_ROUTES['private-repos'].path)
        };

        if (actions[action]) {
            element.onclick = (e) => {
                e.preventDefault();
                actions[action]();
            };
        }
    }

    // Navigate to page
    navigate(path, params = {}) {
        // Add params to URL if provided
        let url = path;
        if (Object.keys(params).length > 0) {
            const queryString = new URLSearchParams(params).toString();
            url += `?${queryString}`;
        }
        
        // Smooth transition
        document.body.style.opacity = '0.8';
        setTimeout(() => {
            window.location.href = url;
        }, 150);
    }

    // Go back
    goBack() {
        if (this.currentPage && PAGE_RELATIONS[this.currentPage]?.back) {
            const backPage = PAGE_RELATIONS[this.currentPage].back;
            const route = APP_ROUTES[backPage];
            if (route) {
                this.navigate(route.path);
                return;
            }
        }
        window.history.back();
    }

    // Setup event listeners
    setupEventListeners() {
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.updateActiveStates();
        });

        // Intercept all clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link && !link.target && !link.download) {
                const href = link.getAttribute('href');
                if (!href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
                    // Let default behavior handle it
                }
            }
        });
    }

    // Update active states in navigation
    updateActiveStates() {
        const currentPage = this.detectCurrentPage();
        
        // Update nav items
        document.querySelectorAll('.nav-item, .drawer-item').forEach(el => {
            const href = el.getAttribute('href');
            const route = Object.values(APP_ROUTES).find(r => r.path === href);
            
            if (route) {
                const routeKey = Object.keys(APP_ROUTES).find(key => APP_ROUTES[key] === route);
                if (routeKey === currentPage) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            }
        });

        // Update page title if needed
        if (currentPage && APP_ROUTES[currentPage]) {
            const title = APP_ROUTES[currentPage].name;
            const titleEl = document.querySelector('.header-title, h1');
            if (titleEl && !titleEl.dataset.customTitle) {
                titleEl.textContent = title;
            }
        }
    }

    // Handle back button visibility
    handleBackButton() {
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            const relations = PAGE_RELATIONS[this.currentPage];
            if (relations && relations.back) {
                backBtn.style.display = 'flex';
            } else {
                backBtn.style.display = 'none';
            }
        }
    }

    // Get URL params
    getParams() {
        const params = new URLSearchParams(window.location.search);
        const obj = {};
        params.forEach((value, key) => {
            obj[key] = value;
        });
        return obj;
    }

    // Generate URL with params
    buildUrl(routeName, params = {}) {
        const route = APP_ROUTES[routeName];
        if (!route) return null;
        
        if (Object.keys(params).length === 0) {
            return route.path;
        }
        
        return `${route.path}?${new URLSearchParams(params).toString()}`;
    }
}

// Initialize router when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.router = new SmartRouter();
});

// Helper functions
window.navigateTo = (routeName, params = {}) => {
    if (window.router) {
        window.router.navigate(APP_ROUTES[routeName]?.path || routeName, params);
    }
};

window.buildUrl = (routeName, params = {}) => {
    if (window.router) {
        return window.router.buildUrl(routeName, params);
    }
    return null;
};
