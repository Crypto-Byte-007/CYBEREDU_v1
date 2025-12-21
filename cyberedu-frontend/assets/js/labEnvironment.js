function loadLabEnvironment(labId) {
    const env = document.getElementById("lab-environment");

    if (labId === "phishing") {
        env.innerHTML = `
            <div class="terminal">
                <p>$ analyze_email</p>
                <p>Email analysis complete. Suspicious indicators found.</p>
            </div>
        `;
    }
}

function runCommand(cmd) {
    const term = document.getElementById("lab-terminal");

    const result = {
        analyze_email: "Headers analyzed. SPF/DKIM/DMARC failed.",
        extract_iocs: "Extracted 5 IOCs.",
        generate_report: "Report generated."
    };

    term.innerHTML += `
        <p>$ ${cmd}</p>
        <p>${result[cmd] || "Unknown command"}</p>
    `;

    showFlashMessage("Command executed", "info");
}