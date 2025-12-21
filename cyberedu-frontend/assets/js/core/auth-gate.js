import { auth } from "./auth.js";
import { showPage } from "./ui.js";

// Hard delay to ensure localStorage is fully written
const AUTH_GATE_DELAY = 800; 

// Pages that do NOT require login
const publicPages = new Set([
    "landing-page",
    "login-page",
    "register-page"
]);

function getCurrentRoute() {
    const hash = window.location.hash.replace("#", "");
    return hash || "landing-page";
}

export function runAuthGate() {
    setTimeout(() => {
        const route = getCurrentRoute();
        const token = auth.getAccessToken();

        if (!token && !publicPages.has(route)) {
            console.warn("⚠ No session found. Redirecting to login.");
            window.location.hash = "#login-page";
            showPage("login-page");
            return;
        }

        if (token) {
            document.getElementById("main-navbar").classList.remove("hidden");
        }

        showPage(route);
    }, AUTH_GATE_DELAY);
}

// Auto-run
runAuthGate();
