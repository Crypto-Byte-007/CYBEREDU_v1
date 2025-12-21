export function tutorSpeak(type = "strict") {
    try {
        const audio = new Audio(`./assets/voice/${type}.mp3`);
        audio.volume = 0.7;
        audio.play().catch(() => {
            // Fallback: Web Speech API for text-to-speech
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance();
                
                switch(type) {
                    case 'correct':
                        utterance.text = "Correct! Well done.";
                        utterance.rate = 1.2;
                        utterance.pitch = 1.1;
                        break;
                    case 'wrong':
                        utterance.text = "Incorrect. Try again.";
                        utterance.rate = 0.9;
                        utterance.pitch = 0.8;
                        break;
                    case 'hint':
                        utterance.text = "Here's a hint to help you.";
                        utterance.rate = 1.0;
                        utterance.pitch = 1.0;
                        break;
                    case 'welcome':
                        utterance.text = "Welcome to the cybersecurity lab.";
                        utterance.rate = 1.0;
                        utterance.pitch = 1.0;
                        break;
                    default:
                        utterance.text = "Pay attention and follow instructions.";
                        utterance.rate = 0.95;
                        utterance.pitch = 0.9;
                }
                
                utterance.volume = 0.6;
                speechSynthesis.speak(utterance);
            }
        });
    } catch (error) {
        console.log('Voice feedback not available');
    }
}