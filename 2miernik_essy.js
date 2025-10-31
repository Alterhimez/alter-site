document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('miernik-essa-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const n = Math.floor(Math.random() * 101); // 0-100
        const outId = 'essa-output';
        let out = document.getElementById(outId);
        if (!out) {
            out = document.createElement('p');
            out.id = outId;
            out.style.marginTop = '10px';
            out.style.fontWeight = '700';
            out.style.color = '#ffffffff';
            btn.parentNode.insertBefore(out, btn.nextSibling);
        }
        out.textContent = `Twoja essa wynosi dziś ${n}%`;
    });
});