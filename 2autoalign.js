// Auto-align iframes to the actual width of the left column containers.
// Supports multiple possible container class names used in your HTML.
// - Uses ResizeObserver when available.
// - For same-origin iframes tries to read content height, otherwise uses data-aspect or 16:9 fallback.

(function () {
    const CONTAINER_SELECTORS = [
        '.x1stcont2',   // your left column in index.html
        '.container-left',
        '.x1stcont'
    ].join(','); // will pick any that exist

    const ASPECT_FALLBACK = 16 / 9;

    function getContainers() {
        return Array.from(document.querySelectorAll(CONTAINER_SELECTORS));
    }

    function parseAspect(aspectAttr) {
        if (!aspectAttr) return ASPECT_FALLBACK;
        const n = parseFloat(aspectAttr);
        if (!Number.isNaN(n) && isFinite(n) && n > 0) return n;
        if (aspectAttr.includes('/')) {
            const [a, b] = aspectAttr.split('/').map(Number);
            if (!Number.isNaN(a) && !Number.isNaN(b) && b !== 0) return a / b;
        }
        return ASPECT_FALLBACK;
    }

    function fitIframeToContainer(iframe, container) {
        if (!iframe || !container) return;
        // make iframe fill container width (responsive)
        iframe.style.width = '100%';
        iframe.style.maxWidth = '100%';
        iframe.removeAttribute('width');

        const containerWidth = container.clientWidth;
        // try same-origin height measurement
        try {
            const doc = iframe.contentWindow && iframe.contentWindow.document;
            if (doc) {
                const h = Math.max(
                    doc.body ? doc.body.scrollHeight : 0,
                    doc.documentElement ? doc.documentElement.scrollHeight : 0
                );
                if (h && h > 0) {
                    iframe.style.height = h + 'px';
                    iframe.removeAttribute('height');
                    return;
                }
            }
        } catch (err) {
            // cross-origin: fallback to aspect ratio
        }

        const aspect = parseAspect(iframe.getAttribute('data-aspect'));
        iframe.style.height = Math.round(containerWidth / aspect) + 'px';
    }

    function updateContainer(container) {
        const iframes = container.querySelectorAll('iframe');
        iframes.forEach((f) => fitIframeToContainer(f, container));
    }

    function attachIframeHandlers(container) {
        // update when iframe loads (useful for same-origin)
        container.querySelectorAll('iframe').forEach((iframe) => {
            iframe.addEventListener('load', () => fitIframeToContainer(iframe, container), { passive: true });
        });
    }

    function observeContainer(container) {
        updateContainer(container);
        attachIframeHandlers(container);

        if (window.ResizeObserver) {
            const ro = new ResizeObserver(() => updateContainer(container));
            ro.observe(container);
            // keep reference on element so GC won't drop it if needed later
            container.__autoalign_ro = ro;
        } else {
            window.addEventListener('resize', () => updateContainer(container), { passive: true });
        }

        if (window.MutationObserver) {
            const mo = new MutationObserver((mutations) => {
                let needsUpdate = false;
                for (const m of mutations) {
                    if (m.addedNodes && m.addedNodes.length) {
                        m.addedNodes.forEach((n) => {
                            if (n.tagName === 'IFRAME') {
                                n.addEventListener('load', () => fitIframeToContainer(n, container), { passive: true });
                                needsUpdate = true;
                            } else if (n.querySelectorAll) {
                                const added = n.querySelectorAll('iframe');
                                if (added.length) {
                                    added.forEach((a) => a.addEventListener('load', () => fitIframeToContainer(a, container), { passive: true }));
                                    needsUpdate = true;
                                }
                            }
                        });
                    }
                }
                if (needsUpdate) updateContainer(container);
            });
            mo.observe(container, { childList: true, subtree: true });
            container.__autoalign_mo = mo;
        }
    }

    function init() {
        const containers = getContainers();
        if (!containers.length) return;
        containers.forEach(observeContainer);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();