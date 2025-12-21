// Stub functions for features not yet implemented
// This prevents console errors from onclick handlers

window.toggleNotifications = function() {
    console.log('Notifications feature coming soon');
};

window.toggleUserMenu = function() {
    console.log('User menu feature coming soon');
};

window.markAllRead = function() {
    console.log('Mark all read feature coming soon');
};

window.filterByCategory = function(category) {
    document.querySelectorAll('.category-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const categoryMap = {
        'phishing': 'phishing_basics',
        'email': 'email_security',
        'password': 'account_security',
        'social': 'social_media_safety',
        'device': 'device_security',
        'scam': 'scam_detection',
        'malware': 'malware_awareness',
        'wellbeing': 'digital_wellbeing',
        'mobile': 'mobile_security',
        'gaming': 'gaming_security'
    };
    
    const allCards = document.querySelectorAll('.lab-card');
    allCards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
        } else {
            const cardCategory = card.getAttribute('data-category');
            const mappedCategory = categoryMap[category] || category;
            card.style.display = cardCategory === mappedCategory ? 'block' : 'none';
        }
    });
};

window.filterLabs = function(difficulty) {
    console.log('Filter labs:', difficulty);
};

window.getHint = function() {
    console.log('Hint feature coming soon');
};

window.openResource = function(resource) {
    console.log('Open resource:', resource);
};

window.generateReport = function() {
    console.log('Generate report feature coming soon');
};

window.toggleEditMode = async function() {
    const inputs = document.querySelectorAll("#profile-page input:not([type='checkbox']), #profile-page textarea");
    const editBtn = document.getElementById("edit-profile-btn");
    const editButtons = document.getElementById("profile-edit-buttons");
    
    const isReadOnly = inputs[0]?.readOnly;
    
    inputs.forEach(inp => inp.readOnly = !isReadOnly);
    
    if (editButtons) {
        editButtons.classList.toggle("hidden", isReadOnly);
    }
    
    if (editBtn) {
        editBtn.innerHTML = isReadOnly ? '<i class="fas fa-times"></i> Cancel' : '<i class="fas fa-edit"></i> Edit';
    }
};

window.saveProfile = function() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    user.firstName = document.getElementById("profile-first-name")?.value || user.firstName;
    user.lastName = document.getElementById("profile-last-name")?.value || user.lastName;
    localStorage.setItem("user", JSON.stringify(user));
    
    if (window.showFlashMessage) {
        window.showFlashMessage("Profile updated!", "success");
    }
    window.toggleEditMode();
};

window.cancelEdit = function() {
    if (window.loadProfile) window.loadProfile();
    window.toggleEditMode();
};

window.changePassword = function() {
    const modal = document.getElementById('password-modal');
    if (modal) modal.classList.remove('hidden');
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
};

window.updatePassword = function() {
    const newPass = document.getElementById('new-password')?.value;
    const confirmPass = document.getElementById('confirm-password')?.value;
    
    if (newPass !== confirmPass) {
        if (window.showFlashMessage) window.showFlashMessage('Passwords do not match', 'error');
        return;
    }
    
    if (window.showFlashMessage) window.showFlashMessage('Password update coming soon', 'info');
    closeModal('password-modal');
};
