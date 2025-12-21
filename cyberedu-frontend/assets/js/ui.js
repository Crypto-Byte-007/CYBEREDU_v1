// =========================
// UI + ROUTER CONTROLLER
// =========================

import { state } from "./state.js";

export function showPage(pageId) {
    document.querySelectorAll(".page-container")
        .forEach(p => p.classList.remove("active"));

    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add("active");
        state.currentPage = pageId;
    }

    const navbar = document.getElementById("main-navbar");
    const publicPages = ["landing-page", "login-page", "register-page"];
    
    if (navbar) {
        if (publicPages.includes(pageId)) {
            navbar.classList.add("hidden");
        } else {
            navbar.classList.remove("hidden");
        }
    }

    if (pageId === "mylabs-page" && window.loadLabs) {
        window.loadLabs();
    }
    
    if (pageId === "profile-page" && window.loadProfile) {
        window.loadProfile();
    }
    
    if (pageId === "reports-page" && window.loadReports) {
        window.loadReports();
    }
    
    if (pageId === "leaderboard-page" && window.loadLeaderboard) {
        window.loadLeaderboard();
    }
}

window.showPage = showPage;
