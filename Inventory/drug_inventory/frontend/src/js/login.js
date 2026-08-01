import { API_BASE_URL } from "./api.js";

// DOM Elements
const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePasswordBtn = document.getElementById("toggle-password");
const eyeIcon = document.getElementById("eye-icon");
const eyeOffIcon = document.getElementById("eye-off-icon");
const loginBtn = document.getElementById("login-btn");
const loginBtnText = document.getElementById("login-btn-text");
const loginSpinner = document.getElementById("login-spinner");
const loginArrow = document.getElementById("login-arrow");
const rememberMeCheckbox = document.getElementById("remember-me");
const toastContainer = document.getElementById("toast-container");

// Load remembered email
document.addEventListener("DOMContentLoaded", () => {
  const rememberedEmail = localStorage.getItem("rememberedEmail");
  if (rememberedEmail && emailInput && rememberMeCheckbox) {
    emailInput.value = rememberedEmail;
    rememberMeCheckbox.checked = true;
  }
});

// Toggle Password Visibility
if (togglePasswordBtn) {
  togglePasswordBtn.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    eyeIcon.classList.toggle("hidden");
    eyeOffIcon.classList.toggle("hidden");
  });
}

// Show Toast Notification
function showToast(message, type = "error") {
  if (!toastContainer) return alert(message);

  const toast = document.createElement("div");
  const bgColor = type === "error" ? "bg-red-500" : "bg-emerald-500";
  toast.className = `px-4 py-3 rounded-xl text-white text-sm font-medium shadow-lg transform transition-all duration-300 translate-x-full ${bgColor}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  // Animate in
  setTimeout(() => toast.classList.remove("translate-x-full"), 10);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.add("translate-x-full");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Handle Login Submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showToast("Please enter both email and password");
    return;
  }

  // Show loading state
  loginBtn.disabled = true;
  loginBtnText.textContent = "Signing In...";
  if (loginArrow) loginArrow.classList.add("hidden");
  if (loginSpinner) loginSpinner.classList.remove("hidden");

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to login");

    console.log("Login successful");

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Handle remember me
    if (rememberMeCheckbox && rememberMeCheckbox.checked) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    if (data.user && data.user.role) {
      redirectByRole(data.user.role);
    } else {
      showToast("Login successful but no role found.");
    }
  } catch (err) {
    console.error("Login error:", err);
    showToast(err.message);
  } finally {
    // Restore button state
    loginBtn.disabled = false;
    loginBtnText.textContent = "Sign In";
    if (loginArrow) loginArrow.classList.remove("hidden");
    if (loginSpinner) loginSpinner.classList.add("hidden");
  }
});

function redirectByRole(role) {
  const routes = {
    admin: "/src/pages/admin.html",
    manufacturer: "/src/pages/manufacturer.html",
    warehouse: "/src/pages/warehouse.html",
    warehouse_manager: "/src/pages/warehouse.html",
    vendor: "/src/pages/vendor.html",
    pharmacist: "/src/pages/pharmacy.html",
    pharmacy: "/src/pages/pharmacy.html"
  };

  const path = routes[role.toLowerCase()];
  if (path) {
    window.location.href = path;
  } else {
    showToast(`Unknown role: ${role}`);
  }
}
