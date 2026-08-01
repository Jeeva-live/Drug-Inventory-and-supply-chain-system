export function protectPage(allowedRoles) {
  const token = localStorage.getItem("token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    console.error("Failed to parse user from localStorage");
  }

  if (!token || !user) {
    window.location.href = "/src/pages/login.html";
    return;
  }

  // If roles array provided and user role not in it, block access.
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    window.location.href = "/src/pages/login.html";
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/src/pages/login.html";
}
