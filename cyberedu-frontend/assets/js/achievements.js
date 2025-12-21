import { ACHIEVEMENTS, LEVELS } from "./achievements-data.js";

export class AchievementEngine {
    constructor() {
        this.unlocked = JSON.parse(localStorage.getItem("achievements") || "{}");
        this.totalXP = parseInt(localStorage.getItem("totalXP") || "0");
        this.labsCompleted = parseInt(localStorage.getItem("labsCompleted") || "0");
        this.streak = parseInt(localStorage.getItem("streak") || "0");
        this.lastLabDate = localStorage.getItem("lastLabDate");
    }

    unlock(id, context = {}) {
        if (this.unlocked[id]) return false;

        const achievement = ACHIEVEMENTS.find(a => a.id === id);
        if (!achievement) return false;

        this.unlocked[id] = {
            unlockedAt: new Date().toISOString(),
            context: context
        };
        
        this.addXP(achievement.xp);
        localStorage.setItem("achievements", JSON.stringify(this.unlocked));

        this.showPopup(achievement);
        return achievement.xp;
    }

    addXP(amount) {
        const oldLevel = this.getCurrentLevel();
        this.totalXP += amount;
        localStorage.setItem("totalXP", this.totalXP.toString());
        
        const newLevel = this.getCurrentLevel();
        if (newLevel.level > oldLevel.level) {
            this.showLevelUp(newLevel);
        }
    }

    getCurrentLevel() {
        for (let i = LEVELS.length - 1; i >= 0; i--) {
            if (this.totalXP >= LEVELS[i].xpRequired) {
                return LEVELS[i];
            }
        }
        return LEVELS[0];
    }

    getProgressToNextLevel() {
        const currentLevel = this.getCurrentLevel();
        const nextLevelIndex = LEVELS.findIndex(l => l.level === currentLevel.level) + 1;
        
        if (nextLevelIndex >= LEVELS.length) {
            return { progress: 100, xpNeeded: 0, nextLevel: null };
        }
        
        const nextLevel = LEVELS[nextLevelIndex];
        const xpInCurrentLevel = this.totalXP - currentLevel.xpRequired;
        const xpNeededForNext = nextLevel.xpRequired - currentLevel.xpRequired;
        const progress = Math.min(100, (xpInCurrentLevel / xpNeededForNext) * 100);
        
        return {
            progress: Math.round(progress),
            xpNeeded: nextLevel.xpRequired - this.totalXP,
            nextLevel: nextLevel
        };
    }

    completeLabCheck(labId, timeSpent, hintsUsed, score) {
        this.labsCompleted++;
        localStorage.setItem("labsCompleted", this.labsCompleted.toString());
        
        // Update streak
        const today = new Date().toDateString();
        if (this.lastLabDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (this.lastLabDate === yesterday.toDateString()) {
                this.streak++;
            } else {
                this.streak = 1;
            }
            
            this.lastLabDate = today;
            localStorage.setItem("streak", this.streak.toString());
            localStorage.setItem("lastLabDate", this.lastLabDate);
        }

        // Check achievements
        if (this.labsCompleted === 1) {
            this.unlock("first-lab");
        }
        
        if (hintsUsed === 0) {
            this.unlock("no-hints", { labId });
        }
        
        if (score === 100) {
            this.unlock("perfect", { labId, score });
        }
        
        if (timeSpent < 300000) { // 5 minutes
            this.unlock("fast-learner", { labId, timeSpent });
        }
        
        if (this.streak >= 3) {
            this.unlock("streak3", { streak: this.streak });
        }
        
        if (this.labsCompleted >= 10) {
            this.unlock("security-guru", { labsCompleted: this.labsCompleted });
        }

        // Time-based achievements
        const hour = new Date().getHours();
        if (hour >= 22 || hour <= 2) {
            this.unlock("night-owl", { hour });
        }
        
        if (hour >= 5 && hour <= 7) {
            this.unlock("early-bird", { hour });
        }
    }

    showPopup(achievement) {
        const popup = document.createElement("div");
        popup.className = "achievement-popup";

        popup.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <h3>🏆 Achievement Unlocked!</h3>
                <strong>${achievement.title}</strong>
                <p>${achievement.desc}</p>
                <span class="xp-reward">+${achievement.xp} XP</span>
            </div>
        `;

        document.body.appendChild(popup);
        
        // Play achievement sound
        this.playAchievementSound();
        
        setTimeout(() => {
            popup.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => popup.remove(), 300);
        }, 4000);
    }

    showLevelUp(newLevel) {
        const popup = document.createElement("div");
        popup.className = "level-up-popup";

        popup.innerHTML = `
            <div class="level-up-content">
                <h2>🎉 LEVEL UP!</h2>
                <div class="level-badge" style="background: ${newLevel.color}">
                    ${newLevel.level}
                </div>
                <h3>${newLevel.title}</h3>
                <p>You've reached level ${newLevel.level}!</p>
            </div>
        `;

        document.body.appendChild(popup);
        
        setTimeout(() => {
            popup.style.animation = 'levelUpOut 0.5s ease-in forwards';
            setTimeout(() => popup.remove(), 500);
        }, 3000);
    }

    playAchievementSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Achievement fanfare
            oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
            oscillator.frequency.setValueAtTime(1047, audioContext.currentTime + 0.3); // C6
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Achievement sound not available');
        }
    }

    getUnlockedAchievements() {
        return Object.keys(this.unlocked).map(id => {
            const achievement = ACHIEVEMENTS.find(a => a.id === id);
            return {
                ...achievement,
                unlockedAt: this.unlocked[id].unlockedAt,
                context: this.unlocked[id].context
            };
        });
    }

    getStats() {
        return {
            totalXP: this.totalXP,
            currentLevel: this.getCurrentLevel(),
            progressToNext: this.getProgressToNextLevel(),
            achievementsUnlocked: Object.keys(this.unlocked).length,
            totalAchievements: ACHIEVEMENTS.length,
            labsCompleted: this.labsCompleted,
            currentStreak: this.streak
        };
    }
}

export const achievementEngine = new AchievementEngine();