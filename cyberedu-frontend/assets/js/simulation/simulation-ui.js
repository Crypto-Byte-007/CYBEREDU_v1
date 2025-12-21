import { simulationEngine } from './simulation-engine.js';

export function renderSimulationUI(lab, stepIndex, completed = false) {
    const container = document.getElementById("lab-simulation-panel");

    if (!container) {
        console.error("❌ lab-simulation-panel container missing in HTML");
        return;
    }

    // Add progress bar first
    container.innerHTML = `
        <div class="step-progress">
            <div id="step-progress-fill" class="step-progress-fill"></div>
        </div>
    `;

    if (completed) {
        container.innerHTML += `
            <div class="fade-in slide-right">
                <div class="completion-icon">🎉</div>
                <h2>Simulation Complete!</h2>
                <p>Proceed to final assessment questions.</p>
                <button onclick="showQuestions()" class="btn btn-primary pulse">
                    <i class="fas fa-question-circle"></i> Answer Final Questions
                </button>
            </div>
        `;
        return;
    }

    const step = lab.steps[stepIndex];
    const progressPercent = ((stepIndex + 1) / lab.steps.length) * 100;

    container.innerHTML += `
        <div class="sim-header slide-left">
            <h2>${lab.title || 'Cybersecurity Lab'}</h2>
            <p>Step ${stepIndex + 1}/${lab.steps.length}</p>
        </div>

        <div class="sim-body fade-in">
            <div class="step-instruction">
                <h3>${step.instruction}</h3>
            </div>

            <div class="simulation-area">
                <div class="sim-terminal" id="sim-terminal">
                    <div class="matrix-bg"></div>
                </div>
            </div>

            <div class="answer-section">
                <label for="sim-answer">Your Response:</label>
                <textarea 
                    id="sim-answer" 
                    class="sim-input fade-in" 
                    placeholder="Your response... (the tutor is watching)"
                    rows="3"
                ></textarea>
                
                <div class="sim-actions">
                    <button id="sim-hint" class="btn btn-outline">
                        <i class="fas fa-lightbulb"></i> Hint
                    </button>
                    <button id="sim-submit" class="sim-submit slide-right">
                        <i class="fas fa-check"></i> Submit & Continue
                    </button>
                </div>
            </div>
        </div>
    `;

    // Update progress bar with animation
    setTimeout(() => {
        document.getElementById("step-progress-fill").style.width = `${progressPercent}%`;
    }, 100);

    // Type writer effect for terminal
    const terminalText = `> Initializing simulation environment...
> Loading step ${stepIndex + 1}: ${step.instruction}
> Expected action: ${step.expectedAction}
> Waiting for user input...`;
    
    typeWriter(terminalText, document.getElementById("sim-terminal"));

    // Event listeners with enhanced effects
    document.getElementById("sim-submit").onclick = async () => {
        const answer = document.getElementById("sim-answer").value.trim();
        if (!answer) {
            showToast("Please enter your response", "error");
            return;
        }

        const submitBtn = document.getElementById("sim-submit");
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';

        const correct = await simulationEngine.submitAnswer(answer);

        if (!correct) {
            playSound("fail");
            const answerInput = document.getElementById("sim-answer");
            answerInput.classList.add("shake", "error-glow");
            setTimeout(() => {
                answerInput.classList.remove("shake", "error-glow");
            }, 600);
            
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Submit & Continue';
        } else {
            playSound("success");
            xpPopup("+10 XP");
            document.getElementById("sim-answer").classList.add("success-glow");
        }
    };

    document.getElementById("sim-hint").onclick = () => {
        // Track hint usage for achievements
        import('./simulation-engine.js').then(({ simulationEngine }) => {
            simulationEngine.useHint();
        });
        
        const hintModal = document.getElementById('hint-modal');
        const hintContent = document.querySelector('.hint-content');
        if (hintModal && hintContent) {
            hintContent.innerHTML = `<p><strong>💡 Hint:</strong> ${step.hint}</p>`;
            hintModal.classList.remove('hidden');
        }
    };

    // Auto-focus with animation
    setTimeout(() => {
        document.getElementById("sim-answer").focus();
    }, 500);
}

// Typing animation engine
function typeWriter(text, element, speed = 25) {
    if (!element) return;
    
    element.innerHTML = '';
    const lines = text.split('\n');
    let lineIndex = 0;
    
    function typeLine() {
        if (lineIndex >= lines.length) return;
        
        const line = lines[lineIndex];
        const lineElement = document.createElement('div');
        lineElement.className = 'terminal-line';
        element.appendChild(lineElement);
        
        let charIndex = 0;
        
        function typeChar() {
            if (charIndex < line.length) {
                lineElement.innerHTML = line.substring(0, charIndex + 1) + 
                    '<span class="blink-cursor"></span>';
                charIndex++;
                setTimeout(typeChar, speed);
            } else {
                lineElement.innerHTML = line;
                lineIndex++;
                setTimeout(typeLine, 200);
            }
        }
        
        typeChar();
    }
    
    typeLine();
}

// Sound effects
function playSound(type) {
    try {
        const audio = new Audio(`./assets/sfx/${type}.mp3`);
        audio.volume = 0.3;
        audio.play().catch(() => {
            // Fallback: create audio feedback with Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (type === 'success') {
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
            } else {
                oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.1);
            }
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        });
    } catch (error) {
        console.log('Audio not available');
    }
}

// XP popup animation
function xpPopup(text) {
    const popup = document.createElement("div");
    popup.className = "xp-popup";
    popup.innerText = text;
    
    document.body.appendChild(popup);
    
    setTimeout(() => popup.remove(), 1500);
}

// Toast notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastSlide 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

window.showQuestions = function() {
    showToast("Loading final assessment questions...", "info");
    // This would show the final assessment questions
};