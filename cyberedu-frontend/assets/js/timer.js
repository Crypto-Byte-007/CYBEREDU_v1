function initializeTimer() {
    state.timeElapsed = 0;
    state.timer = null;
}

function startTimer() {
    if (state.timer) return;

    state.timer = setInterval(() => {
        state.timeElapsed++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(state.timer);
    state.timer = null;
}

function updateTimerDisplay() {
    const el = document.getElementById("timer");
    if (el) {
        el.textContent = formatTime(state.timeElapsed);
    }
}

function formatTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}