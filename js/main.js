document.addEventListener('DOMContentLoaded', () => {
    // Check local storage for progression
    // Level 1: Quiz (Always unlocked)
    // Level 2: Memory Matrix
    // Level 3: Math Sprint
    let unlockedLevel = localStorage.getItem('unlockedLevel');
    
    // If no progress found, initialize to 1
    if (!unlockedLevel) {
        unlockedLevel = 1;
        localStorage.setItem('unlockedLevel', unlockedLevel);
    } else {
        unlockedLevel = parseInt(unlockedLevel);
    }

    const cardMemory = document.getElementById('card-memory');
    const badgeMemory = document.getElementById('badge-memory');
    const cardMath = document.getElementById('card-math');
    const badgeMath = document.getElementById('badge-math');

    // Handle clicks on locked cards
    const handleLockedClick = (e) => {
        e.preventDefault();
        alert('Please complete the previous game to unlock this challenge!');
    };

    // Unlock logic
    if (unlockedLevel >= 2) {
        cardMemory.classList.remove('locked');
        badgeMemory.className = 'play-badge';
        badgeMemory.textContent = 'Play Now';
    } else {
        cardMemory.addEventListener('click', handleLockedClick);
    }

    if (unlockedLevel >= 3) {
        cardMath.classList.remove('locked');
        badgeMath.className = 'play-badge';
        badgeMath.textContent = 'Play Now';
    } else {
        cardMath.addEventListener('click', handleLockedClick);
    }
});
