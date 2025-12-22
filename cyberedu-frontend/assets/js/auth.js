import api from "./api.js";
import { showFlashMessage } from "./flash.js";

// ============================
// GLOBAL SESSION TRACKER
// ============================
export const auth = {
    user: null,

    isAuthenticated() {
        return !!localStorage.getItem("accessToken");
    },

    // ============================
    // LOGIN
    // ============================
    async login() {
        try {
            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value.trim();

            const res = await api.post("/auth/login", { email, password });
            const data = res.data || res;

            const tokens = data.tokens;
            const user = data.user;

            if (!tokens || !tokens.accessToken) {
                showFlashMessage("Invalid login response", "error");
                return;
            }

            localStorage.setItem("accessToken", tokens.accessToken);
            localStorage.setItem("refreshToken", tokens.refreshToken);
            localStorage.setItem("user", JSON.stringify(user));

            this.user = user;

            // Show navbar after login
            document.getElementById("main-navbar")?.classList.remove("hidden");

            window.showPage("dashboard-page");
            if (window.loadDashboard) await window.loadDashboard();

            showFlashMessage("Login successful!", "success");
        } catch (err) {
            showFlashMessage(err.message || "Login failed", "error");
        }
    },

    // ============================
    // SIGNUP
    // ============================
    async signup() {
        try {
            const fullName = document.getElementById("signup-name").value.trim();
            const email = document.getElementById("signup-email").value.trim();
            const password = document.getElementById("signup-password").value.trim();
            const role = document.getElementById("signup-role").value;

            const [firstName, ...rest] = fullName.split(" ");
            const lastName = rest.join(" ") || "User";

            await api.post("/auth/register", {
                firstName,
                lastName,
                email,
                password,
                role,
            });

            showFlashMessage("Account created! Please login.", "success");
            window.showPage("login-page");
        } catch (err) {
            showFlashMessage(err.message || "Signup failed", "error");
        }
    },

    // ============================
    // LOGOUT (FIXED & SECURE)
    // ============================
    async logout() {
        try {
            const refreshToken = localStorage.getItem("refreshToken");

            // Inform backend to invalidate refresh token
            if (refreshToken) {
                await api.post(
                    "/auth/logout",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    }
                );
            }
        } catch (err) {
            console.warn("Backend logout failed, proceeding locally");
        }

        // Clear session data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        sessionStorage.clear();

        this.user = null;

        // Hide navbar after logout
        document.getElementById("main-navbar")?.classList.add("hidden");

        // Redirect to landing / login
        window.showPage("landing-page");

        showFlashMessage("Logged out successfully", "success");
    },
};

// ============================
// MAKE GLOBAL FOR INLINE HTML
// ============================
window.login = (...args) => auth.login(...args);
window.signup = (...args) => auth.signup(...args);
window.logout = (...args) => auth.logout(...args);
