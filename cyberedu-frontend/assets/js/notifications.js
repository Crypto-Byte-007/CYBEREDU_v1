async function loadNotifications() {
    // Only load if authenticated
    if (!auth.isAuthenticated()) {
        return;
    }

    try {
        const response = await api.get('/notifications');
        if (response.success && response.data) {
            state.notifications = response.data;
        } else {
            // Fallback to static notifications
            state.notifications = [
                { id: 1, title: "New lab available: Malware Analysis", read: false },
                { id: 2, title: "Your report has been graded", read: true }
            ];
        }
        updateNotificationBadge();
    } catch (error) {
        console.error('Failed to load notifications:', error);
        // Use fallback notifications
        state.notifications = [];
    }
}

async function markAsRead(notificationId) {
    try {
        await api.patch(`/notifications/${notificationId}/read`);
        const notification = state.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            updateNotificationBadge();
        }
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
    }
}

async function markAllRead() {
    try {
        await api.patch('/notifications/read-all');
        state.notifications.forEach(n => n.read = true);
        updateNotificationBadge();
    } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
    }
}

function updateNotificationBadge() {
    const unreadCount = state.notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notification-badge');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
}

function showNotification(message, type = "info") {
    showFlashMessage(message, type);
}