// Dashboard Animations
function animateProgressBars() {
    document.querySelectorAll(".progress-fill").forEach(el => {
        const target = el.dataset.value || el.style.width.replace('%', '');
        el.style.width = "0%";

        setTimeout(() => {
            el.style.transition = "width 1.2s ease";
            el.style.width = target + "%";
        }, 200);
    });
}

function animateCounters() {
    document.querySelectorAll('.counter').forEach(el => {
        const target = parseInt(el.dataset.target || el.textContent);
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current);
        }, 20);
    });
}

function animateCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function pulseElement(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
            el.style.animation = '';
        }, 500);
    }
}