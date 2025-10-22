(function(){
    const audio = document.getElementById('bg-audio');
    const btn = document.getElementById('audio-toggle');
    const slider = document.getElementById('volume-slider');
    // restore saved volume or default to 0.5
    const saved = localStorage.getItem('bgAudioVolume');
    audio.volume = saved !== null ? Number(saved) : 0.5;
    slider.value = audio.volume;
    function updateButton() {
        if (audio.paused) {
            btn.textContent = 'Odtwórz muzykę';
        } else {
            btn.textContent = (audio.muted || audio.volume === 0) ? 'Odtwarzanie (wyciszone)' : 'Zatrzymaj muzykę';
        }
    }
    // Try to play immediately; if blocked, leave muted and try again
    audio.play().then(updateButton).catch(() => {
        audio.muted = true;
        audio.play().then(updateButton).catch(updateButton);
    });
    // On first user gesture, unmute if volume > 0
    function onFirstGesture() {
        if (audio.muted && Number(slider.value) > 0) {
            audio.muted = false;
            audio.play().catch(()=>{});
        }
        updateButton();
        window.removeEventListener('click', onFirstGesture);
        window.removeEventListener('keydown', onFirstGesture);
        window.removeEventListener('touchstart', onFirstGesture);
    }
    window.addEventListener('click', onFirstGesture, { once: true });
    window.addEventListener('keydown', onFirstGesture, { once: true });
    window.addEventListener('touchstart', onFirstGesture, { once: true });
    // Toggle play/pause via button
    btn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(() => {});
        } else {
            audio.pause();
        }
        // ensure label updates after the action (play/pause is async)
        setTimeout(updateButton, 0);
    });
    // Volume slider -> audio volume and persist
    slider.addEventListener('input', (e) => {
        const v = Number(e.target.value);
        audio.volume = v;
        localStorage.setItem('bgAudioVolume', String(v));
        if (v === 0) {
            audio.muted = true;
        } else if (audio.muted) {
            // unmute if user raised volume
            audio.muted = false;
        }
        updateButton();
    });
    // init button label
    updateButton();
})();