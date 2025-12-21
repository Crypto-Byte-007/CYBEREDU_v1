// Student Activity Heatmap System
function renderHeatmap(data, containerId = 'lab-heatmap') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = data
        .map((value, index) => `
            <div class="heat-cell" 
                 style="opacity: ${value / 100}; background-color: var(--primary)" 
                 title="Activity: ${value}%"
                 data-value="${value}">
            </div>
        `)
        .join("");
}

function generateHeatmapData(userActivity) {
    // Convert user activity to heatmap format
    const days = 365; // One year
    const data = new Array(days).fill(0);
    
    userActivity.forEach(activity => {
        const dayIndex = Math.floor((Date.now() - new Date(activity.date)) / (1000 * 60 * 60 * 24));
        if (dayIndex >= 0 && dayIndex < days) {
            data[days - dayIndex - 1] = Math.min(100, data[days - dayIndex - 1] + activity.score);
        }
    });
    
    return data;
}

function renderProgressHeatmap(labProgress) {
    const container = document.getElementById('progress-heatmap');
    if (!container) return;
    
    const labs = Object.keys(labProgress);
    container.innerHTML = labs.map(labId => {
        const progress = labProgress[labId].progress || 0;
        const color = progress === 100 ? '#28a745' : 
                     progress > 50 ? '#ffc107' : 
                     progress > 0 ? '#17a2b8' : '#6c757d';
        
        return `
            <div class="progress-cell" 
                 style="background-color: ${color}" 
                 title="${labId}: ${progress}% complete">
            </div>
        `;
    }).join('');
}

function updateActivityHeatmap() {
    // Simulate user activity data
    const mockActivity = Array.from({length: 50}, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        score: Math.floor(Math.random() * 100)
    }));
    
    const heatmapData = generateHeatmapData(mockActivity);
    renderHeatmap(heatmapData);
}