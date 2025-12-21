export function updateTutor(message) {
    const panel = document.getElementById("lab-tutor-box");

    if (!panel) {
        console.error("❌ lab-tutor-box missing from HTML");
        return;
    }

    // Determine tutor mood and voice based on message content
    let mood = "tutor-strict";
    let voice = "strict";
    
    if (message.includes("Good") || message.includes("Correct") || message.includes("✅")) {
        mood = "tutor-happy";
        voice = "correct";
    } else if (message.includes("No") || message.includes("Incorrect") || message.includes("❌")) {
        mood = "tutor-angry";
        voice = "wrong";
    } else if (message.includes("Hint") || message.includes("💡")) {
        voice = "hint";
    } else if (message.includes("Welcome")) {
        voice = "welcome";
    }

    // Play tutor voice
    import('../tutor-voice.js').then(({ tutorSpeak }) => {
        tutorSpeak(voice);
    });

    // Add typing animation
    panel.classList.add('tutor-typing');
    panel.innerHTML = `
        <div class="tutor-avatar">
            <i class="fas fa-user-tie"></i>
        </div>
        <div class="tutor-message">
            <div class="message-bubble">
                <span class="typing-indicator">Tutor is typing</span>
            </div>
        </div>
    `;

    // Show actual message after typing delay
    setTimeout(() => {
        panel.className = `lab-tutor-box fade-in ${mood}`;
        
        panel.innerHTML = `
            <div class="tutor-avatar">
                <i class="fas fa-user-tie"></i>
            </div>
            <div class="tutor-message slide-up">
                <div class="message-bubble">
                    ${message}
                </div>
                <div class="message-timestamp">
                    ${new Date().toLocaleTimeString()}
                </div>
            </div>
        `;
    }, 1200);
}

export function showTutorHint(hint) {
    updateTutor(`💡 <strong>Hint:</strong> ${hint}`);
}

export function showTutorSuccess(message) {
    updateTutor(`✅ <strong>Correct!</strong> ${message}`);
}

export function showTutorError(message) {
    updateTutor(`❌ <strong>Not quite right.</strong> ${message}`);
}