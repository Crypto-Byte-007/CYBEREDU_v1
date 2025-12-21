import api from '../api.js';
import { updateTutor } from './ai-tutor.js';
import { renderSimulationUI } from './simulation-ui.js';
import { achievementEngine } from '../achievements.js';
import { startMatrix } from '../matrix.js';

class SimulationEngine {
    constructor() {
        this.lab = null;
        this.currentStep = 0;
        this.progress = {};
    }

    async loadLab(labId) {
        try {
            // Start matrix effect
            startMatrix();
            
            // Fetch full simulation package
            const sim = await api.get(`/labs/${labId}/simulation`);
            this.lab = sim.data || sim;
            this.lab.id = labId;

            this.currentStep = 0;
            this.progress = {};
            this.startTime = Date.now();
            this.hintsUsed = 0;

            renderSimulationUI(this.lab, this.currentStep);
            updateTutor(this.lab.aiTutorPersona || "Welcome to the cybersecurity lab simulation!");
        } catch (error) {
            console.error('Failed to load lab:', error);
            updateTutor("❌ Failed to load simulation. Please try again.");
        }
    }

    getCurrentStep() {
        return this.lab.steps[this.currentStep];
    }

    async submitAnswer(answer) {
        const step = this.getCurrentStep();

        // Basic validation - check if answer contains expected keywords
        const expectedAction = step.expectedAction.toLowerCase();
        const userAnswer = answer.toLowerCase();
        
        // Simple keyword matching for simulation validation
        const correct = expectedAction.split(' ').some(keyword => 
            userAnswer.includes(keyword) || 
            userAnswer.includes(step.instruction.toLowerCase().split(' ').find(word => word.length > 4))
        );

        // Update tutor panel
        updateTutor(
            correct ? step.successMessage : `❌ ${step.hint}`
        );

        // Update progress
        this.progress[this.currentStep] = { answer, correct };

        if (correct) {
            try {
                await api.post(`/labs/${this.lab.id}/steps/${this.currentStep}/complete`, {
                    answer,
                    stepNumber: step.stepNumber
                });
            } catch (error) {
                console.warn('Failed to save progress:', error);
            }

            setTimeout(() => {
                this.nextStep();
            }, 2000);
        }

        return correct;
    }

    nextStep() {
        if (this.currentStep + 1 >= this.lab.steps.length) {
            // Lab completed - trigger achievements
            const timeSpent = Date.now() - this.startTime;
            const score = this.calculateScore();
            
            achievementEngine.completeLabCheck(
                this.lab.id, 
                timeSpent, 
                this.hintsUsed, 
                score
            );
            
            updateTutor("🎉 Excellent work! You completed the simulation successfully!");
            renderSimulationUI(this.lab, null, true);
            return;
        }

        this.currentStep++;
        renderSimulationUI(this.lab, this.currentStep);
        
        const step = this.getCurrentStep();
        updateTutor(`Step ${step.stepNumber}: ${step.instruction}`);
    }
    
    calculateScore() {
        const totalSteps = this.lab.steps.length;
        const correctSteps = Object.values(this.progress).filter(p => p.correct).length;
        return Math.round((correctSteps / totalSteps) * 100);
    }
    
    useHint() {
        this.hintsUsed++;
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            renderSimulationUI(this.lab, this.currentStep);
            
            const step = this.getCurrentStep();
            updateTutor(`Step ${step.stepNumber}: ${step.instruction}`);
        }
    }
}

export const simulationEngine = new SimulationEngine();