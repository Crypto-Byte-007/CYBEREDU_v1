import { auth } from "./auth.js";
import { showPage } from "./ui.js";
import { loadDashboard } from "./dashboard.js";
import { loadLabs } from "./labs.js";
import { showFlashMessage } from "./flash.js";
import { loadProfile } from "./profile.js";
import { loadReports } from "./reports.js";

window.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("accessToken");

    if (token) {
        showPage("dashboard-page");
        await loadDashboard();
    } else {
        showPage("landing-page");
        document.getElementById("main-navbar")?.classList.add("hidden");
    }
});

window.loadLabs = loadLabs;
