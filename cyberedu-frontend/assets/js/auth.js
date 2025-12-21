import api from "./api.js";
import { showFlashMessage } from "./flash.js";

// GLOBAL SESSION TRACKER
export const auth = {
    user: null,

    isAuthenticated() {
        return !!localStorage.getItem("accessToken");
    },

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

            window.showPage("dashboard-page");
            if (window.loadDashboard) await window.loadDashboard();
            showFlashMessage("Login successful!", "success");

        } catch (err) {
            showFlashMessage(err.message, "error");
        }
    },

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

            showFlashMessage("Account created!", "success");
            window.showPage("login-page");

        } catch (err) {
            showFlashMessage(err.message, "error");
        }
    },

    logout() {
        localStorage.clear();
        window.showPage("landing-page");
        document.getElementById("main-navbar")?.classList.add("hidden");
    }
};

// MAKE GLOBAL FOR INLINE HTML
window.login = (...args) => auth.login(...args);
window.signup = (...args) => auth.signup(...args);
window.logout = (...args) => auth.logout(...args);
