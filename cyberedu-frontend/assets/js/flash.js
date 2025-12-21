export function showFlashMessage(msg, type = "info") {
    const container = document.getElementById("flash-message-container") || document.body;
    const div = document.createElement("div");
    div.className = `flash flash-${type}`;
    div.innerText = msg;

    container.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

window.showFlashMessage = showFlashMessage;
