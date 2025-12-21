// ================================
// LABS MODULE - INTERACTIVE VERSION
// ================================

import api from "./api.js";
import { showFlashMessage } from "./flash.js";

let currentLab = null;
let currentStep = 0;

export async function loadLabs() {
    try {
        const data = await api.get("/labs");
        const labs = data.data || data || [];
        renderLabList(labs);
    } catch (err) {
        showFlashMessage("Failed to load labs", "error");
        renderLabList([]);
    }
}

function renderLabList(labs) {
    const container = document.getElementById("lab-list");
    if (!container) return;

    if (labs.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-flask" style="font-size: 48px; margin-bottom: 20px;"></i>
                <h3>No Labs Available Yet</h3>
                <p>Labs will be added soon. Check back later!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = labs.map(lab => `
        <div class="lab-card" data-category="${lab.category || 'all'}" style="cursor: pointer;" onclick="startLab('${lab.labId}')">
            <div class="lab-card-header">
                <h3>${lab.title || 'Untitled Lab'}</h3>
                <span class="lab-difficulty ${lab.difficulty || 'beginner'}">${lab.difficulty || 'Beginner'}</span>
            </div>
            <p>${lab.description || 'No description available'}</p>
            <div class="lab-card-footer">
                <span class="lab-time"><i class="fas fa-clock"></i> ${lab.estimatedTime || '30 min'}</span>
                <button class="btn btn-primary" onclick="event.stopPropagation(); startLab('${lab.labId}')">Start Lab</button>
            </div>
        </div>
    `).join("");
}

export async function startLab(labId) {
    currentLab = null;
    currentStep = 0;

    try {
        const labData = await api.get(`/labs/${labId}`);
        const lab = labData.data || labData;
        currentLab = lab;
        
        document.querySelectorAll('.page-container').forEach(p => p.classList.remove('active'));
        document.getElementById('lab-interface').classList.remove('hidden');
        document.getElementById('main-navbar').classList.add('hidden');
        
        renderLabInterface(lab);
    } catch (err) {
        showFlashMessage("Failed to load lab: " + err.message, "error");
    }
}

function renderLabInterface(lab) {
    const theory = lab.theoryContent || {};
    const simulation = lab.simulation || {};
    const steps = simulation.steps || [];
    const questions = lab.questions || [];

    const theoryPanel = document.getElementById('lab-theory-panel');
    theoryPanel.innerHTML = `
        <div class="theory-header">
            <button onclick="exitLab()" class="btn-back">← Back to Labs</button>
            <h2>${lab.title}</h2>
            <span class="difficulty-badge ${lab.difficulty}">${lab.difficulty}</span>
        </div>
        <div class="theory-content">
            <h3>📚 What is this about?</h3>
            <p class="theory-summary">${theory.summary || 'Learn about this topic'}</p>
            
            <h3>🔑 Key Points to Remember:</h3>
            <ul class="key-points">
                ${(theory.keyPoints || []).map(point => `<li>${point}</li>`).join('')}
            </ul>

            <div class="questions-section">
                <h3>❓ Answer These Questions:</h3>
                <p class="questions-hint">Complete the simulation to find answers!</p>
                ${questions.map((q, i) => `
                    <div class="question-item">
                        <p class="question-text"><strong>Q${i + 1}:</strong> ${q.q}</p>
                        <input type="text" id="answer-${i}" placeholder="Your answer..." class="answer-input">
                        <span class="answer-feedback" id="feedback-${i}"></span>
                    </div>
                `).join('')}
                <button onclick="checkAnswers()" class="btn btn-primary">Submit Answers</button>
            </div>
        </div>
    `;

    renderSimulationStep(steps[currentStep], simulation.aiTutorPersona || 'Strict Cyber Instructor');
}

function renderSimulationStep(step, tutorPersona) {
    if (!step) return;

    const taskBox = document.getElementById('lab-task-box');
    const simPanel = document.getElementById('lab-simulation-panel');
    const tutorBox = document.getElementById('lab-tutor-box');

    taskBox.innerHTML = `
        <div class="step-header">
            <span class="step-badge">Step ${step.stepNumber}/${currentLab.simulation.steps.length}</span>
            <h3>${step.instruction}</h3>
        </div>
    `;

    simPanel.innerHTML = createInteractiveSimulation(step, currentStep);

    tutorBox.innerHTML = `
        <div class="tutor-avatar"><div class="avatar-icon"></div></div>
        <div class="tutor-message">
            <p class="tutor-name">${tutorPersona}</p>
            <p class="tutor-text">${step.instruction}</p>
            <div class="tutor-hint" id="tutor-hint" style="display:none;">
                <span class="hint-label">HINT:</span> ${step.hint}
            </div>
        </div>
    `;

    const prevBtn = document.getElementById('lab-prev-step');
    const nextBtn = document.getElementById('lab-next-step');
    
    prevBtn.disabled = currentStep === 0;
    
    if (currentStep === currentLab.simulation.steps.length - 1) {
        nextBtn.textContent = 'Finish Lab ✓';
        nextBtn.onclick = finishLab;
    } else {
        nextBtn.textContent = 'Next Step →';
        nextBtn.onclick = nextStep;
    }
}

function createInteractiveSimulation(step, stepNum) {
    const labId = currentLab.labId;
    
    if (labId === 'S001') return createPhishingSimulation(stepNum);
    if (labId === 'S002') return createEmailSimulation(stepNum);
    if (labId === 'S003') return createPasswordSimulation(stepNum);
    if (labId === 'S004') return createSocialMediaSimulation(stepNum);
    if (labId === 'S005') return createComputerHygieneSimulation(stepNum);
    if (labId === 'S006') return createGiveawaySimulation(stepNum);
    if (labId === 'S007') return createMalwareSimulation(stepNum);
    if (labId === 'S008') return createCyberbullyingSimulation(stepNum);
    if (labId === 'S009') return createFakeAppSimulation(stepNum);
    if (labId === 'S010') return createGamingSimulation(stepNum);
    
    return `
        <div class="simulation-content">
            <h4>🎯 Interactive Task:</h4>
            <div class="interactive-area">
                <p>${step.expectedAction}</p>
                <div class="interactive-element">
                    <button onclick="performAction(${stepNum})" class="action-btn">🔍 Perform Action</button>
                </div>
            </div>
        </div>
    `;
}

function createPhishingSimulation(stepNum) {
    const simulations = [
        `<div class="simulation-browser">
            <div class="browser-bar">
                <div class="browser-controls">
                    <span class="control-dot red"></span>
                    <span class="control-dot yellow"></span>
                    <span class="control-dot green"></span>
                </div>
                <div class="browser-url" id="url-bar">
                    <span class="lock-icon">🔒</span>
                    https://www.amaz0n-login.com/signin
                </div>
                <button onclick="inspectURL()" class="inspect-btn">Inspect URL</button>
            </div>
            <div class="browser-content">
                <div class="login-form">
                    <h2>Amazon</h2>
                    <p class="form-subtitle">Sign in to your account</p>
                    <input type="text" placeholder="Email or phone number" disabled>
                    <input type="password" placeholder="Password" disabled>
                    <button class="signin-btn" disabled>Sign In</button>
                </div>
            </div>
            <div id="inspection-result"></div>
        </div>`,
        
        `<div class="simulation-browser">
            <div class="browser-bar">
                <div class="browser-controls">
                    <span class="control-dot red"></span>
                    <span class="control-dot yellow"></span>
                    <span class="control-dot green"></span>
                </div>
                <div class="browser-url">
                    <span class="lock-icon secure">🔒</span>
                    https://www.amaz0n-login.com
                </div>
                <button onclick="checkCertificate()" class="inspect-btn">View Certificate</button>
            </div>
            <div class="cert-panel">
                <h4>Certificate Information</h4>
                <div class="cert-info">
                    <p><strong>Issued to:</strong> amaz0n-login.com</p>
                    <p><strong>Issued by:</strong> Unknown Certificate Authority</p>
                </div>
            </div>
            <div id="cert-result"></div>
        </div>`,
        
        `<div class="simulation-browser">
            <div class="browser-content">
                <div class="page-content">
                    <h2>Welcom to Amazon</h2>
                    <p class="page-text">Please enter your accont details to continu.</p>
                    <div class="form-group">
                        <input type="text" placeholder="Email" disabled>
                        <input type="password" placeholder="Password" disabled>
                    </div>
                </div>
                <button onclick="highlightErrors()" class="inspect-btn">Analyze Text</button>
                <div id="error-result"></div>
            </div>
        </div>`,
        
        `<div class="simulation-browser">
            <div class="browser-content">
                <div class="page-content">
                    <button id="login-btn" onmouseover="showRedirect()" class="fake-login">Continue to Login</button>
                    <p class="instruction-text">Hover over the button to inspect its destination</p>
                </div>
                <div id="redirect-result"></div>
            </div>
        </div>`,
        
        `<div class="simulation-browser">
            <div class="browser-content">
                <div class="decision-panel">
                    <h3>Security Decision Required</h3>
                    <p>You've identified this as a suspicious website. What action should you take?</p>
                    <div class="action-choices">
                        <button onclick="chooseAction('enter')" class="choice-btn danger">Enter Credentials</button>
                        <button onclick="chooseAction('report')" class="choice-btn success">Report & Close</button>
                        <button onclick="chooseAction('ignore')" class="choice-btn warning">Ignore Warning</button>
                    </div>
                </div>
                <div id="action-result"></div>
            </div>
        </div>`
    ];
    
    return `<div class="simulation-content">${simulations[stepNum] || simulations[0]}</div>`;
}

function completeStep(isCorrect = true) {
    const step = currentLab.simulation.steps[currentStep];
    const tutorBox = document.getElementById('lab-tutor-box');
    
    if (isCorrect) {
        tutorBox.innerHTML = `
            <div class="tutor-avatar">👨🏫</div>
            <div class="tutor-message success">
                <p><strong>Instructor:</strong></p>
                <p>"${step.successMessage || 'Correct! Well done.'}"</p>
            </div>
        `;
        
        setTimeout(() => {
            if (currentStep < currentLab.simulation.steps.length - 1) {
                nextStep();
            }
        }, 2000);
    } else {
        tutorBox.innerHTML = `
            <div class="tutor-avatar">👨🏫</div>
            <div class="tutor-message error">
                <p><strong>Instructor:</strong></p>
                <p>"Not quite. Try again!"</p>
            </div>
        `;
    }
}

function finishLab() {
    // Save lab completion
    const progress = JSON.parse(localStorage.getItem('userProgress') || '{"completedLabs": [], "totalPoints": 0, "totalTime": 0}');
    
    const alreadyCompleted = progress.completedLabs.find(l => l.labId === currentLab.labId);
    if (!alreadyCompleted) {
        progress.completedLabs.push({
            labId: currentLab.labId,
            title: currentLab.title,
            score: 100,
            completedAt: Date.now()
        });
        progress.totalPoints += currentLab.points || 100;
        progress.totalTime += currentLab.estimatedTime || 30;
        localStorage.setItem('userProgress', JSON.stringify(progress));
    }
    
    showFlashMessage('🎉 Lab completed! Now answer the questions below.', 'success');
    document.querySelector('.questions-section').scrollIntoView({ behavior: 'smooth' });
}

function showStepHint() {
    const hintEl = document.getElementById('tutor-hint');
    if (hintEl) hintEl.style.display = 'block';
}

function checkAnswers() {
    const questions = currentLab.questions || [];
    let correct = 0;
    let allFilled = true;
    
    questions.forEach((q, i) => {
        const input = document.getElementById(`answer-${i}`);
        const feedback = document.getElementById(`feedback-${i}`);
        const userAnswer = input.value.trim();
        
        if (!userAnswer) {
            feedback.textContent = '⚠ Please enter an answer';
            feedback.className = 'answer-feedback warning';
            allFilled = false;
            return;
        }
        
        const userLower = userAnswer.toLowerCase();
        const correctAnswer = q.a.toLowerCase();
        
        if (userLower.includes(correctAnswer.substring(0, 5)) || 
            correctAnswer.includes(userLower.substring(0, 5)) ||
            userLower === correctAnswer) {
            feedback.textContent = '✓ Correct!';
            feedback.className = 'answer-feedback correct';
            input.style.borderColor = '#28a745';
            correct++;
        } else {
            feedback.textContent = `✗ Incorrect. Hint: ${q.a.substring(0, 15)}...`;
            feedback.className = 'answer-feedback incorrect';
            input.style.borderColor = '#dc3545';
        }
    });
    
    if (!allFilled) {
        showFlashMessage('Please answer all questions before submitting!', 'warning');
        return;
    }
    
    if (correct === questions.length) {
        showFlashMessage(`🎉 Perfect! You got all ${correct} answers correct!`, 'success');
        setTimeout(() => {
            exitLab();
            if (window.loadDashboard) window.loadDashboard();
        }, 2000);
    } else {
        showFlashMessage(`You got ${correct}/${questions.length} correct. Try again!`, 'info');
    }
}

function exitLab() {
    document.getElementById('lab-interface').classList.add('hidden');
    document.getElementById('main-navbar').classList.remove('hidden');
    window.showPage('mylabs-page');
    currentLab = null;
    currentStep = 0;
}

// Interactive actions
window.inspectURL = function() {
    document.getElementById('inspection-result').innerHTML = `
        <div class="result-box correct">
            ✓ Suspicious! Domain is "amaz0n" (with zero) instead of "amazon"
        </div>
    `;
    setTimeout(() => completeStep(true), 1500);
};

window.checkCertificate = function() {
    document.getElementById('cert-result').innerHTML = `
        <div class="result-box correct">
            ✓ Certificate owner: "Unknown Entity" - NOT Amazon!
        </div>
    `;
    setTimeout(() => completeStep(true), 1500);
};

window.highlightErrors = function() {
    document.getElementById('error-result').innerHTML = `
        <div class="result-box correct">
            ✓ Found errors: "Welcom" → Welcome, "accont" → account, "continu" → continue
        </div>
    `;
    setTimeout(() => completeStep(true), 1500);
};

window.showRedirect = function() {
    document.getElementById('redirect-result').innerHTML = `
        <div class="result-box correct">
            ✓ Button redirects to: http://malicious-site.ru/steal.php
        </div>
    `;
    setTimeout(() => completeStep(true), 1500);
};

window.chooseAction = function(action) {
    const result = document.getElementById('action-result');
    if (action === 'report') {
        result.innerHTML = `<div class="result-box correct">✓ Correct! Always report and avoid suspicious sites.</div>`;
        setTimeout(() => completeStep(true), 1500);
    } else {
        result.innerHTML = `<div class="result-box wrong">✗ Wrong choice! Never enter details or ignore phishing.</div>`;
        completeStep(false);
    }
};

window.performAction = function(stepNum) {
    completeStep(true);
};

function createEmailSimulation(stepNum) {
    const sims = [
        `<div class="email-client">
            <div class="email-header-bar">
                <span class="email-subject">Account Verification Required</span>
                <span class="email-time">2 hours ago</span>
            </div>
            <div class="email-details">
                <div class="email-field"><strong>From:</strong> <input type="text" id="sender-input" value="support@paypa1.com" readonly></div>
                <div class="email-field"><strong>To:</strong> you@school.edu</div>
                <div class="email-field"><strong>Subject:</strong> Verify your PayPal account</div>
            </div>
            <div class="email-body">
                <p>Dear valued customer,</p>
                <p>We have detected unusual activity on your account. Please verify your identity immediately.</p>
            </div>
            <div class="analysis-panel">
                <h4>Email Analysis</h4>
                <label>What's wrong with the sender address?</label>
                <input type="text" id="sender-analysis" placeholder="Type what you notice...">
                <button onclick="analyzeSender()" class="inspect-btn">Submit Analysis</button>
                <div id="result"></div>
            </div>
        </div>`,
        
        `<div class="email-client">
            <div class="email-body" style="padding: 20px;">
                <p style="color: #dc3545; font-weight: bold; font-size: 18px;">⚠️ URGENT ACTION REQUIRED</p>
                <p>Your account will be <span style="background: yellow;">CLOSED IMMEDIATELY</span> if you don't respond within 24 hours!</p>
                <p>Click here NOW to prevent account suspension!</p>
            </div>
            <div class="analysis-panel">
                <h4>Identify Manipulation Tactics</h4>
                <label>Select all urgent/threatening phrases:</label>
                <div class="checkbox-group">
                    <label><input type="checkbox" value="urgent"> URGENT ACTION REQUIRED</label>
                    <label><input type="checkbox" value="closed"> CLOSED IMMEDIATELY</label>
                    <label><input type="checkbox" value="24hours"> within 24 hours</label>
                    <label><input type="checkbox" value="now"> Click here NOW</label>
                </div>
                <button onclick="checkUrgentPhrases()" class="inspect-btn">Verify Selection</button>
                <div id="result"></div>
            </div>
        </div>`,
        
        `<div class="email-client">
            <div class="email-body">
                <p>Please review the attached invoice.</p>
                <div class="attachment-box">
                    <div class="attachment-icon">📎</div>
                    <div class="attachment-info">
                        <div class="attachment-name">invoice_2024.zip</div>
                        <div class="attachment-size">2.4 MB</div>
                        <div class="attachment-type">Type: Compressed Archive</div>
                    </div>
                </div>
            </div>
            <div class="analysis-panel">
                <h4>Attachment Risk Assessment</h4>
                <label>Why is this attachment suspicious?</label>
                <select id="attachment-risk">
                    <option value="">Select reason...</option>
                    <option value="correct">Unexpected compressed file from unknown sender</option>
                    <option value="wrong1">File size is too large</option>
                    <option value="wrong2">Invoice files are always safe</option>
                </select>
                <button onclick="assessAttachment()" class="inspect-btn">Submit Assessment</button>
                <div id="result"></div>
            </div>
        </div>`,
        
        `<div class="email-client">
            <div class="email-body">
                <p>Please verify your account by clicking the link below:</p>
                <a href="#" id="suspicious-link" onmouseover="showLinkPreview()">Verify Account Now</a>
                <div id="link-preview" style="display:none; margin-top: 10px; padding: 10px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px;">
                    <strong>Link destination:</strong> http://paypa1-verify.suspicious-domain.ru/login.php
                </div>
            </div>
            <div class="analysis-panel">
                <h4>URL Analysis</h4>
                <label>Compare the link with official domain:</label>
                <div style="margin: 10px 0;">
                    <div><strong>This link:</strong> paypa1-verify.suspicious-domain.ru</div>
                    <div><strong>Official:</strong> paypal.com</div>
                </div>
                <label>What's the issue?</label>
                <textarea id="url-analysis" placeholder="Explain what makes this URL suspicious..."></textarea>
                <button onclick="analyzeURL()" class="inspect-btn">Submit Analysis</button>
                <div id="result"></div>
            </div>
        </div>`,
        
        `<div class="email-client">
            <div class="decision-panel">
                <h3>Incident Response Decision</h3>
                <p>You've identified this email as malicious. What actions should you take?</p>
                <div class="action-checklist">
                    <label><input type="checkbox" id="action1" value="report"> Report to IT Security</label>
                    <label><input type="checkbox" id="action2" value="delete"> Delete the email</label>
                    <label><input type="checkbox" id="action3" value="block"> Block the sender</label>
                    <label><input type="checkbox" id="action4" value="warn"> Warn colleagues</label>
                    <label><input type="checkbox" id="action5" value="click"> Click the link to investigate</label>
                </div>
                <button onclick="submitEmailActions()" class="inspect-btn">Submit Response Plan</button>
                <div id="result"></div>
            </div>
        </div>`
    ];
    return sims[stepNum];
}

function createPasswordSimulation(stepNum) {
    const sims = [
        `<div class="password-tester">
            <h4>Password Strength Analyzer</h4>
            <div class="test-password-box">
                <label>Test this password:</label>
                <input type="text" value="school123" id="weak-pass" readonly>
                <div class="password-metrics">
                    <div class="metric"><strong>Length:</strong> <span id="length1">9</span> characters</div>
                    <div class="metric"><strong>Uppercase:</strong> <span id="upper1" class="fail">✗ None</span></div>
                    <div class="metric"><strong>Numbers:</strong> <span id="num1" class="pass">✓ Yes</span></div>
                    <div class="metric"><strong>Symbols:</strong> <span id="sym1" class="fail">✗ None</span></div>
                </div>
            </div>
            <div class="analysis-panel">
                <label>How many characters should a strong password have?</label>
                <input type="number" id="min-chars" placeholder="Enter number">
                <button onclick="checkMinChars()" class="inspect-btn">Submit</button>
                <div id="result"></div>
            </div>
        </div>`,
        
        `<div class="password-tester">
            <h4>Create a Strong Password</h4>
            <div class="password-requirements">
                <p>Requirements:</p>
                <ul>
                    <li id="req-length">At least 12 characters</li>
                    <li id="req-upper">Contains uppercase letters</li>
                    <li id="req-lower">Contains lowercase letters</li>
                    <li id="req-number">Contains numbers</li>
                    <li id="req-symbol">Contains symbols (!@#$%)</li>
                </ul>
            </div>
            <div class="password-input-box">
                <label>Create your password:</label>
                <input type="text" id="user-password" placeholder="Type a strong password..." oninput="validatePassword()">
                <div class="strength-meter">
                    <div class="strength-bar" id="strength-bar"></div>
                </div>
                <div class="strength-text" id="strength-text">Strength: Weak</div>
            </div>
            <button onclick="submitPassword()" class="inspect-btn">Test Password</button>
            <div id="result"></div>
        </div>`,
        
        `<div class="password-tester">
            <h4>Password Reuse Scenario</h4>
            <div class="scenario-box">
                <p>You have accounts on:</p>
                <div class="account-list">
                    <div class="account-item">📧 Email: password123</div>
                    <div class="account-item">🏦 Bank: password123</div>
                    <div class="account-item">🛒 Shopping: password123</div>
                    <div class="account-item">📱 Social Media: password123</div>
                </div>
                <p class="warning-text">⚠️ One of these sites was hacked and passwords were leaked!</p>
            </div>
            <div class="analysis-panel">
                <label>What happens when you reuse passwords?</label>
                <textarea id="reuse-explanation" placeholder="Explain the risk..."></textarea>
                <button onclick="explainReuse()" class="inspect-btn">Submit Explanation</button>
                <div id="result"></div>
            </div>
        </div>`,
        
        `<div class="password-tester">
            <h4>Passphrase Builder</h4>
            <div class="passphrase-guide">
                <p>A passphrase combines multiple words with numbers and symbols</p>
                <p><strong>Example:</strong> Blue$Sky2024!Running</p>
            </div>
            <div class="passphrase-builder">
                <label>Build your passphrase:</label>
                <div class="builder-inputs">
                    <input type="text" id="word1" placeholder="Word 1" maxlength="15">
                    <input type="text" id="symbol1" placeholder="Symbol" maxlength="1">
                    <input type="text" id="word2" placeholder="Word 2" maxlength="15">
                    <input type="number" id="number1" placeholder="Number" maxlength="4">
                    <input type="text" id="symbol2" placeholder="Symbol" maxlength="1">
                </div>
                <div class="passphrase-preview">
                    <strong>Your passphrase:</strong> <span id="passphrase-result"></span>
                </div>
            </div>
            <button onclick="buildPassphrase()" class="inspect-btn">Create Passphrase</button>
            <div id="result"></div>
        </div>`,
        
        `<div class="password-tester">
            <h4>Password Storage Decision</h4>
            <div class="storage-options">
                <div class="storage-card" onclick="selectStorage('notes')">
                    <h5>📝 Write in Notes App</h5>
                    <p>Store passwords in phone notes</p>
                </div>
                <div class="storage-card" onclick="selectStorage('paper')">
                    <h5>📄 Write on Paper</h5>
                    <p>Keep passwords on sticky notes</p>
                </div>
                <div class="storage-card correct" onclick="selectStorage('manager')">
                    <h5>🔐 Password Manager</h5>
                    <p>Use encrypted password manager</p>
                </div>
                <div class="storage-card" onclick="selectStorage('browser')">
                    <h5>🌐 Browser Auto-Save</h5>
                    <p>Let browser remember passwords</p>
                </div>
            </div>
            <div id="result"></div>
        </div>`
    ];
    return sims[stepNum];
}

function createSocialMediaSimulation(stepNum) {
    const sims = [
        `<div class="social-feed">
            <div class="post-card">
                <div class="post-header">
                    <div class="user-avatar">JS</div>
                    <div class="user-info">
                        <strong>John Student</strong>
                        <span class="post-time">Just now</span>
                    </div>
                </div>
                <div class="post-content">
                    <p>Finally home alone! 🏠 Parents away for the weekend. My address is 123 Main Street if anyone wants to hang out!</p>
                </div>
            </div>
            <div class="analysis-panel">
                <h4>Privacy Risk Analysis</h4>
                <label>Identify ALL sensitive information in this post:</label>
                <div class="checkbox-group">
                    <label><input type="checkbox" value="home"> Home address revealed</label>
                    <label><input type="checkbox" value="alone"> Mentions being alone</label>
                    <label><input type="checkbox" value="parents"> Parents' absence disclosed</label>
                    <label><input type="checkbox" value="location"> Specific location shared</label>
                </div>
                <button onclick="analyzeSocialPost()" class="inspect-btn">Submit Analysis</button>
                <div id="result"></div>
            </div>
        </div>`,
        
        `<div class="social-feed">
            <div class="friend-request-card">
                <div class="request-header">Friend Request</div>
                <div class="request-profile">
                    <div class="profile-pic">?</div>
                    <div class="profile-info">
                        <h4>Sarah Johnson</h4>
                        <p class="mutual-friends">0 mutual friends</p>
                        <p class="profile-details">No profile picture • Account created 2 days ago</p>
                    </div>
                </div>
            </div>
            <div class="analysis-panel">
                <h4>Friend Request Evaluation</h4>
                <label>List red flags you notice:</label>
                <textarea id="friend-analysis" placeholder="Type all suspicious signs..."></textarea>
                <div class="decision-buttons">
                    <button onclick="decideFriendRequest('accept')" class="choice-btn danger">Accept Request</button>
                    <button onclick="decideFriendRequest('decline')" class="choice-btn success">Decline Request</button>
                </div>
                <div id="result"></div>
            </div>
        </div>`,
        
        `<div class="social-feed">
            <div class="post-card">
                <div class="post-header">
                    <div class="user-avatar">ME</div>
                    <div class="user-info">
                        <strong>You</strong>
                        <span class="post-time">Composing...</span>
                    </div>
                </div>
                <div class="post-composer">
                    <textarea id="user-post" placeholder="What's on your mind?">Just arrived at Central Mall! Shopping with friends 🛍️📍</textarea>
                    <div class="location-tag">📍 Central Mall, Downtown</div>
                </div>
            </div>
            <div class="analysis-panel">
                <h4>Live Location Risk</h4>
                <label>Why is posting live location dangerous?</label>
                <select id="location-risk">
                    <option value="">Select reason...</option>
                    <option value="correct">Reveals current whereabouts to strangers</option>
                    <option value="wrong1">Uses too much data</option>
                    <option value="wrong2">Makes friends jealous</option>
                    <option value="wrong3">Nothing wrong with it</option>
                </select>
                <button onclick="assessLocationPost()" class="inspect-btn">Submit Assessment</button>
                <div id="result"></div>
            </div>
        </div>`,
        
        `<div class="social-feed">
            <div class="settings-panel">
                <h4>Privacy Settings</h4>
                <div class="setting-item">
                    <label>Who can see your posts?</label>
                    <select id="post-privacy">
                        <option value="public">Everyone (Public)</option>
                        <option value="friends">Friends Only</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label>Who can see your profile?</label>
                    <select id="profile-privacy">
                        <option value="public">Everyone</option>
                        <option value="friends">Friends Only</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label>Who can send you friend requests?</label>
                    <select id="request-privacy">
                        <option value="everyone">Everyone</option>
                        <option value="friends">Friends of Friends</option>
                    </select>
                </div>
                <button onclick="applyPrivacySettings()" class="inspect-btn">Apply Settings</button>
                <div id="result"></div>
            </div>
        </div>`,
        
        `<div class="social-feed">
            <div class="post-card">
                <div class="post-composer">
                    <textarea id="draft-post" placeholder="Write your post..."></textarea>
                    <button onclick="checkBeforePost()" class="inspect-btn">Check Post Safety</button>
                </div>
            </div>
            <div class="safety-checklist">
                <h4>Before Posting Checklist</h4>
                <div class="checklist-items">
                    <label><input type="checkbox" id="check1"> Does it reveal personal information?</label>
                    <label><input type="checkbox" id="check2"> Does it show my location?</label>
                    <label><input type="checkbox" id="check3"> Could it be used against me?</label>
                    <label><input type="checkbox" id="check4"> Would I be okay with strangers seeing this?</label>
                    <label><input type="checkbox" id="check5"> Have I thought about consequences?</label>
                </div>
                <button onclick="submitChecklist()" class="inspect-btn">Complete Checklist</button>
                <div id="result"></div>
            </div>
        </div>`
    ];
    return sims[stepNum];
}

function createComputerHygieneSimulation(stepNum) {
    const sims = [
        `<div class="simulation-browser"><div class="browser-content"><p>Software Update Available</p><button onclick="updateSoftware()" class="choice-btn correct">Update Now</button><button onclick="updateSoftware()" class="choice-btn">Skip</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><p>Download: free_game_crack.exe</p><button onclick="deletePirated()" class="choice-btn correct">Delete File</button><button onclick="deletePirated()" class="choice-btn">Install It</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><button onclick="runScan()" class="inspect-btn">Run Antivirus Scan</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><p>Unknown USB device detected</p><button onclick="rejectUSB()" class="choice-btn correct">Reject</button><button onclick="rejectUSB()" class="choice-btn">Connect</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><button onclick="lockScreen()" class="inspect-btn">Lock Screen</button><div id="result"></div></div></div>`
    ];
    return sims[stepNum];
}

function createGiveawaySimulation(stepNum) {
    const sims = [
        `<div class="simulation-browser"><div class="browser-content"><h2>🎉 YOU WON $1000!</h2><button onclick="identifyPopup()" class="inspect-btn">Identify as Fake</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><p>Enter credit card to claim prize</p><button onclick="spotCardRequest()" class="inspect-btn">Spot Scam</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><div class="browser-url">http://amaz0n-giveaway.ru</div><button onclick="checkGiveawayURL()" class="inspect-btn">Check URL</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><p>⏰ Claim in 5 minutes!</p><button onclick="identifyTimer()" class="inspect-btn">Identify Urgency Trick</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><button onclick="closeScam()" class="choice-btn correct">Close and Report</button><button onclick="closeScam()" class="choice-btn">Click to Claim</button><div id="result"></div></div></div>`
    ];
    return sims[stepNum];
}

function createMalwareSimulation(stepNum) {
    const sims = [
        `<div class="simulation-browser"><div class="browser-content"><h2>⚠️ 47 VIRUSES DETECTED!</h2><button onclick="identifyFake()" class="inspect-btn">Identify as Fake</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><p>This alert is from: Browser popup</p><button onclick="checkSource()" class="inspect-btn">Check Source</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><button onclick="closeTaskManager()" class="choice-btn correct">Close via Task Manager</button><button onclick="closeTaskManager()" class="choice-btn">Click Clean Now</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><button onclick="runRealScan()" class="inspect-btn">Run Real Antivirus</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><button onclick="reportIT()" class="choice-btn correct">Report to IT</button><button onclick="reportIT()" class="choice-btn">Ignore</button><div id="result"></div></div></div>`
    ];
    return sims[stepNum];
}

function createCyberbullyingSimulation(stepNum) {
    const sims = [
        `<div class="simulation-browser"><div class="browser-content"><p>Message: "You're so stupid!" (repeated)</p><button onclick="identifyBullying()" class="inspect-btn">Identify as Bullying</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><button onclick="takeScreenshot()" class="inspect-btn">Take Screenshot</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><button onclick="blockBully()" class="choice-btn correct">Block User</button><button onclick="blockBully()" class="choice-btn">Reply Angrily</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><button onclick="reportBullying()" class="inspect-btn">Report Incident</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><h3>Best response?</h3><button onclick="talkAdult()" class="choice-btn correct">Talk to Trusted Adult</button><button onclick="talkAdult()" class="choice-btn">Keep it Secret</button><div id="result"></div></div></div>`
    ];
    return sims[stepNum];
}

function createFakeAppSimulation(stepNum) {
    const sims = [
        `<div class="simulation-browser"><div class="browser-content"><p>Developer: Unknown Dev</p><button onclick="checkDeveloper()" class="inspect-btn">Check Developer</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><p>Reviews: "Steals data!" "Malware!"</p><button onclick="readReviews()" class="inspect-btn">Read Reviews</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><p>Permissions: Location, Camera, Contacts</p><button onclick="checkPermissions()" class="inspect-btn">Check Permissions</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><p>Downloads: 50</p><button onclick="checkDownloads()" class="inspect-btn">Check Downloads</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><button onclick="avoidInstall()" class="choice-btn correct">Avoid Install</button><button onclick="avoidInstall()" class="choice-btn">Install Anyway</button><div id="result"></div></div></div>`
    ];
    return sims[stepNum];
}

function createGamingSimulation(stepNum) {
    const sims = [
        `<div class="simulation-browser"><div class="browser-content"><p>Free Skins Generator - Login Required</p><button onclick="identifySkinScam()" class="inspect-btn">Identify as Scam</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><p>Download: free_cheats.exe</p><button onclick="flagCheat()" class="inspect-btn">Flag as Malware</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><p>Stranger: "I'll give you free items!"</p><button onclick="markSuspicious()" class="inspect-btn">Mark Suspicious</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><button onclick="enable2FA()" class="inspect-btn">Enable 2FA</button><div id="result"></div></div></div>`,
        `<div class="simulation-browser"><div class="browser-content"><h3>Share gaming password?</h3><button onclick="neverShare()" class="choice-btn correct">Never Share</button><button onclick="neverShare()" class="choice-btn">Share with Friends</button><div id="result"></div></div></div>`
    ];
    return sims[stepNum];
}

// Simulation action handlers
window.analyzeSender = () => {
    const input = document.getElementById('sender-analysis').value.toLowerCase();
    const result = document.getElementById('result');
    if (input.includes('0') || input.includes('zero') || input.includes('paypa1') || input.includes('wrong') || input.includes('fake')) {
        result.innerHTML = '<div class="result-box correct">✓ Correct! The "1" instead of "l" in paypa1.com is a common phishing tactic</div>';
        setTimeout(() => completeStep(true), 2000);
    } else {
        result.innerHTML = '<div class="result-box wrong">✗ Look more carefully at the domain spelling</div>';
    }
};

window.checkUrgentPhrases = () => {
    const checkboxes = document.querySelectorAll('.checkbox-group input:checked');
    const result = document.getElementById('result');
    if (checkboxes.length >= 3) {
        result.innerHTML = '<div class="result-box correct">✓ Correct! These are all pressure tactics used by attackers</div>';
        setTimeout(() => completeStep(true), 2000);
    } else {
        result.innerHTML = '<div class="result-box wrong">✗ Select all urgent/threatening phrases</div>';
    }
};

window.assessAttachment = () => {
    const select = document.getElementById('attachment-risk').value;
    const result = document.getElementById('result');
    if (select === 'correct') {
        result.innerHTML = '<div class="result-box correct">✓ Correct! Unexpected compressed files from unknown senders are high risk</div>';
        setTimeout(() => completeStep(true), 2000);
    } else {
        result.innerHTML = '<div class="result-box wrong">✗ Think about why compressed files are dangerous</div>';
    }
};

window.showLinkPreview = () => {
    document.getElementById('link-preview').style.display = 'block';
};

window.analyzeURL = () => {
    const input = document.getElementById('url-analysis').value.toLowerCase();
    const result = document.getElementById('result');
    if (input.includes('domain') || input.includes('different') || input.includes('fake') || input.includes('suspicious') || input.includes('not paypal')) {
        result.innerHTML = '<div class="result-box correct">✓ Correct! The domain doesn\'t match the official PayPal domain</div>';
        setTimeout(() => completeStep(true), 2000);
    } else {
        result.innerHTML = '<div class="result-box wrong">✗ Compare the domains more carefully</div>';
    }
};

window.submitEmailActions = () => {
    const action1 = document.getElementById('action1').checked;
    const action2 = document.getElementById('action2').checked;
    const action3 = document.getElementById('action3').checked;
    const action5 = document.getElementById('action5').checked;
    const result = document.getElementById('result');
    
    if (action1 && action2 && action3 && !action5) {
        result.innerHTML = '<div class="result-box correct">✓ Perfect! Report, delete, and block. Never click suspicious links!</div>';
        setTimeout(() => completeStep(true), 2000);
    } else if (action5) {
        result.innerHTML = '<div class="result-box wrong">✗ Never click suspicious links! Uncheck that option.</div>';
    } else {
        result.innerHTML = '<div class="result-box wrong">✗ Make sure to report, delete, and block the sender</div>';
    }
};

window.checkMinChars = () => {
    const input = parseInt(document.getElementById('min-chars').value);
    const result = document.getElementById('result');
    if (input >= 12) {
        result.innerHTML = '<div class="result-box correct">✓ Correct! Strong passwords need at least 12 characters</div>';
        setTimeout(() => completeStep(true), 2000);
    } else {
        result.innerHTML = '<div class="result-box wrong">✗ Too short. Strong passwords need more characters</div>';
    }
};

window.validatePassword = () => {
    const pass = document.getElementById('user-password').value;
    const bar = document.getElementById('strength-bar');
    const text = document.getElementById('strength-text');
    let strength = 0;
    
    if (pass.length >= 12) { strength++; document.getElementById('req-length').style.color = '#28a745'; }
    if (/[A-Z]/.test(pass)) { strength++; document.getElementById('req-upper').style.color = '#28a745'; }
    if (/[a-z]/.test(pass)) { strength++; document.getElementById('req-lower').style.color = '#28a745'; }
    if (/[0-9]/.test(pass)) { strength++; document.getElementById('req-number').style.color = '#28a745'; }
    if (/[!@#$%^&*]/.test(pass)) { strength++; document.getElementById('req-symbol').style.color = '#28a745'; }
    
    bar.style.width = (strength * 20) + '%';
    if (strength <= 2) { bar.style.background = '#dc3545'; text.textContent = 'Strength: Weak'; }
    else if (strength <= 4) { bar.style.background = '#ffc107'; text.textContent = 'Strength: Medium'; }
    else { bar.style.background = '#28a745'; text.textContent = 'Strength: Strong'; }
};

window.submitPassword = () => {
    const pass = document.getElementById('user-password').value;
    const result = document.getElementById('result');
    const hasAll = pass.length >= 12 && /[A-Z]/.test(pass) && /[a-z]/.test(pass) && /[0-9]/.test(pass) && /[!@#$%^&*]/.test(pass);
    
    if (hasAll) {
        result.innerHTML = '<div class="result-box correct">✓ Excellent! This password meets all requirements</div>';
        setTimeout(() => completeStep(true), 2000);
    } else {
        result.innerHTML = '<div class="result-box wrong">✗ Password doesn\'t meet all requirements. Keep trying!</div>';
    }
};

window.explainReuse = () => {
    const input = document.getElementById('reuse-explanation').value.toLowerCase();
    const result = document.getElementById('result');
    if (input.includes('breach') || input.includes('hack') || input.includes('all') || input.includes('compromise') || input.includes('access')) {
        result.innerHTML = '<div class="result-box correct">✓ Correct! If one site is breached, all accounts are compromised</div>';
        setTimeout(() => completeStep(true), 2000);
    } else {
        result.innerHTML = '<div class="result-box wrong">✗ Think about what happens if one password is leaked</div>';
    }
};

window.buildPassphrase = () => {
    const w1 = document.getElementById('word1').value;
    const s1 = document.getElementById('symbol1').value;
    const w2 = document.getElementById('word2').value;
    const n1 = document.getElementById('number1').value;
    const s2 = document.getElementById('symbol2').value;
    const result = document.getElementById('result');
    
    if (w1 && s1 && w2 && n1 && s2) {
        const passphrase = w1 + s1 + w2 + n1 + s2;
        document.getElementById('passphrase-result').textContent = passphrase;
        result.innerHTML = '<div class="result-box correct">✓ Great passphrase! Long and memorable</div>';
        setTimeout(() => completeStep(true), 2000);
    } else {
        result.innerHTML = '<div class="result-box wrong">✗ Fill in all fields to create your passphrase</div>';
    }
};

window.selectStorage = (type) => {
    const result = document.getElementById('result');
    if (type === 'manager') {
        result.innerHTML = '<div class="result-box correct">✓ Correct! Password managers are encrypted and secure</div>';
        setTimeout(() => completeStep(true), 2000);
    } else {
        result.innerHTML = '<div class="result-box wrong">✗ This method is not secure. Try again!</div>';
    }
};

window.analyzeSocialPost = () => {
    const checks = document.querySelectorAll('.checkbox-group input:checked');
    const result = document.getElementById('result');
    if (checks.length >= 3) {
        result.innerHTML = '<div class="result-box correct">✓ Correct! This post reveals home address, being alone, and parents\' absence - all dangerous!</div>';
        setTimeout(() => completeStep(true), 2000);
    } else {
        result.innerHTML = '<div class="result-box wrong">✗ You missed some risks. Select all sensitive information</div>';
    }
};

window.decideFriendRequest = (action) => {
    const analysis = document.getElementById('friend-analysis').value.toLowerCase();
    const result = document.getElementById('result');
    if (action === 'decline' && analysis.length > 20) {
        result.innerHTML = '<div class="result-box correct">✓ Correct! No mutual friends, new account, no picture = suspicious</div>';
        setTimeout(() => completeStep(true), 2000);
    } else if (action === 'accept') {
        result.innerHTML = '<div class="result-box wrong">✗ Never accept requests from unknown people!</div>';
    } else {
        result.innerHTML = '<div class="result-box wrong">✗ Explain the red flags before deciding</div>';
    }
};

window.assessLocationPost = () => {
    const select = document.getElementById('location-risk').value;
    const result = document.getElementById('result');
    if (select === 'correct') {
        result.innerHTML = '<div class="result-box correct">✓ Correct! Live location reveals where you are right now to anyone</div>';
        setTimeout(() => completeStep(true), 2000);
    } else {
        result.innerHTML = '<div class="result-box wrong">✗ Think about safety, not convenience</div>';
    }
};

window.applyPrivacySettings = () => {
    const post = document.getElementById('post-privacy').value;
    const profile = document.getElementById('profile-privacy').value;
    const request = document.getElementById('request-privacy').value;
    const result = document.getElementById('result');
    
    if (post === 'friends' && profile === 'friends' && request === 'friends') {
        result.innerHTML = '<div class="result-box correct">✓ Perfect! All settings set to Friends Only for maximum privacy</div>';
        setTimeout(() => completeStep(true), 2000);
    } else {
        result.innerHTML = '<div class="result-box wrong">✗ Set all options to "Friends Only" for best privacy</div>';
    }
};

window.checkBeforePost = () => {
    const post = document.getElementById('draft-post').value;
    if (post.length < 10) {
        document.getElementById('result').innerHTML = '<div class="result-box wrong">✗ Write a post first to check its safety</div>';
        return;
    }
    document.getElementById('result').innerHTML = '<div class="result-box">Now complete the safety checklist below</div>';
};

window.submitChecklist = () => {
    const checks = [1,2,3,4,5].every(i => document.getElementById('check' + i).checked);
    const result = document.getElementById('result');
    if (checks) {
        result.innerHTML = '<div class="result-box correct">✓ Excellent! Always think before posting</div>';
        setTimeout(() => completeStep(true), 2000);
    } else {
        result.innerHTML = '<div class="result-box wrong">✗ Check all items before posting</div>';
    }
};

window.updateSoftware = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Updates patch vulnerabilities</div>'; setTimeout(() => completeStep(true), 1500); };
window.deletePirated = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Pirated software is not safe</div>'; setTimeout(() => completeStep(true), 1500); };
window.runScan = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Run antivirus weekly</div>'; setTimeout(() => completeStep(true), 1500); };
window.rejectUSB = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Never trust unknown USBs</div>'; setTimeout(() => completeStep(true), 1500); };
window.lockScreen = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Always lock your device to prevent unauthorized access</div>'; setTimeout(() => completeStep(true), 1500); };

window.identifyPopup = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Popups saying you won are usually fake</div>'; setTimeout(() => completeStep(true), 1500); };
window.spotCardRequest = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Giveaways should never ask for card details</div>'; setTimeout(() => completeStep(true), 1500); };
window.checkGiveawayURL = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Fake domains have misspellings or unusual endings</div>'; setTimeout(() => completeStep(true), 1500); };
window.identifyTimer = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Scammers add countdown timers to create urgency</div>'; setTimeout(() => completeStep(true), 1500); };
window.closeScam = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Close and report is the best action</div>'; setTimeout(() => completeStep(true), 1500); };

window.identifyFake = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Popups claiming viruses are often fake</div>'; setTimeout(() => completeStep(true), 1500); };
window.checkSource = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Real antivirus doesn\'t show random website alerts</div>'; setTimeout(() => completeStep(true), 1500); };
window.closeTaskManager = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Close suspicious popups safely via task manager</div>'; setTimeout(() => completeStep(true), 1500); };
window.runRealScan = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Use trusted antivirus software only</div>'; setTimeout(() => completeStep(true), 1500); };
window.reportIT = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Always report suspicious activity</div>'; setTimeout(() => completeStep(true), 1500); };

window.identifyBullying = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Repeated rude messages are bullying</div>'; setTimeout(() => completeStep(true), 1500); };
window.takeScreenshot = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Screenshots provide evidence</div>'; setTimeout(() => completeStep(true), 1500); };
window.blockBully = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Block the bully to prevent further harm</div>'; setTimeout(() => completeStep(true), 1500); };
window.reportBullying = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Use platform\'s report tool</div>'; setTimeout(() => completeStep(true), 1500); };
window.talkAdult = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Talk to a trusted adult</div>'; setTimeout(() => completeStep(true), 1500); };

window.checkDeveloper = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Real apps have verified developers</div>'; setTimeout(() => completeStep(true), 1500); };
window.readReviews = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Users reporting suspicious behavior is a warning</div>'; setTimeout(() => completeStep(true), 1500); };
window.checkPermissions = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Check permissions to avoid unnecessary access</div>'; setTimeout(() => completeStep(true), 1500); };
window.checkDownloads = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Low-download apps are not always safe</div>'; setTimeout(() => completeStep(true), 1500); };
window.avoidInstall = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Fake apps steal data or harm device</div>'; setTimeout(() => completeStep(true), 1500); };

window.identifySkinScam = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Fake skin generators steal accounts</div>'; setTimeout(() => completeStep(true), 1500); };
window.flagCheat = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Cheats are not safe - they often contain viruses</div>'; setTimeout(() => completeStep(true), 1500); };
window.markSuspicious = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Strangers offering gifts are not trustworthy</div>'; setTimeout(() => completeStep(true), 1500); };
window.enable2FA = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ 2FA is the best defense for gaming accounts</div>'; setTimeout(() => completeStep(true), 1500); };
window.neverShare = () => { document.getElementById('result').innerHTML = '<div class="result-box correct">✓ Never share game passwords</div>'; setTimeout(() => completeStep(true), 1500); };

export function showHint(text) {
    const modal = document.getElementById("hint-modal");
    const content = modal.querySelector(".hint-content");
    content.innerHTML = `<p>${text}</p>`;
    modal.classList.remove("hidden");
}

export function nextStep() {
    if (!currentLab || !currentLab.simulation) return;
    
    if (currentStep < currentLab.simulation.steps.length - 1) {
        currentStep++;
        renderSimulationStep(currentLab.simulation.steps[currentStep], currentLab.simulation.aiTutorPersona);
    } else {
        showFlashMessage('Lab completed! Answer the questions on the left.', 'success');
    }
}

export function previousStep() {
    if (!currentLab || !currentLab.simulation) return;
    
    if (currentStep > 0) {
        currentStep--;
        renderSimulationStep(currentLab.simulation.steps[currentStep], currentLab.simulation.aiTutorPersona);
    }
}

window.loadLabs = loadLabs;
window.startLab = startLab;
window.nextStep = nextStep;
window.previousStep = previousStep;
window.showHint = showHint;
window.completeStep = completeStep;
window.showStepHint = showStepHint;
window.checkAnswers = checkAnswers;
window.exitLab = exitLab;
window.finishLab = finishLab;

export default {
    loadLabs,
    startLab,
    nextStep,
    previousStep,
    showHint
};
