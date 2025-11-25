const WEBHOOK_URL = 'https://discord.com/api/webhooks/1433662355585105941/bddGvPPn1upOvMFDbblqo-1Am4YjajmzICc-Ndifi8eLWZsBXEx94Eo0LyQDyZv2lwGW';

function sendEssaToWebhook(content) {
    const payload = JSON.stringify({ content });

    if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(WEBHOOK_URL, blob);
        return;
    }

    fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
    }).catch(() => {});
}

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
        const message = `Twoja essa wynosi dziś ${n}%`;
        out.textContent = message;
        sendEssaToWebhook(message);
    });
});