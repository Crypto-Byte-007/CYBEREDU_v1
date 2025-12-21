// Achievement Badge System
function unlockBadge(name, description = '') {
    // Store badge in user progress
    const badges = JSON.parse(localStorage.getItem('user_badges') || '[]');
    if (!badges.includes(name)) {
        badges.push(name);
        localStorage.setItem('user_badges', JSON.stringify(badges));
    }

    // Show badge popup
    showBadgePopup(name, description);
    
    // Update badge display
    updateBadgeDisplay();
}

function showBadgePopup(name, description) {
    const popup = document.createElement('div');
    popup.className = 'badge-popup';
    popup.innerHTML = `
        <div class="badge-content">
            <div class="badge-icon">🏆</div>
            <h3>Badge Unlocked!</h3>
            <h4>${name}</h4>
            <p>${description}</p>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => popup.classList.add('show'), 100);
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }, 3000);
}

function updateBadgeDisplay() {
    const badges = JSON.parse(localStorage.getItem('user_badges') || '[]');
    const container = document.getElementById('user-badges');
    
    if (container) {
        container.innerHTML = badges.map(badge => 
            `<span class="badge">${badge}</span>`
        ).join('');
    }
}

// Predefined badges
const BADGES = {
    'First Lab': 'Complete your first cybersecurity lab',
    'Speed Runner': 'Complete a lab in under 30 minutes',
    'Perfect Score': 'Score 100% on a lab assessment',
    'Streak Master': 'Complete labs for 7 consecutive days',
    'Helper': 'Use hints wisely to solve problems',
    'Explorer': 'Try all available labs'
};

function checkBadgeConditions(event, data) {
    switch (event) {
        case 'lab_completed':
            if (data.isFirst) unlockBadge('First Lab', BADGES['First Lab']);
            if (data.score === 100) unlockBadge('Perfect Score', BADGES['Perfect Score']);
            if (data.timeMinutes < 30) unlockBadge('Speed Runner', BADGES['Speed Runner']);
            break;
        case 'hint_used':
            unlockBadge('Helper', BADGES['Helper']);
            break;
    }
}