window.$docsify = {
    name: 'AutoJs6',
    repo: 'SuperMonster003/AutoJs6-Documentation',
    notFoundPage: true,
    loadSidebar: true,
    subMaxLevel: 3,
    coverpage: true,
    loadNavbar: false,
    auto2top: true,
    homepage: 'overview.md',
    search: {
        maxAge: 86400000, // Expiration time, the default one day
        paths: 'auto',
        placeholder: '搜索文档',
        noData: '无搜索结果',
    },
    copyCode: {
        buttonText: 'Copy',
        errorText: 'Error',
        successText: 'Copied',
    },
};