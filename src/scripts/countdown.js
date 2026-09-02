// src/scripts/countdown.js

const targetMonth = (new Date()).getMonth(); // Set to current month for D-Day preview
const targetDate = (new Date()).getDate();   // Set to current date for D-Day preview

function getNextBirthdayDate() {
    const now = new Date();
    // Use current year
    let year = now.getFullYear();
    
    let birthday = new Date(year, targetMonth, targetDate, 0, 0, 0, 0);
    
    // If we've already passed the birthday this year, use next year's
    // (We also check if today is exactly the birthday)
    if (now > birthday && now.getDate() !== targetDate && now.getMonth() !== targetMonth) {
        birthday = new Date(year + 1, targetMonth, targetDate, 0, 0, 0, 0);
    }
    return birthday;
}

function initCountdown() {
    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMinutes = document.getElementById('cd-minutes');
    const cdSeconds = document.getElementById('cd-seconds');
    const blowIndicator = document.getElementById('blow-indicator');
    const countdownContainer = document.getElementById('countdown-container');

    const updateCountdown = () => {
        const now = new Date();
        const target = getNextBirthdayDate();
        const diff = target - now;

        // Is it the birthday right now? (same month and date)
        if (now.getMonth() === targetMonth && now.getDate() === targetDate) {
            // It's the birthday!
            if (countdownContainer) countdownContainer.classList.add('hidden');
            if (blowIndicator) blowIndicator.classList.remove('hidden');
            return true; // Reached target
        }

        if (diff <= 0) {
            // Reached target logic (safety fallback)
            if (countdownContainer) countdownContainer.classList.add('hidden');
            if (blowIndicator) blowIndicator.classList.remove('hidden');
            return true;
        }

        // Calculate time
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (cdDays) cdDays.innerText = days.toString().padStart(2, '0');
        if (cdHours) cdHours.innerText = hours.toString().padStart(2, '0');
        if (cdMinutes) cdMinutes.innerText = minutes.toString().padStart(2, '0');
        if (cdSeconds) cdSeconds.innerText = seconds.toString().padStart(2, '0');

        return false; // Not reached yet
    };

    // Initial call
    const isBirthday = updateCountdown();

    if (!isBirthday) {
        // Only set interval if it's not birthday yet
        setInterval(updateCountdown, 1000);
    }
}

document.addEventListener('DOMContentLoaded', initCountdown);
