import { connectSocket, socket } from "./socket.js"

// Keep socket logic if it's used globally
connectSocket()

socket.on("inventory_update", data => {
    console.log("LIVE UPDATE:", data)
})

// Auto-Router for dashboards that share logic (if any left) or just general init
document.addEventListener('DOMContentLoaded', () => {
    const title = document.title;
    console.log(`Loaded page: ${title}`);
});

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

// Basic Auth Check
if (!token || !user) {
    // If not on login page, redirect
    if (!window.location.pathname.includes('login.html')) {
        window.location.href = "/src/pages/login.html";
    }
}

const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/src/pages/login.html";
    });
}
