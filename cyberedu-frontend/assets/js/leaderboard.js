export function loadLeaderboard() {
    const progress = JSON.parse(localStorage.getItem("userProgress") || '{"completedLabs": [], "totalPoints": 0}');
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    const mockData = [
        { name: "Alex Johnson", points: 2890, labs: 15, avgScore: 95, streak: 7 },
        { name: "Jane Smith", points: 2450, labs: 12, avgScore: 92, streak: 5 },
        { name: "Mike Brown", points: 2120, labs: 10, avgScore: 88, streak: 3 },
        { name: `${user.firstName || 'You'} ${user.lastName || ''}`, points: progress.totalPoints, labs: progress.completedLabs.length, avgScore: progress.completedLabs.length > 0 ? Math.round(progress.completedLabs.reduce((sum, lab) => sum + (lab.score || 0), 0) / progress.completedLabs.length) : 0, streak: 0, isCurrentUser: true },
        { name: "Sarah Wilson", points: 1850, labs: 9, avgScore: 85, streak: 2 },
        { name: "Tom Davis", points: 1620, labs: 8, avgScore: 82, streak: 4 }
    ];
    
    mockData.sort((a, b) => b.points - a.points);
    
    const tbody = document.getElementById("leaderboard-table");
    if (!tbody) return;
    
    tbody.innerHTML = mockData.map((user, index) => `
        <tr style="${user.isCurrentUser ? 'background: rgba(0, 212, 255, 0.1); border-left: 3px solid #00d4ff;' : ''}">
            <td style="color: ${index < 3 ? '#00d4ff' : '#b8c5db'}; font-weight: ${index < 3 ? 'bold' : 'normal'};">#${index + 1}</td>
            <td style="color: #ffffff; font-weight: ${user.isCurrentUser ? 'bold' : 'normal'};">${user.name} ${user.isCurrentUser ? '(You)' : ''}</td>
            <td style="color: #00ff88; font-weight: bold;">${user.points}</td>
            <td style="color: #b8c5db;">${user.labs}</td>
            <td style="color: #b8c5db;">${user.avgScore}%</td>
            <td style="color: ${user.streak > 3 ? '#ff6b35' : '#b8c5db'};">${user.streak} days</td>
        </tr>
    `).join('');
}

window.loadLeaderboard = loadLeaderboard;
