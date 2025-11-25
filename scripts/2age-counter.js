(() => {
    const BIRTH = new Date(2007, 5, 30, 21, 3, 0);
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;

    document.addEventListener('DOMContentLoaded', () => {
        const target = document.getElementById('age-counter');
        if (!target) return;

        const update = () => {
            const now = new Date();
            let years = now.getFullYear() - BIRTH.getFullYear();

            const birthdayThisYear = new Date(BIRTH);
            birthdayThisYear.setFullYear(now.getFullYear());

            if (now < birthdayThisYear) {
                years--;
                birthdayThisYear.setFullYear(now.getFullYear() - 1);
            }

            const sinceLastBirthday = now - birthdayThisYear;
            const days = Math.floor(sinceLastBirthday / DAY);
            const hours = Math.floor((sinceLastBirthday % DAY) / HOUR);
            const minutes = Math.floor((sinceLastBirthday % HOUR) / MINUTE);
            const seconds = Math.floor((sinceLastBirthday % MINUTE) / SECOND);

            target.textContent = [
                `Mam ${years} lat`,
                `${days} dni`,
                `${hours.toString().padStart(2, '0')} godzin`,
                `${minutes.toString().padStart(2, '0')}m`,
                `${seconds.toString().padStart(2, '0')}s`
            ].join(', ');
        };

        update();
        setInterval(update, 1000);
    });
})();