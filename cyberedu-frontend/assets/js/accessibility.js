// Accessibility Enhancement Layer
function enableHighContrast() {
    document.body.classList.add("high-contrast");
    localStorage.setItem('accessibility_high_contrast', 'true');
}

function disableHighContrast() {
    document.body.classList.remove("high-contrast");
    localStorage.removeItem('accessibility_high_contrast');
}

function enableFontScaling(multiplier = 1.2) {
    document.documentElement.style.fontSize = `${multiplier}rem`;
    localStorage.setItem('accessibility_font_scale', multiplier);
}

function enableKeyboardFocus() {
    document.body.classList.add("keyboard-focus");
    localStorage.setItem('accessibility_keyboard_focus', 'true');
}

function enableScreenReader() {
    // Add ARIA labels and descriptions
    document.querySelectorAll('button').forEach(btn => {
        if (!btn.getAttribute('aria-label')) {
            btn.setAttribute('aria-label', btn.textContent || 'Button');
        }
    });
    
    document.querySelectorAll('input').forEach(input => {
        if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
            const label = input.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                input.setAttribute('aria-labelledby', label.id || 'label-' + Date.now());
            }
        }
    });
}

function initAccessibility() {
    // Load saved preferences
    if (localStorage.getItem('accessibility_high_contrast')) {
        enableHighContrast();
    }
    
    const fontScale = localStorage.getItem('accessibility_font_scale');
    if (fontScale) {
        enableFontScaling(parseFloat(fontScale));
    }
    
    if (localStorage.getItem('accessibility_keyboard_focus')) {
        enableKeyboardFocus();
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-focus');
        }
        
        // ESC to close modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
    
    // Add focus indicators
    enableScreenReader();
}

// Accessibility settings panel
function showAccessibilityPanel() {
    const panel = document.createElement('div');
    panel.className = 'accessibility-panel';
    panel.innerHTML = `
        <div class="panel-content">
            <h3>Accessibility Settings</h3>
            <label>
                <input type="checkbox" id="high-contrast-toggle"> High Contrast
            </label>
            <label>
                <input type="range" id="font-scale" min="1" max="2" step="0.1" value="1"> Font Size
            </label>
            <label>
                <input type="checkbox" id="keyboard-focus-toggle"> Keyboard Focus
            </label>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // Wire up controls
    panel.querySelector('#high-contrast-toggle').onchange = (e) => {
        e.target.checked ? enableHighContrast() : disableHighContrast();
    };
    
    panel.querySelector('#font-scale').oninput = (e) => {
        enableFontScaling(e.target.value);
    };
    
    panel.querySelector('#keyboard-focus-toggle').onchange = (e) => {
        e.target.checked ? enableKeyboardFocus() : document.body.classList.remove('keyboard-focus');
    };
}