// Automatically size iframes to the width of .container-left and adjust height when possible.
// - For same-origin iframes it sets height to content height.
// - For cross-origin iframes it preserves an aspect ratio (data-aspect or 16:9 fallback).

(function () {
    const containerSelector = '.container-left';
    const ASPECT_FALLBACK = 16 / 9;

    function getLeftContainer() {
        return document.querySelector(containerSelector);
    }

    function fitIframeToContainer(iframe, containerWidth) {
        if (!iframe || !containerWidth) return;

        // set width to match container (use style so CSS still applies)
        iframe.style.width = containerWidth + 'px';
        iframe.removeAttribute('width');

        // try to set height from iframe content (may throw for cross-origin)
        try {
            const doc = iframe.contentWindow && iframe.contentWindow.document;
            if (doc) {
                // prefer body.scrollHeight but also consider documentElement
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
            // cross-origin or access denied
        }

        // fallback: use aspect ratio stored on iframe (data-aspect="width/height" or numeric)
        const aspectAttr = iframe.getAttribute('data-aspect');
        let aspect = ASPECT_FALLBACK;
        if (aspectAttr) {
            const n = parseFloat(aspectAttr);
            if (!Number.isNaN(n) && isFinite(n) && n > 0) {
                // if numeric, treat as width/height (e.g. 1.777)
                aspect = n;
            } else if (aspectAttr.includes('/')) {
                const parts = aspectAttr.split('/');
                const a = parseFloat(parts[0]), b = parseFloat(parts[1]);
                if (!Number.isNaN(a) && !Number.isNaN(b) && b !== 0) aspect = a / b;
            }
        }

        iframe.style.height = Math.round(containerWidth / aspect) + 'px';
    }

    function updateAll() {
        const left = getLeftContainer();
        if (!left) return;

        const cw = left.clientWidth;
        const iframes = left.querySelectorAll('iframe');
        iframes.forEach((f) => fitIframeToContainer(f, cw));
    }

    // Re-fit a single iframe after it loads (useful for same-origin content)
    function attachIframeLoadHandler(iframe) {
        if (!iframe) return;
        iframe.addEventListener('load', () => {
            const left = getLeftContainer();
            if (!left) return;
            fitIframeToContainer(iframe, left.clientWidth);
        }, { passive: true });
    }

    function observe() {
        const left = getLeftContainer();
        if (!left) return;

        // initial sizing
        updateAll();

        // ResizeObserver to respond to container size changes
        if (window.ResizeObserver) {
            const ro = new ResizeObserver(updateAll);
            ro.observe(left);
            // also observe window resize as a fallback
            window.addEventListener('resize', updateAll, { passive: true });
        } else {
            window.addEventListener('resize', updateAll, { passive: true });
        }

        // Watch for new iframes added to container
        if (window.MutationObserver) {
            const mo = new MutationObserver((mutations) => {
                let changed = false;
                for (const m of mutations) {
                    if (m.addedNodes && m.addedNodes.length) {
                        m.addedNodes.forEach((n) => {
                            if (n.tagName === 'IFRAME') {
                                attachIframeLoadHandler(n);
                                changed = true;
                            } else if (n.querySelectorAll) {
                                const addedIframes = n.querySelectorAll('iframe');
                                addedIframes.forEach((f) => {
                                    attachIframeLoadHandler(f);
                                    changed = true;
                                });
                            }
                        });
                    }
                }
                if (changed) updateAll();
            });
            mo.observe(left, { childList: true, subtree: true });
        }

        // attach load handlers to existing iframes
        left.querySelectorAll('iframe').forEach(attachIframeLoadHandler);
    }

    // run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observe);
    } else {
        observe();
    }
})();