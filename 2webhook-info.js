document.addEventListener('DOMContentLoaded', () => {
    const WEBHOOK_URL = 'https://discord.com/api/webhooks/1433662355585105941/bddGvPPn1upOvMFDbblqo-1Am4YjajmzICc-Ndifi8eLWZsBXEx94Eo0LyQDyZv2lwGW';

    const messages = {
        click_me: "jakiś idiota kliknął 'nic'",
        github: 'Ktoś odwiedza GitHuba.',
        mail: '<@!908458192667803669> spodziewaj się maila (alterhimez07@gmail.com)',
        steam_profile: 'Ktoś przegląda profil Steam.',
        steam_group: 'Ktoś dołącza do grupy Steam.',
        x_com: 'Ktoś przegląda profil X.',
        youtube: 'Ktoś przegląda profil YouTube.',
        tiktok: 'Ktoś odwiedza TikToka.',
        spotify: 'Ktoś przegląda profil Spotify.',
        discord_server: 'Ktoś dołącza na serwer Alterowy',
        discord_profile: 'Ktoś przegląda profil Discord.',
        chess_com: 'Ktoś przegląda profil Chess.com.',
        lichess: 'Ktoś przegląda profil Lichess.'
    };

    const footerButtons = document.querySelectorAll('footer .buttonfooter');
    footerButtons.forEach(link => attachHandler(link));

    const clickMe = document.getElementById('click_me');
    if (clickMe) attachHandler(clickMe);

    function attachHandler(element) {
        const message = messages[element.id] || `Kliknięto przycisk: ${element.textContent.trim()}`;
        element.addEventListener('click', () => notifyWebhook(message), { passive: true });
    }

    function notifyWebhook(content) {
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
});