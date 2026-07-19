// Route Configuration - All pages and their relationships
window.APP_ROUTES = {
    // Main Pages
    'dashboard': {
        path: 'index.html',
        name: 'Dashboard',
        icon: 'home',
        category: 'main'
    },
    'explore': {
        path: 'explore/index.html',
        name: 'Explore',
        icon: 'compass',
        category: 'main'
    },
    'repositories': {
        path: 'repositories/index.html',
        name: 'Repositories',
        icon: 'folder',
        category: 'main'
    },
    'private-repos': {
        path: 'private/index.html',
        name: 'Private Repos',
        icon: 'lock',
        category: 'main'
    },
    'bin': {
        path: 'bin/index.html',
        name: 'Recycle Bin',
        icon: 'trash',
        category: 'main'
    },
    'settings': {
        path: 'settings/index.html',
        name: 'Settings',
        icon: 'settings',
        category: 'account'
    },
    'login': {
        path: 'login.html',
        name: 'Login',
        icon: 'log-in',
        category: 'auth'
    },
    
    // Detail Pages
    'explorer': {
        path: 'explorer.html',
        name: 'File Explorer',
        icon: 'folder-open',
        category: 'detail',
        params: ['repo', 'branch', 'path']
    },
    'editor': {
        path: 'editor.html',
        name: 'Code Editor',
        icon: 'edit',
        category: 'detail',
        params: ['repo', 'path', 'branch']
    },
    'repo-settings': {
        path: 'repo-settings.html',
        name: 'Repository Settings',
        icon: 'settings',
        category: 'detail',
        params: ['repo']
    },
    
    // API Endpoints
    'api-token': {
        path: 'api/token',
        type: 'api'
    }
};

// Navigation Groups
window.NAV_GROUPS = {
    main: ['dashboard', 'explore', 'repositories', 'private-repos'],
    account: ['settings', 'bin'],
    auth: ['login']
};

// Page Relationships (where to go from where)
window.PAGE_RELATIONS = {
    'dashboard': {
        next: ['explore', 'repositories'],
        related: ['settings']
    },
    'explorer': {
        parent: 'dashboard',
        children: ['editor', 'repo-settings'],
        back: 'dashboard'
    },
    'editor': {
        parent: 'explorer',
        back: 'explorer'
    }
};
