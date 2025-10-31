(() => {
	const WEBHOOK_URL = 'https://discord.com/api/webhooks/1433662355585105941/bddGvPPn1upOvMFDbblqo-1Am4YjajmzICc-Ndifi8eLWZsBXEx94Eo0LyQDyZv2lwGW';

	function splitMessage(text, limit) {
		const chunks = [];
		let remaining = text;
		while (remaining.length > limit) {
			chunks.push(remaining.slice(0, limit));
			remaining = remaining.slice(limit);
		}
		if (remaining) chunks.push(remaining);
		return chunks;
	}

	document.addEventListener('DOMContentLoaded', () => {
		const form = document.getElementById('contact-form');
		if (!form) return;

		const mailInput = document.getElementById('contact-mail');
		const nickInput = document.getElementById('contact-nick');
		const messageInput = document.getElementById('contact-message');
		const consentInput = document.getElementById('contact-consent');
		const statusEl = document.getElementById('contact-status');
		const submitBtn = document.getElementById('contact-submit');

		function setStatus(message, type) {
			if (!statusEl) return;
			statusEl.textContent = message;
			statusEl.classList.remove('success', 'error');
			if (type) statusEl.classList.add(type);
		}

		form.addEventListener('submit', async (event) => {
			event.preventDefault();

			const mail = mailInput ? mailInput.value.trim() : '';
			const nick = nickInput ? nickInput.value.trim() : '';
			const message = messageInput ? messageInput.value.trim() : '';
			const consent = consentInput ? consentInput.checked : false;

			if (!mail) {
				setStatus('Mail is required.', 'error');
				return;
			}

			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
				setStatus('Mail looks invalid.', 'error');
				return;
			}

			if (!message) {
				setStatus('Message cannot be empty.', 'error');
				return;
			}

			setStatus('Sending message…');
			if (submitBtn) submitBtn.disabled = true;

			const embeds = [{
				title: 'Contact form message',
				color: 0x8b5cf6,
				fields: [
					{ name: 'Mail', value: mail, inline: true },
					{ name: 'Nick', value: nick || 'not provided', inline: true },
					{ name: 'If checked - robot', value: consent ? 'Yes' : 'No', inline: true },
					{ name: 'Page', value: window.location.href }
				],
				timestamp: new Date().toISOString()
			}];

			const messageChunks = splitMessage(message, 1024);
			messageChunks.slice(0, 4).forEach((chunk, index) => {
				embeds.push({
					color: 0x4c1d95,
					title: index === 0 ? 'Message content' : `Message cont. (${index + 1})`,
					description: chunk
				});
			});

			if (messageChunks.length > 4) {
				embeds.push({
					color: 0xb91c1c,
					title: 'Message truncated',
					description: 'Message was longer than 4096 characters and was truncated.'
				});
			}

			try {
				const response = await fetch(WEBHOOK_URL, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						content: 'New contact message received.',
						embeds
					})
				});

				if (!response.ok) throw new Error(`Webhook error: ${response.status}`);

				setStatus('Thanks! Message sent.', 'success');
				form.reset();
			} catch (err) {
				console.error('Failed to send contact message:', err);
				setStatus('Could not send message. Try again later.', 'error');
			} finally {
				if (submitBtn) submitBtn.disabled = false;
			}
		});
	});
})();
