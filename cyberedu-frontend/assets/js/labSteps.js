function loadLabStepContent(labId, step) {
    const box = document.getElementById("lab-step-content");
    state.currentStep = step;

    if (labId === "phishing") {
        if (step === 1) {
            box.innerHTML = `
                <h3>Step 1: Identify Phishing</h3>
                <p>Review email headers and identify suspicious indicators.</p>
            `;
        }

        if (step === 2) {
            box.innerHTML = `
                <h3>Step 2: Containment</h3>
                <p>Take action to isolate the affected user.</p>
            `;
        }
    }

    updateStepIndicator();
    updateButtons();
}

function nextStep() {
    if (state.currentStep >= state.totalSteps) {
        completeLab();
        return;
    }

    state.currentStep++;
    loadLabStepContent(state.currentLab, state.currentStep);
    loadLabEnvironment(state.currentLab);

    showFlashMessage("Next step loaded", "info");
}

function completeStep() {
    const progress = state.labProgress[state.currentLab];
    if (!progress.completedSteps.includes(state.currentStep))
        progress.completedSteps.push(state.currentStep);

    progress.progress = Math.floor((progress.completedSteps.length / state.totalSteps) * 100);

    showFlashMessage("Step completed!", "success");

    if (progress.completedSteps.length === state.totalSteps) {
        completeLab();
    }
}

function completeLab() {
    const progress = state.labProgress[state.currentLab];
    progress.progress = 100;
    progress.status = "completed";

    showFlashMessage("Lab completed!", "success");
}

function updateStepIndicator() {
    // Update step indicator UI
}

function updateButtons() {
    // Update navigation buttons
}