function loadLabTheory(labId) {
    const box = document.getElementById("lab-specific-theory");

    if (labId === "phishing") {
        box.innerHTML = `
            <h3>Phishing Investigation Theory</h3>
            <p>Learn to analyze suspicious emails and identify malicious indicators.</p>
        `;
    }

    if (labId === "ransomware") {
        box.innerHTML = `
            <h3>Ransomware Response Theory</h3>
            <p>Understand containment, eradication, and recovery processes.</p>
        `;
    }
}