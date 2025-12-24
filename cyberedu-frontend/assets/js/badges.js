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
    
    const content = document.createElement('div');
    content.className = 'badge-content';
    
    const icon = document.createElement('div');
    icon.className = 'badge-icon';
    icon.textContent = '🏆';
    
    const title = document.createElement('h3');
    title.textContent = 'Badge Unlocked!';
    
    const badgeName = document.createElement('h4');
    badgeName.textContent = name;
    
    const desc = document.createElement('p');
    desc.textContent = description;
    
    content.appendChild(icon);
    content.appendChild(title);
    content.appendChild(badgeName);
    content.appendChild(desc);
    popup.appendChild(content);
    
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
        container.innerHTML = '';
        badges.forEach(badge => {
            const span = document.createElement('span');
            span.className = 'badge';
            span.textContent = badge;
            container.appendChild(span);
        });
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

// Badge condition handlers
const BADGE_HANDLERS = {
    'lab_completed': (data) => {
        if (data.isFirst) unlockBadge('First Lab', BADGES['First Lab']);
        if (data.score === 100) unlockBadge('Perfect Score', BADGES['Perfect Score']);
        if (data.timeMinutes < 30) unlockBadge('Speed Runner', BADGES['Speed Runner']);
    },
    'hint_used': () => {
        unlockBadge('Helper', BADGES['Helper']);
    }
};

function checkBadgeConditions(event, data) {
    const handler = BADGE_HANDLERS[event];
    if (handler) {
        handler(data);
    }
}