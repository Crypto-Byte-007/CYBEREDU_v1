import api from "./api.js";
import { showFlashMessage } from "./flash.js";

// ============================
// SECURE AUTH SESSION HANDLER
// ============================
export const auth = {
    user: null,

    isAuthenticated() {
        const token = localStorage.getItem("accessToken");
        return typeof token === "string" && token.length > 20;
    },

    // ============================
    // LOGIN
    // ============================
    async login() {
        try {
            const emailEl = document.getElementById("login-email");
            const passEl = document.getElementById("login-password");

            if (!emailEl || !passEl) {
                showFlashMessage("Login form error", "error");
                return;
            }

            const email = emailEl.value.trim();
            const password = passEl.value.trim();

            if (!email || !password) {
                showFlashMessage("Email and password required", "error");
                return;
            }

            const res = await api.post("/auth/login", { email, password });
            const data = res?.data || res;

            if (!data?.tokens?.accessToken || !data?.tokens?.refreshToken) {
                showFlashMessage("Authentication failed", "error");
                return;
            }

            // 🔐 Store tokens (XSS-safe only because innerHTML is fixed)
            localStorage.setItem("accessToken", data.tokens.accessToken);
            localStorage.setItem("refreshToken", data.tokens.refreshToken);
            localStorage.setItem("user", JSON.stringify(data.user));

            this.user = data.user;

            document.getElementById("main-navbar")?.classList.remove("hidden");

            window.showPage("dashboard-page");
            if (window.loadDashboard) await window.loadDashboard();

            showFlashMessage("Login successful", "success");
        } catch {
            showFlashMessage("Invalid email or password", "error");
        }
    },

    // ============================
    // SIGNUP
    // ============================
    async signup() {
        try {
            const nameEl = document.getElementById("signup-name");
            const emailEl = document.getElementById("signup-email");
            const passEl = document.getElementById("signup-password");
            const roleEl = document.getElementById("signup-role");

            if (!nameEl || !emailEl || !passEl || !roleEl) {
                showFlashMessage("Signup form error", "error");
                return;
            }

            const fullName = nameEl.value.trim();
            const email = emailEl.value.trim();
            const password = passEl.value.trim();
            const role = roleEl.value;

            if (!fullName || !email || !password) {
                showFlashMessage("All fields are required", "error");
                return;
            }

            const [firstName, ...rest] = fullName.split(" ");
            const lastName = rest.join(" ") || "User";

            await api.post("/auth/register", {
                firstName,
                lastName,
                email,
                password,
                role,
            });

            showFlashMessage("Account created. Please login.", "success");
            window.showPage("login-page");
        } catch {
            showFlashMessage("Signup failed", "error");
        }
    },

    // ============================
    // LOGOUT (HARDENED)
    // ============================
    async logout() {
        try {
            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                await api.post("/auth/logout", {
                    refreshToken,
                });
            }
        } catch {
            // silent fail — logout must always succeed client-side
        }

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        sessionStorage.clear();

        this.user = null;

        document.getElementById("main-navbar")?.classList.add("hidden");
        window.showPage("landing-page");

        showFlashMessage("Logged out successfully", "success");
    },
};

// ============================
// GLOBAL EXPORTS
// ============================
window.login = () => auth.login();
window.signup = () => auth.signup();
window.logout = () => auth.logout();
