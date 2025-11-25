(function () {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent || '');
    const DISMISS_KEY = 'orientationWarningDismissed';

    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'orientation-overlay';
        overlay.innerHTML = `
            <div class="orientation-message">
                <p class="orientation-text">This site is best used in horizontal (landscape) mode or on a computer</p>
                <div class="orientation-actions">
                    <button id="orientation-close" class="button1">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('orientation-close').addEventListener('click', () => {
            sessionStorage.setItem(DISMISS_KEY, '1');
            hideOverlay();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                sessionStorage.setItem(DISMISS_KEY, '1');
                hideOverlay();
            }
        });

        return overlay;
    }

    function showOverlay() {
        const overlay = document.getElementById('orientation-overlay') || createOverlay();
        overlay.style.display = 'flex';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }

    function hideOverlay() {
        const overlay = document.getElementById('orientation-overlay');
        if (overlay) overlay.style.display = 'none';
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    }

    function isLandscape() {
        if (window.matchMedia) {
            return window.matchMedia('(orientation: landscape)').matches || window.innerWidth > window.innerHeight;
        }
        return window.innerWidth > window.innerHeight;
    }

    // reversed: show when device is PORTRAIT (vertical)
    function shouldShow() {
        if (!isMobile) return false;
        if (sessionStorage.getItem(DISMISS_KEY) === '1') return false;
        return !isLandscape(); // show overlay when portrait (height > width)
    }

    function update() {
        if (shouldShow()) showOverlay();
        else hideOverlay();
    }

    window.addEventListener('resize', update, { passive: true });
    window.addEventListener('orientationchange', update, { passive: true });
    document.addEventListener('DOMContentLoaded', update);
    update();
})();