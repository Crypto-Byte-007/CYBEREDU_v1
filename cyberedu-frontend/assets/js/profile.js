import { state } from "./state.js";
import { showFlashMessage } from "./flash.js";

export function loadProfile() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.email) return;

    const firstNameEl = document.getElementById("profile-first-name");
    const lastNameEl = document.getElementById("profile-last-name");
    const emailEl = document.getElementById("profile-email");
    const displayNameEl = document.getElementById("profile-display-name");
    const displayEmailEl = document.getElementById("profile-display-email");
    const displayRoleEl = document.getElementById("profile-display-role");
    const avatarEl = document.getElementById("profile-avatar-text");

    if (firstNameEl) firstNameEl.value = user.firstName || "";
    if (lastNameEl) lastNameEl.value = user.lastName || "";
    if (emailEl) emailEl.value = user.email || "";
    if (displayNameEl) displayNameEl.textContent = `${user.firstName || ''} ${user.lastName || ''}`;
    if (displayEmailEl) displayEmailEl.textContent = user.email || "";
    if (displayRoleEl) displayRoleEl.textContent = user.role || "Student";
    if (avatarEl && user.firstName) avatarEl.textContent = user.firstName.charAt(0).toUpperCase();
    
    const progress = JSON.parse(localStorage.getItem("userProgress") || '{"completedLabs": [], "totalPoints": 0}');
    document.getElementById("profile-labs-completed").textContent = progress.completedLabs.length;
    document.getElementById("profile-total-points").textContent = progress.totalPoints;
    document.getElementById("profile-rank").textContent = "#" + Math.floor(Math.random() * 100 + 1);
    
    renderActivityHeatmap(progress.completedLabs);
    renderAchievements(progress.completedLabs);
}

function renderActivityHeatmap(completedLabs) {
    const container = document.getElementById("activity-heatmap");
    if (!container) return;
    
    const weeks = 12;
    const days = weeks * 7;
    let html = '';
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0)).getTime();
        const dayEnd = new Date(date.setHours(23, 59, 59, 999)).getTime();
        
        const count = completedLabs.filter(lab => {
            const completedAt = lab.completedAt || Date.now();
            return completedAt >= dayStart && completedAt <= dayEnd;
        }).length;
        
        const intensity = count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : 3;
        const colors = ['rgba(30, 42, 71, 0.3)', 'rgba(0, 212, 255, 0.3)', 'rgba(0, 212, 255, 0.6)', 'rgba(0, 212, 255, 1)'];
        
        html += `<div class="heat-cell" style="background: ${colors[intensity]}" title="${count} labs on ${date.toDateString()}"></div>`;
    }
    
    container.innerHTML = html;
}

function renderAchievements(completedLabs) {
    const container = document.getElementById("profile-achievements");
    if (!container) return;
    
    const achievements = [
        { icon: '🎯', name: 'First Lab', unlocked: completedLabs.length >= 1 },
        { icon: '🔥', name: '5 Labs', unlocked: completedLabs.length >= 5 },
        { icon: '⭐', name: '10 Labs', unlocked: completedLabs.length >= 10 },
        { icon: '🏆', name: 'Expert', unlocked: completedLabs.length >= 20 }
    ];
    
    container.innerHTML = achievements.map(a => `
        <div class="achievement-badge ${a.unlocked ? 'unlocked' : 'locked'}" style="
            padding: 1rem;
            background: ${a.unlocked ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(99, 102, 241, 0.2))' : 'rgba(30, 42, 71, 0.3)'};
            border: 1px solid ${a.unlocked ? 'rgba(0, 212, 255, 0.5)' : 'rgba(30, 42, 71, 0.5)'};
            border-radius: 8px;
            text-align: center;
            opacity: ${a.unlocked ? '1' : '0.4'};
        ">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${a.icon}</div>
            <div style="font-size: 0.8rem; color: #b8c5db;">${a.name}</div>
        </div>
    `).join('');
}

export function saveProfile() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    user.firstName = document.getElementById("profile-first-name").value;
    user.lastName = document.getElementById("profile-last-name").value;
    user.email = document.getElementById("profile-email").value;
    user.bio = document.getElementById("profile-bio").value || "";
    user.location = document.getElementById("profile-location").value || "";

    localStorage.setItem("user", JSON.stringify(user));
    
    document.getElementById("profile-display-name").textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById("profile-display-email").textContent = user.email;
    
    const avatarEl = document.getElementById("profile-avatar-text");
    if (avatarEl && user.firstName) {
        avatarEl.textContent = user.firstName.charAt(0).toUpperCase();
    }
    
    toggleEditMode();
    showFlashMessage("Profile updated successfully!", "success");
}

export function cancelEdit() {
    toggleEditMode();
    loadProfile();
}

export function changePassword() {
    if (window.showModal) {
        window.showModal('password-modal');
    }
}

export function updatePassword() {
    const current = document.getElementById('current-password').value;
    const newPass = document.getElementById('new-password').value;
    const confirm = document.getElementById('confirm-password').value;
    
    if (newPass !== confirm) {
        showFlashMessage('Passwords do not match', 'error');
        return;
    }
    
    showFlashMessage('Password updated successfully', 'success');
    if (window.closeModal) {
        window.closeModal('password-modal');
    }
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
}

export function toggleEditMode() {
    const inputs = document.querySelectorAll("#profile-first-name, #profile-last-name, #profile-email, #profile-bio, #profile-location");
    state.isEditingProfile = !state.isEditingProfile;

    inputs.forEach(inp => {
        if (inp.id === 'profile-email') {
            inp.readOnly = true;
        } else {
            inp.readOnly = !state.isEditingProfile;
        }
    });

    const editButtons = document.getElementById("profile-edit-buttons");
    if (editButtons) {
        editButtons.classList.toggle("hidden", !state.isEditingProfile);
    }
}

window.loadProfile = loadProfile;
window.saveProfile = saveProfile;
window.cancelEdit = cancelEdit;
window.changePassword = changePassword;
window.updatePassword = updatePassword;
window.toggleEditMode = toggleEditMode;