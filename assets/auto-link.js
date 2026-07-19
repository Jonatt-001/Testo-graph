// Auto-discover and link elements based on classes and data attributes
class AutoLinker {
    constructor() {
        this.init();
    }

    init() {
        this.linkByClass();
        this.linkByDataAttribute();
        this.setupBreadcrumbs();
        this.setupQuickActions();
    }

    // Link elements by class names
    linkByClass() {
        // Dashboard links
        document.querySelectorAll('.go-dashboard, .dashboard-link').forEach(el => {
            el.href = APP_ROUTES.dashboard.path;
        });

        // Explore links
        document.querySelectorAll('.go-explore, .explore-link').forEach(el => {
            el.href = APP_ROUTES.explore.path;
        });

        // Settings links
        document.querySelectorAll('.go-settings, .settings-link').forEach(el => {
            el.href = APP_ROUTES.settings.path;
        });

        // Bin/Trash links
        document.querySelectorAll('.go-bin, .bin-link, .trash-link').forEach(el => {
            el.href = APP_ROUTES.bin.path;
        });

        // Repositories links
        document.querySelectorAll('.go-repositories, .repos-link').forEach(el => {
            el.href = APP_ROUTES.repositories.path;
        });

        // Private repos links
        document.querySelectorAll('.go-private, .private-link').forEach(el => {
            el.href = APP_ROUTES['private-repos'].path;
        });
    }

    // Link elements by data attributes
    linkByDataAttribute() {
        // data-repo-link - links to repo explorer
        document.querySelectorAll('[data-repo-link]').forEach(el => {
            const repoName = el.getAttribute('data-repo-link');
            el.href = `explorer.html?repo=${encodeURIComponent(repoName)}&branch=main`;
        });

        // data-file-link - links to file editor
        document.querySelectorAll('[data-file-link]').forEach(el => {
            const [repo, path] = el.getAttribute('data-file-link').split('/');
            el.href = `editor.html?repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(path)}&branch=main`;
        });

        // data-repo-settings - links to repo settings
        document.querySelectorAll('[data-repo-settings]').forEach(el => {
            const repoName = el.getAttribute('data-repo-settings');
            el.href = `repo-settings.html?repo=${encodeURIComponent(repoName)}`;
        });
    }

    // Setup breadcrumbs dynamically
    setupBreadcrumbs() {
        const breadcrumb = document.querySelector('.breadcrumb');
        if (!breadcrumb) return;

        const currentPage = window.router?.currentPage || 'dashboard';
        const relations = PAGE_RELATIONS[currentPage];
        
        if (relations) {
            let html = '';
            
            // Home link
            html += `<a href="${APP_ROUTES.dashboard.path}" class="breadcrumb-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
            </a>`;
            
            // Parent link
            if (relations.parent) {
                const parentRoute = APP_ROUTES[relations.parent];
                if (parentRoute) {
                    html += `<span class="breadcrumb-sep">/</span>`;
                    html += `<a href="${parentRoute.path}" class="breadcrumb-item">${parentRoute.name}</a>`;
                }
            }
            
            // Current page
            const currentRoute = APP_ROUTES[currentPage];
            if (currentRoute && currentPage !== 'dashboard') {
                html += `<span class="breadcrumb-sep">/</span>`;
                html += `<span class="breadcrumb-item current">${currentRoute.name}</span>`;
            }
            
            breadcrumb.innerHTML = html;
        }
    }

    // Setup quick actions
    setupQuickActions() {
        // Auto-link quick action buttons
        document.querySelectorAll('.action-item, .quick-action').forEach(el => {
            const text = el.textContent.toLowerCase();
            
            if (text.includes('upload')) {
                el.setAttribute('data-route', 'explorer');
            } else if (text.includes('new repo') || text.includes('new project')) {
                el.onclick = () => {
                    document.querySelector('[data-action="new-repo"]')?.click();
                };
            } else if (text.includes('new file')) {
                el.setAttribute('data-route', 'explorer');
            }
        });
    }
}

// Initialize auto-linker
document.addEventListener('DOMContentLoaded', () => {
    window.autoLinker = new AutoLinker();
});
