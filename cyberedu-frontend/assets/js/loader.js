function showGlobalLoader(text = "Loading...") {
    const el = document.getElementById("global-loader");
    if (el) {
        const textEl = el.querySelector(".loader-text");
        if (textEl) textEl.textContent = text;
        el.style.display = "flex";
    }
}

function hideGlobalLoader() {
    const el = document.getElementById("global-loader");
    if (el) {
        el.style.display = "none";
    }
}