const ROUTE_ROLES = {
    "dashboard-page": ["student", "instructor", "admin"],
    "mylabs-page": ["student", "instructor"],
    "admin-page": ["admin"],
    "reports-page": ["student", "instructor", "admin"],
    "profile-page": ["student", "instructor", "admin"],
    "notifications-page": ["student", "instructor", "admin"]
};

function enforceRoleGate(pageId) {
    const allowedRoles = ROUTE_ROLES[pageId];
    if (!allowedRoles) return true;

    const role = auth.getUser()?.role;

    if (!role || !allowedRoles.includes(role)) {
        toast("You do not have permission to access this page.", "error");
        showPage("dashboard-page");
        return false;
    }

    return true;
}