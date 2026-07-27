(function () {
    'use strict';

    const root = document.querySelector('[data-offline-search]');
    const toggleButton = document.querySelector(
        '[data-offline-search-toggle]',
    );
    if (!root || !toggleButton) {
        return;
    }

    const input = root.querySelector('[data-offline-search-input]');
    const clearButton = root.querySelector('[data-offline-search-clear]');
    const closeButton = root.querySelector('[data-offline-search-close]');
    const status = root.querySelector('[data-offline-search-status]');
    const results = root.querySelector('[data-offline-search-results]');
    const indexSource = root.getAttribute('data-index-src');
    if (!input || !clearButton || !closeButton || !status || !results) {
        return;
    }
    const maximumResults = 50;
    let preparedEntries = null;
    let loadingPromise = null;
    let searchTimer = null;
    let searchRequestId = 0;
    let selectedIndex = -1;
    let lastMatches = [];
    let lastQuery = '';
    let resultsDismissed = false;
    let composing = false;

    function normalize(value) {
        const text = String(value || '');
        const compatible = typeof text.normalize === 'function'
            ? text.normalize('NFKC')
            : text;
        return compatible.toLocaleLowerCase().replace(/\s+/g, ' ').trim();
    }

    function setStatus(message, state) {
        status.textContent = message;
        root.setAttribute('data-state', state || '');
    }

    function resetSelection() {
        const links = Array.from(
            results.querySelectorAll('.offline-search-result-link'),
        );
        links.forEach(function (link) {
            link.classList.remove('selected');
            link.setAttribute('aria-selected', 'false');
        });
        selectedIndex = -1;
        input.removeAttribute('aria-activedescendant');
    }

    function hideResults() {
        results.hidden = true;
        input.setAttribute('aria-expanded', 'false');
        resetSelection();
    }

    function dismissResults() {
        resultsDismissed = true;
        hideResults();
    }

    function cancelSearch() {
        window.clearTimeout(searchTimer);
        searchTimer = null;
        searchRequestId += 1;
    }

    function openSearch(selectContents) {
        resultsDismissed = false;
        root.hidden = false;
        toggleButton.setAttribute('aria-expanded', 'true');
        input.focus();
        if (selectContents) {
            input.select();
        }
    }

    function closeSearch(restoreFocus) {
        cancelSearch();
        dismissResults();
        root.hidden = true;
        toggleButton.setAttribute('aria-expanded', 'false');
        if (restoreFocus) {
            toggleButton.focus();
        }
    }

    function prepareIndex(index) {
        if (!index || index.version !== 1 || !Array.isArray(index.entries)) {
            throw new Error('Unsupported offline search index');
        }
        preparedEntries = index.entries.map(function (entry) {
            const url = String(entry[0] || '');
            const pageTitle = String(entry[1] || '');
            const heading = String(entry[2] || '');
            const content = String(entry[3] || '');
            return {
                url: url,
                pageTitle: pageTitle,
                heading: heading,
                content: content,
                normalizedTitle: normalize(pageTitle + ' ' + heading),
                normalizedHeading: normalize(heading),
                normalizedContent: normalize(content),
            };
        });
    }

    function loadIndex() {
        if (preparedEntries) {
            return Promise.resolve(preparedEntries);
        }
        if (loadingPromise) {
            return loadingPromise;
        }
        loadingPromise = new Promise(function (resolve, reject) {
            const existing = window.__AUTOJS6_OFFLINE_SEARCH_INDEX__;
            if (existing) {
                try {
                    prepareIndex(existing);
                    resolve(preparedEntries);
                } catch (error) {
                    reject(error);
                }
                return;
            }
            const script = document.createElement('script');
            script.src = indexSource;
            script.async = true;
            script.onload = function () {
                try {
                    prepareIndex(window.__AUTOJS6_OFFLINE_SEARCH_INDEX__);
                    resolve(preparedEntries);
                } catch (error) {
                    reject(error);
                }
            };
            script.onerror = function () {
                reject(new Error('Offline search index could not be loaded'));
            };
            document.head.appendChild(script);
        }).catch(function (error) {
            loadingPromise = null;
            throw error;
        });
        return loadingPromise;
    }

    function escapeRegularExpression(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function appendHighlightedText(element, value, terms) {
        const usableTerms = terms
            .filter(Boolean)
            .sort(function (left, right) {
                return right.length - left.length;
            });
        if (!usableTerms.length) {
            element.textContent = value;
            return;
        }
        const pattern = new RegExp(
            '(' + usableTerms.map(escapeRegularExpression).join('|') + ')',
            'gi',
        );
        value.split(pattern).forEach(function (part) {
            if (!part) {
                return;
            }
            if (usableTerms.indexOf(normalize(part)) !== -1) {
                const mark = document.createElement('mark');
                mark.textContent = part;
                element.appendChild(mark);
            } else {
                element.appendChild(document.createTextNode(part));
            }
        });
    }

    function snippetFor(entry, terms) {
        const content = entry.content;
        if (!content) {
            return '';
        }
        const normalizedContent = entry.normalizedContent;
        let firstMatch = -1;
        terms.forEach(function (term) {
            const index = normalizedContent.indexOf(term);
            if (index !== -1 && (firstMatch === -1 || index < firstMatch)) {
                firstMatch = index;
            }
        });
        const start = Math.max(0, (firstMatch === -1 ? 0 : firstMatch) - 70);
        const end = Math.min(content.length, start + 220);
        return (start ? '...' : '') +
            content.slice(start, end) +
            (end < content.length ? '...' : '');
    }

    function scoreEntry(entry, terms) {
        let score = 0;
        for (let index = 0; index < terms.length; index += 1) {
            const term = terms[index];
            const titleIndex = entry.normalizedTitle.indexOf(term);
            const contentIndex = entry.normalizedContent.indexOf(term);
            if (titleIndex === -1 && contentIndex === -1) {
                return -1;
            }
            if (entry.normalizedHeading === term) {
                score += 160;
            } else if (entry.normalizedHeading.startsWith(term)) {
                score += 100;
            } else if (titleIndex !== -1) {
                score += 70 - Math.min(titleIndex, 30);
            }
            if (contentIndex !== -1) {
                score += 20 - Math.min(Math.floor(contentIndex / 120), 10);
            }
        }
        return score;
    }

    function updateSelection(nextIndex) {
        const links = Array.from(
            results.querySelectorAll('.offline-search-result-link'),
        );
        resetSelection();
        if (!links.length) {
            return;
        }
        selectedIndex = (nextIndex + links.length) % links.length;
        const selected = links[selectedIndex];
        selected.classList.add('selected');
        selected.setAttribute('aria-selected', 'true');
        selected.scrollIntoView({ block: 'nearest' });
        input.setAttribute('aria-activedescendant', selected.id);
    }

    function renderMatches(matches, terms, total, showResults) {
        results.textContent = '';
        resetSelection();
        if (!matches.length) {
            if (showResults) {
                results.hidden = false;
                input.setAttribute('aria-expanded', 'true');
            } else {
                hideResults();
            }
            setStatus('无搜索结果', 'empty');
            return;
        }

        const list = document.createElement('ol');
        list.className = 'offline-search-result-list';
        list.setAttribute('role', 'none');
        matches.forEach(function (match, index) {
            const item = document.createElement('li');
            const link = document.createElement('a');
            const title = document.createElement('span');
            const page = document.createElement('span');
            const snippet = document.createElement('span');
            link.id = 'offline-search-result-' + index;
            link.className = 'offline-search-result-link';
            link.href = match.entry.url;
            link.setAttribute('role', 'option');
            link.setAttribute('aria-selected', 'false');
            item.setAttribute('role', 'none');
            title.className = 'offline-search-result-title';
            page.className = 'offline-search-result-page';
            snippet.className = 'offline-search-result-snippet';
            appendHighlightedText(title, match.entry.heading, terms);
            page.textContent = match.entry.pageTitle;
            appendHighlightedText(
                snippet,
                snippetFor(match.entry, terms),
                terms,
            );
            link.appendChild(title);
            if (match.entry.pageTitle !== match.entry.heading) {
                link.appendChild(page);
            }
            if (snippet.textContent) {
                link.appendChild(snippet);
            }
            item.appendChild(link);
            list.appendChild(item);
        });
        results.appendChild(list);
        if (showResults) {
            results.hidden = false;
            input.setAttribute('aria-expanded', 'true');
        } else {
            hideResults();
        }
        const suffix = total > matches.length
            ? ', 显示前 ' + matches.length + ' 条'
            : '';
        setStatus('找到 ' + total + ' 条结果' + suffix, 'ready');
    }

    function searchNow() {
        window.clearTimeout(searchTimer);
        searchTimer = null;
        const requestId = ++searchRequestId;
        const query = normalize(input.value);
        clearButton.hidden = !query;
        if (!query) {
            hideResults();
            results.textContent = '';
            lastMatches = [];
            lastQuery = '';
            setStatus('输入关键词搜索全部离线文档', 'idle');
            return;
        }
        const terms = query.split(' ').filter(Boolean);
        setStatus('正在搜索...', 'loading');
        loadIndex().then(function () {
            if (
                requestId !== searchRequestId ||
                query !== normalize(input.value)
            ) {
                return;
            }
            const matches = [];
            preparedEntries.forEach(function (entry) {
                const score = scoreEntry(entry, terms);
                if (score >= 0) {
                    matches.push({ entry: entry, score: score });
                }
            });
            matches.sort(function (left, right) {
                return right.score - left.score ||
                    left.entry.heading.localeCompare(right.entry.heading);
            });
            lastMatches = matches.slice(0, maximumResults);
            lastQuery = query;
            renderMatches(
                lastMatches,
                terms,
                matches.length,
                !resultsDismissed && !root.hidden,
            );
        }).catch(function () {
            if (
                requestId !== searchRequestId ||
                query !== normalize(input.value)
            ) {
                return;
            }
            lastMatches = [];
            lastQuery = '';
            hideResults();
            setStatus('搜索索引加载失败, 请重新打开文档后再试', 'error');
        });
    }

    function scheduleSearch() {
        resultsDismissed = false;
        window.clearTimeout(searchTimer);
        searchTimer = window.setTimeout(searchNow, 120);
    }

    input.addEventListener('focus', function () {
        const query = normalize(input.value);
        resultsDismissed = false;
        if (!preparedEntries) {
            loadIndex().then(function () {
                if (
                    !normalize(input.value) &&
                    root.getAttribute('data-state') === 'error'
                ) {
                    setStatus('输入关键词搜索全部离线文档', 'idle');
                }
            }).catch(function () {
                setStatus('搜索索引加载失败, 请重新打开文档后再试', 'error');
            });
        }
        if (
            query &&
            lastQuery === query &&
            ['ready', 'empty'].indexOf(
                root.getAttribute('data-state'),
            ) !== -1
        ) {
            results.hidden = false;
            input.setAttribute('aria-expanded', 'true');
        } else if (query) {
            scheduleSearch();
        }
    });
    input.addEventListener('compositionstart', function () {
        composing = true;
    });
    input.addEventListener('compositionend', function () {
        composing = false;
        scheduleSearch();
    });
    input.addEventListener('input', function () {
        clearButton.hidden = !normalize(input.value);
        if (!composing) {
            scheduleSearch();
        }
    });
    input.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowDown') {
            if (results.hidden) {
                return;
            }
            event.preventDefault();
            updateSelection(selectedIndex + 1);
        } else if (event.key === 'ArrowUp') {
            if (results.hidden) {
                return;
            }
            event.preventDefault();
            updateSelection(selectedIndex < 0 ? -1 : selectedIndex - 1);
        } else if (event.key === 'Enter' && selectedIndex >= 0) {
            const selected = results.querySelector(
                '.offline-search-result-link.selected',
            );
            if (selected) {
                selected.click();
            }
        } else if (event.key === 'Escape') {
            event.preventDefault();
            if (!results.hidden) {
                dismissResults();
            } else {
                closeSearch(true);
            }
        }
    });
    toggleButton.addEventListener('click', function () {
        if (root.hidden) {
            openSearch(false);
        } else {
            closeSearch(true);
        }
    });
    closeButton.addEventListener('click', function () {
        closeSearch(true);
    });
    clearButton.addEventListener('click', function () {
        resultsDismissed = false;
        input.value = '';
        searchNow();
        input.focus();
    });
    document.addEventListener('click', function (event) {
        if (
            !root.contains(event.target) &&
            !toggleButton.contains(event.target)
        ) {
            dismissResults();
        }
    });
    document.addEventListener('keydown', function (event) {
        const target = event.target;
        const editable = target &&
            (target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable);
        const shortcut = event.key === '/' ||
            ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k');
        if (!editable && shortcut) {
            event.preventDefault();
            openSearch(true);
        }
    });

    closeSearch(false);
    clearButton.hidden = !normalize(input.value);
    setStatus('输入关键词搜索全部离线文档', 'idle');
})();
