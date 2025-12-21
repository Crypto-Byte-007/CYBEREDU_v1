export function startMatrix() {
    // Remove existing matrix if present
    const existing = document.querySelector('.matrix-bg');
    if (existing) existing.remove();
    
    const container = document.createElement("div");
    container.className = "matrix-bg";
    document.body.appendChild(container);

    const chars = "01▮▯░▒▓█ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let isActive = true;
    
    function spawnChar() {
        if (!isActive) return;
        
        const span = document.createElement("span");
        span.className = "matrix-char";
        span.innerText = chars[Math.floor(Math.random() * chars.length)];
        span.style.left = Math.random() * window.innerWidth + "px";
        span.style.animationDuration = (Math.random() * 3 + 2) + "s";
        span.style.opacity = Math.random() * 0.8 + 0.2;
        container.appendChild(span);

        setTimeout(() => {
            if (span.parentNode) span.remove();
        }, 5000);
    }

    const interval = setInterval(spawnChar, 100);
    
    // Stop matrix after 30 seconds to prevent performance issues
    setTimeout(() => {
        isActive = false;
        clearInterval(interval);
        setTimeout(() => {
            if (container.parentNode) container.remove();
        }, 5000);
    }, 30000);
}

export function stopMatrix() {
    const container = document.querySelector('.matrix-bg');
    if (container) container.remove();
}