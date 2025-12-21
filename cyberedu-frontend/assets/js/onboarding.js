// Onboarding Wizard System
function startOnboarding() {
    if (localStorage.getItem("onboarded")) return;

    const steps = [
        {
            title: "Welcome to CyberEdu!",
            content: "Let's get you started with your cybersecurity learning journey.",
            target: "#dashboard-page"
        },
        {
            title: "Explore Labs",
            content: "Click here to access hands-on cybersecurity labs.",
            target: "#mylabs-page"
        },
        {
            title: "Track Progress",
            content: "Monitor your learning progress and achievements here.",
            target: "#reports-page"
        },
        {
            title: "Get Help",
            content: "Use hints and resources when you need assistance.",
            target: ".help-button"
        }
    ];

    showOnboardingStep(0, steps);
}

function showOnboardingStep(stepIndex, steps) {
    if (stepIndex >= steps.length) {
        completeOnboarding();
        return;
    }

    const step = steps[stepIndex];
    const overlay = document.createElement('div');
    overlay.className = 'onboarding-overlay';
    overlay.innerHTML = `
        <div class="onboarding-tooltip">
            <h3>${step.title}</h3>
            <p>${step.content}</p>
            <div class="onboarding-controls">
                <button onclick="skipOnboarding()">Skip</button>
                <button onclick="nextOnboardingStep(${stepIndex + 1}, ${JSON.stringify(steps).replace(/"/g, '&quot;')})">
                    ${stepIndex === steps.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Position tooltip near target element
    const target = document.querySelector(step.target);
    if (target) {
        const rect = target.getBoundingClientRect();
        const tooltip = overlay.querySelector('.onboarding-tooltip');
        tooltip.style.top = (rect.bottom + 10) + 'px';
        tooltip.style.left = rect.left + 'px';
    }
}

function nextOnboardingStep(stepIndex, steps) {
    document.querySelector('.onboarding-overlay')?.remove();
    showOnboardingStep(stepIndex, steps);
}

function skipOnboarding() {
    document.querySelector('.onboarding-overlay')?.remove();
    completeOnboarding();
}

function completeOnboarding() {
    localStorage.setItem("onboarded", "1");
    toast("Welcome to CyberEdu! You're all set to start learning.", "success");
}

// Reset onboarding (for testing)
function resetOnboarding() {
    localStorage.removeItem("onboarded");
}