// AI Hint Engine Integration
async function getAIHint(stepContext, labId, stepNumber) {
    try {
        // First try backend hints
        const backendHint = await api.get(`/labs/${labId}/hints/${stepNumber}`);
        if (backendHint.success && backendHint.data) {
            return backendHint.data.hint;
        }
    } catch (error) {
        console.warn('Backend hint failed, trying AI fallback');
    }

    // Fallback to AI hint (placeholder for now)
    return generateContextualHint(stepContext);
}

function generateContextualHint(context) {
    const hints = {
        'phishing': [
            'Check the email headers for suspicious domains',
            'Look for spelling mistakes in the sender address',
            'Verify the SPF, DKIM, and DMARC records'
        ],
        'ransomware': [
            'Isolate the affected system immediately',
            'Check for backup integrity before restoration',
            'Document all indicators of compromise'
        ]
    };

    const contextKey = Object.keys(hints).find(key => 
        context.toLowerCase().includes(key)
    );

    if (contextKey) {
        const contextHints = hints[contextKey];
        return contextHints[Math.floor(Math.random() * contextHints.length)];
    }

    return 'Review the lab instructions and try a different approach.';
}

function showHint(hint) {
    const hintModal = document.getElementById('hint-modal');
    if (hintModal) {
        hintModal.querySelector('.hint-content').textContent = hint;
        hintModal.style.display = 'flex';
    } else {
        toast(`💡 Hint: ${hint}`, 'info');
    }
}