document.addEventListener('DOMContentLoaded', () => {
    const WEBHOOK_URL = 'https://discord.com/api/webhooks/1433662355585105941/bddGvPPn1upOvMFDbblqo-1Am4YjajmzICc-Ndifi8eLWZsBXEx94Eo0LyQDyZv2lwGW';

    const messages = {
        click_me: "someone clicked 'nothin''",
        github: 'someone viewed the GitHub profile.',
        mail: '<@!908458192667803669> expect an email (alterhimez07@gmail.com)',
        steam_profile: 'someone viewed the Steam profile.',
        steam_group: 'someone is joining the Steam group.',
        x_com: 'someone viewed the X profile.',
        youtube: 'someone viewed the YouTube profile.',
        tiktok: 'someone viewed the TikTok profile.',
        spotify: 'someone viewed the Spotify profile.',
        discord_server: 'someone is joining Alterowy server.',
        discord_profile: 'someone viewed the Discord profile.',
        chess_com: 'someone viewed the Chess.com profile.',
        lichess: 'someone viewed the Lichess profile.',
        twitch: 'someone viewed the Twitch profile.',
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