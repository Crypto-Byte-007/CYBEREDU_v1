import { showFlashMessage } from "./flash.js";

export function loadReports() {
    const progress = JSON.parse(localStorage.getItem('userProgress') || '{"completedLabs": [], "totalPoints": 0}');
    
    renderPerformanceChart(progress.completedLabs);
    renderSkillsChart(progress.completedLabs);
    renderReportsTable(progress.completedLabs);
}

function renderPerformanceChart(completedLabs) {
    const canvas = document.getElementById('performance-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    if (completedLabs.length === 0) {
        ctx.fillStyle = '#6c757d';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Complete labs to see your performance', width/2, height/2);
        return;
    }
    
    // Draw bars
    const barWidth = width / completedLabs.length - 10;
    const maxScore = 100;
    
    completedLabs.forEach((lab, i) => {
        const score = lab.score || 100;
        const barHeight = (score / maxScore) * (height - 40);
        const x = i * (barWidth + 10) + 5;
        const y = height - barHeight - 20;
        
        ctx.fillStyle = score >= 80 ? '#28a745' : score >= 60 ? '#ffc107' : '#dc3545';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        ctx.fillStyle = '#2c3e50';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(score + '%', x + barWidth/2, y - 5);
    });
}

function renderSkillsChart(completedLabs) {
    const canvas = document.getElementById('skills-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;
    
    ctx.clearRect(0, 0, width, height);
    
    if (completedLabs.length === 0) {
        ctx.fillStyle = '#b8c5db';
        ctx.font = '14px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText('Complete labs to see skill breakdown', centerX, centerY);
        return;
    }
    
    const skills = {
        'Phishing': 0,
        'Email': 0,
        'Password': 0,
        'Social': 0,
        'Device': 0
    };
    
    completedLabs.forEach(lab => {
        if (lab.labId.startsWith('S001') || lab.labId.startsWith('S002')) skills['Phishing']++;
        else if (lab.labId.startsWith('S003')) skills['Password']++;
        else if (lab.labId.startsWith('S004')) skills['Social']++;
        else skills['Device']++;
    });
    
    const maxSkill = Math.max(...Object.values(skills), 5);
    const angleStep = (Math.PI * 2) / Object.keys(skills).length;
    
    // Draw background grid
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        const r = (i / 5) * radius;
        Object.keys(skills).forEach((_, idx) => {
            const angle = idx * angleStep - Math.PI / 2;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.stroke();
    }
    
    // Draw data
    ctx.strokeStyle = '#00d4ff';
    ctx.fillStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    Object.values(skills).forEach((value, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const r = (value / maxSkill) * radius;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Segoe UI';
    Object.entries(skills).forEach(([skill, value], i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + (radius + 25) * Math.cos(angle);
        const y = centerY + (radius + 25) * Math.sin(angle);
        ctx.textAlign = 'center';
        ctx.fillText(skill, x, y);
        ctx.fillStyle = '#00ff88';
        ctx.font = '10px Segoe UI';
        ctx.fillText(`(${value})`, x, y + 12);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Segoe UI';
    });
}

function renderReportsTable(completedLabs) {
    const tbody = document.getElementById('reports-table');
    if (!tbody) return;

    tbody.textContent = "";

    if (completedLabs.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 6;
        cell.textContent = "No completed labs yet.";
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    completedLabs.forEach(lab => {
        const row = document.createElement("tr");

        const title = document.createElement("td");
        title.textContent = lab.title || "Lab";

        const date = document.createElement("td");
        date.textContent = formatDate(lab.completedAt);

        const score = document.createElement("td");
        score.textContent = `${lab.score || 100}%`;

        const time = document.createElement("td");
        time.textContent = `${Math.floor(Math.random()*30+15)} min`;

        const status = document.createElement("td");
        status.textContent = "Completed";

        const action = document.createElement("td");
        const btn = document.createElement("button");
        btn.textContent = "View";
        btn.onclick = () => viewLabDetails(lab.labId);
        action.appendChild(btn);

        row.append(title, date, score, time, status, action);
        tbody.appendChild(row);
    });
}

function formatDate(timestamp) {
    if (!timestamp) return 'Recently';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getScoreClass(score) {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    return 'needs-improvement';
}

window.viewLabDetails = function(labId) {
    const progress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    const lab = progress.completedLabs?.find(l => l.labId === labId);
    if (!lab) return;

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.style.display = "flex";

    const content = document.createElement("div");
    content.className = "modal-content";

    const title = document.createElement("h3");
    title.textContent = lab.title || "Lab Details";

    const score = document.createElement("p");
    score.textContent = `Score: ${lab.score || 100}%`;

    content.append(title, score);
    modal.appendChild(content);
    document.body.appendChild(modal);
};


window.generateReport = function() {
    const progress = JSON.parse(localStorage.getItem('userProgress') || '{"completedLabs": [], "totalPoints": 0}');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    showFlashMessage('Generating PDF report...', 'info');
    
    setTimeout(() => {
        const reportContent = `
CYBEREDU PROGRESS REPORT
========================

Student: ${user.firstName} ${user.lastName}
Email: ${user.email}
Date: ${new Date().toLocaleDateString()}

SUMMARY
-------
Labs Completed: ${progress.completedLabs.length}
Total Points: ${progress.totalPoints}
Average Score: ${progress.completedLabs.length > 0 ? Math.round(progress.completedLabs.reduce((sum, lab) => sum + (lab.score || 0), 0) / progress.completedLabs.length) : 0}%

COMPLETED LABS
--------------
${progress.completedLabs.map((lab, i) => `${i+1}. ${lab.title} - Score: ${lab.score || 100}% - ${formatDate(lab.completedAt)}`).join('\n')}

---
Generated by CyberEdu Platform
        `;
        
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CyberEdu_Report_${user.firstName}_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        showFlashMessage('Report downloaded successfully!', 'success');
    }, 1000);
};

window.loadReports = loadReports;

export default { loadReports };
