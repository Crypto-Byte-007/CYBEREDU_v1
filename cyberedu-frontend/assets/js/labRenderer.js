let currentLab = null;
let currentStep = 0;

async function openLab(labId) {
    try {
        showGlobalLoader('Loading lab...');
        const data = await api.get(`/labs/${labId}`);
        
        if (!data.success) {
            toast('Unable to load lab', 'error');
            return;
        }

        currentLab = data.data;
        currentStep = 0;

        // Hide other pages and show lab interface
        document.querySelectorAll('.page-container').forEach(p => p.classList.remove('active'));
        document.getElementById('lab-interface').classList.remove('hidden');
        
        renderLab();
        hideGlobalLoader();
    } catch (error) {
        console.error('Failed to load lab:', error);
        toast('Failed to load lab', 'error');
        hideGlobalLoader();
    }
}

function renderLab() {
    if (!currentLab) return;

    // Render theory (left panel)
    document.getElementById('lab-theory-panel').innerHTML = `
        <h2>${currentLab.title}</h2>
        <div class="theory-content">
            ${currentLab.theory || 'Theory content will be loaded here...'}
        </div>
    `;

    // Render current step
    const step = currentLab.steps[currentStep];
    if (step) {
        // Render task (right-top)
        document.getElementById('lab-task-box').innerHTML = `
            <strong>Task ${currentStep + 1}:</strong> ${step.task}
        `;

        // Render simulation (right-middle)
        document.getElementById('lab-simulation-panel').innerHTML = `
            <div class="simulation-content">
                ${step.simulationText || 'Simulation environment loading...'}
            </div>
        `;

        // Render tutor (right-bottom)
        document.getElementById('lab-tutor-box').innerHTML = `
            <strong>Tutor:</strong> ${step.tutor || 'Follow the instructions above to complete this step.'}
        `;
    }

    // Update navigation buttons
    const prevBtn = document.getElementById('lab-prev-step');
    const nextBtn = document.getElementById('lab-next-step');
    
    prevBtn.disabled = currentStep === 0;
    nextBtn.textContent = currentStep === currentLab.steps.length - 1 ? 'Complete Lab' : 'Next';
}

function closeLab() {
    document.getElementById('lab-interface').classList.add('hidden');
    showPage('mylabs-page');
    currentLab = null;
    currentStep = 0;
}

// Navigation event listeners
document.getElementById('lab-next-step').onclick = async () => {
    if (!currentLab) return;
    
    if (currentStep < currentLab.steps.length - 1) {
        currentStep++;
        renderLab();
    } else {
        // Lab completed
        try {
            await api.post(`/labs/${currentLab._id}/complete`);
            toast('Lab completed successfully!', 'success');
            unlockBadge('Lab Completed');
        } catch (error) {
            console.error('Failed to mark lab as complete:', error);
        }
        closeLab();
    }
};

document.getElementById('lab-prev-step').onclick = () => {
    if (currentStep > 0) {
        currentStep--;
        renderLab();
    }
};

// Close lab with escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !document.getElementById('lab-interface').classList.contains('hidden')) {
        closeLab();
    }
});