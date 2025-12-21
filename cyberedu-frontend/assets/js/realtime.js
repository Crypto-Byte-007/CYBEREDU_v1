let socket = null;

function initRealtime() {
    if (!auth.isAuthenticated()) return;

    const userId = auth.getUser()?._id;
    if (!userId) return;

    try {
        socket = new WebSocket(`ws://localhost:3000/ws?userId=${userId}`);

        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            document.dispatchEvent(new CustomEvent("ws:event", { detail: msg }));
        };

        socket.onclose = () => {
            setTimeout(initRealtime, 2000); // auto-reconnect
        };

        socket.onerror = (error) => {
            console.warn('WebSocket error:', error);
        };
    } catch (error) {
        console.warn('WebSocket not supported or connection failed');
    }
}

function closeRealtime() {
    if (socket) {
        socket.close();
        socket = null;
    }
}

// Listen for real-time events
document.addEventListener('ws:event', (event) => {
    const { type, data } = event.detail;
    
    switch (type) {
        case 'notification':
            toast(data.message, 'info');
            loadNotifications();
            break;
        case 'lab_update':
            if (state.currentLab === data.labId) {
                renderLabs();
            }
            break;
        case 'system_message':
            toast(data.message, data.type || 'info');
            break;
    }
});