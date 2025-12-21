function setupModalListeners() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) this.style.display = "none";
        });
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            document.querySelectorAll(".modal").forEach(m => m.style.display = "none");
        }
    });
}

function showModal(id) {
    const m = document.getElementById(id);
    if (m) m.style.display = "flex";
}

export function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.style.display = "none";
}

function showCustomModal(title, content) {
    let modal = document.getElementById("custom-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "custom-modal";
        modal.className = "modal";
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="document.getElementById('custom-modal').style.display='none'">&times;</button>
                </div>
                <div id="custom-modal-content">${content}</div>
            </div>`;
        document.body.appendChild(modal);
    } else {
        modal.querySelector("h3").textContent = title;
        modal.querySelector("#custom-modal-content").innerHTML = content;
    }

    modal.style.display = "flex";
}