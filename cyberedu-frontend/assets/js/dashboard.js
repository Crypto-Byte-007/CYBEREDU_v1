import { state } from "./state.js";
import api from "./api.js";

export async function loadDashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = user.firstName || "User";
    
    const nameEl = document.getElementById("dashboard-user-name");
    if (nameEl) nameEl.textContent = userName;

    const navbarEl = document.getElementById("main-navbar");
    if (navbarEl) navbarEl.classList.remove("hidden");

    const initialsEl = document.getElementById("user-initials");
    if (initialsEl && user.firstName) {
        initialsEl.textContent = user.firstName.charAt(0).toUpperCase();
    }

    // Load user progress from localStorage
    const progress = JSON.parse(localStorage.getItem("userProgress") || '{"completedLabs": [], "totalPoints": 0, "totalTime": 0}');
    
    // Update stats
    document.getElementById("completed-labs").textContent = progress.completedLabs.length;
    document.getElementById("total-points").textContent = progress.totalPoints;
    document.getElementById("study-time").textContent = Math.floor(progress.totalTime / 60) + "h";
    
    const avgScore = progress.completedLabs.length > 0 
        ? Math.round(progress.completedLabs.reduce((sum, lab) => sum + (lab.score || 0), 0) / progress.completedLabs.length)
        : 0;
    document.getElementById("avg-score").textContent = avgScore + "%";

    try {
        const labsData = await api.get("/labs");
        state.labs = labsData.data || labsData || [];
        renderRecentLabs(progress.completedLabs);
        renderActivityFeed(progress.completedLabs);
        renderProgressChart(progress.completedLabs);
    } catch (err) {
        console.log("Labs not loaded yet");
    }
}

function renderRecentLabs(completedLabs) {
    const container = document.getElementById("recent-labs");
    if (!container) return;

    if (state.labs.length === 0) {
        container.innerHTML = '<p>No labs available yet. Check back soon!</p>';
        return;
    }

    const completedIds = completedLabs.map(l => l.labId);
    const inProgressLabs = state.labs.filter(lab => !completedIds.includes(lab.labId)).slice(0, 3);
    
    if (inProgressLabs.length === 0) {
        container.innerHTML = '<p>🎉 All labs completed! Great job!</p>';
        return;
    }

    container.innerHTML = inProgressLabs.map(lab => `
        <div class="lab-card">
            <div class="lab-card-header">
                <h4>${lab.title || 'Lab'}</h4>
                <span class="lab-difficulty ${lab.difficulty}">${lab.difficulty}</span>
            </div>
            <p>${(lab.description || 'Practice lab').substring(0, 80)}...</p>
            <div class="lab-card-footer">
                <span class="lab-points">🏆 ${lab.points || 100} pts</span>
                <button onclick="startLab('${lab.labId}')" class="btn btn-primary">Start</button>
            </div>
        </div>
    `).join("");
}

function renderActivityFeed(completedLabs) {
    const container = document.getElementById("activity-feed");
    if (!container) return;

    if (completedLabs.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No activity yet. Start a lab to see your progress!</p>';
        return;
    }

    const recentActivity = completedLabs.slice(-5).reverse();
    container.innerHTML = recentActivity.map(lab => `
        <div class="activity-item">
            <div class="activity-icon">✓</div>
            <div class="activity-content">
                <p><strong>Completed:</strong> ${lab.title}</p>
                <p class="activity-time">${formatTimeAgo(lab.completedAt)}</p>
            </div>
        </div>
    `).join("");
}

function formatTimeAgo(timestamp) {
    if (!timestamp) return 'Recently';
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

function renderProgressChart(completedLabs) {
    const canvas = document.getElementById("progress-chart");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (completedLabs.length === 0) {
        ctx.fillStyle = "#666";
        ctx.font = "14px 'Segoe UI'";
        ctx.textAlign = "center";
        ctx.fillText("Complete labs to see your progress", width / 2, height / 2);
        return;
    }
    
    // Get last 7 days of activity
    const days = [];
    const counts = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        days.push(dayName);
        
        const dayStart = new Date(date.setHours(0, 0, 0, 0)).getTime();
        const dayEnd = new Date(date.setHours(23, 59, 59, 999)).getTime();
        const count = completedLabs.filter(lab => {
            const completedAt = lab.completedAt || Date.now();
            return completedAt >= dayStart && completedAt <= dayEnd;
        }).length;
        counts.push(count);
    }
    
    const maxCount = Math.max(...counts, 1);
    const barWidth = 40;
    const spacing = 15;
    const startX = (width - (barWidth * 7 + spacing * 6)) / 2;
    const chartHeight = height - 60;
    
    // Draw bars
    counts.forEach((count, i) => {
        const barHeight = (count / maxCount) * chartHeight;
        const x = startX + i * (barWidth + spacing);
        const y = height - 40 - barHeight;
        
        // Bar gradient
        const gradient = ctx.createLinearGradient(x, y, x, height - 40);
        gradient.addColorStop(0, "#00d4ff");
        gradient.addColorStop(1, "#0066ff");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Count label
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px 'Segoe UI'";
        ctx.textAlign = "center";
        ctx.fillText(count, x + barWidth / 2, y - 5);
        
        // Day label
        ctx.fillStyle = "#999";
        ctx.font = "12px 'Segoe UI'";
        ctx.fillText(days[i], x + barWidth / 2, height - 20);
    });
    
    // Title
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px 'Segoe UI'";
    ctx.textAlign = "left";
    ctx.fillText("Labs Completed (Last 7 Days)", 10, 20);
}

window.loadDashboard = loadDashboard;