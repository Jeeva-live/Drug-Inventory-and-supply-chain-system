import { apiRequest } from "./api.js";
import { protectPage, logout as authLogout } from "./auth.js";
import { showToast } from "./utils.js";

protectPage(['admin']);


// Global state
let users = [];
let currentPage = 1;
const itemsPerPage = 10;
let currentFilters = {
  role: '',
  location: '',
  status: ''
};

// Init
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await Promise.all([
      fetchStats(),
      fetchUsers(),
      fetchSettings()
    ]);

    setupEventListeners();
    console.log("Admin Dashboard Initialized");
  } catch (err) {
    console.error("Init Error:", err);
    showToast(err.message || "Failed to load dashboard data", 'error');
  }
});

// --- API Calls ---

async function fetchStats() {
  try {
    const stats = await apiRequest('/stats/admin');
    updateStatsCards(stats);
  } catch (err) {
    console.error("Stats Error:", err);
  }
}

async function fetchUsers() {
  try {
    let query = `?page=${currentPage}&limit=${itemsPerPage}`;
    if (currentFilters.role) query += `&role=${currentFilters.role}`;
    if (currentFilters.location) query += `&location=${currentFilters.location}`;
    if (currentFilters.status) query += `&status=${currentFilters.status}`;

    const data = await apiRequest(`/users${query}`);
    users = data.users || [];

    // Populate Location Filters if needed
    const locationSelect = document.getElementById('filter-location');
    if (locationSelect && locationSelect.children.length <= 1 && data.locations) {
      data.locations.forEach(loc => {
        if (!loc) return;
        const opt = document.createElement('option');
        opt.value = loc;
        opt.textContent = loc;
        locationSelect.appendChild(opt);
      });
    }

    renderUsers(data);
  } catch (err) {
    console.error("Users Error:", err);
    showToast(err.message || "Failed to fetch users", 'error');
  }
}

async function fetchSettings() {
  try {
    const settings = await apiRequest('/settings');

    // Update UI toggles/inputs
    if (settings.lowStockThreshold !== undefined) {
      const lowStockEl = document.getElementById('low-stock-threshold');
      if (lowStockEl) lowStockEl.value = settings.lowStockThreshold;
    }
    if (settings.expiryAlertDays !== undefined) {
      const expiryEl = document.getElementById('expiry-alert-days');
      if (expiryEl) expiryEl.value = settings.expiryAlertDays;
    }
    if (settings.aiMode !== undefined) {
      const aiToggle = document.getElementById('ai-toggle');
      if (aiToggle) aiToggle.checked = settings.aiMode;
    }

    // Update Role Permissions checkboxes
    if (settings.rolePermissions) {
      const permissionMatrix = document.getElementById('permissions-matrix');
      if (permissionMatrix) {
        const checkboxes = permissionMatrix.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
          const role = cb.getAttribute('data-role');
          const action = cb.getAttribute('data-action');
          if (settings.rolePermissions[role] && settings.rolePermissions[role][action] !== undefined) {
            cb.checked = settings.rolePermissions[role][action];
          }
        });
      }
    }
  } catch (err) {
    console.error("Settings Error:", err);
  }
}

// --- UI Updates ---

function updateStatsCards(stats) {
  // Helper to update card value
  const updateCard = (titleId, value) => {
    const titleEl = document.getElementById(titleId);
    if (titleEl && titleEl.nextElementSibling) {
      titleEl.nextElementSibling.textContent = value.toLocaleString();
    }
  };

  updateCard('users-card-title', stats.users || 0);
  updateCard('manufacturers-card-title', stats.manufacturers || 0);
  updateCard('warehouses-card-title', stats.warehouses || 0);
  updateCard('pharmacies-card-title', stats.pharmacies || 0);
  updateCard('vendors-card-title', stats.vendors || 0);
}

function renderUsers(data = { totalUsers: 0, totalPages: 1 }) {
  const tbody = document.querySelector('tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  // Update Counts
  setText('visible-users-count', users.length);
  setText('total-users-count', data.totalUsers);

  // Paginate
  const totalPages = data.totalPages || 1;
  setText('total-pages', totalPages);
  setText('current-page', currentPage);

  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  if (prevBtn) prevBtn.disabled = currentPage === 1;
  if (nextBtn) nextBtn.disabled = currentPage === totalPages;

  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.className = 'table-row';
    tr.innerHTML = `
      <td style="padding:10px 16px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:30px;height:30px;border-radius:7px;background:var(--bg-3);display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;color:var(--t1);flex-shrink:0;">
            ${getInitials(user.name)}
          </div>
          <span style="font-size:0.82rem;font-weight:500;color:var(--t1);">${user.name}</span>
        </div>
      </td>
      <td style="padding:10px 16px;font-size:0.8rem;color:var(--t2);">${user.email}</td>
      <td style="padding:10px 16px;">
        <span class="badge badge-blue">${capitalize(user.role)}</span>
      </td>
      <td style="padding:10px 16px;font-size:0.8rem;color:var(--t2);">${user.location || '—'}</td>
      <td style="padding:10px 16px;">
        <span class="badge ${user.status === 'active' ? 'badge-green' : 'badge-amber'}">${capitalize(user.status)}</span>
      </td>
      <td style="padding:10px 16px;">
        <div style="display:flex;align-items:center;gap:4px;">
          <button onclick="window.editUser('${user._id}')" class="icon-btn" title="Edit">
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
          </button>
          <button onclick="window.deleteUser('${user._id}')" class="icon-btn" title="Delete" style="color:var(--danger);">
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
          </button>
        </div>
      </td>`;
    tbody.appendChild(tr);
  });
}

// --- Event Handlers & Helpers ---

function setupEventListeners() {
  // Modal Toggles
  window.openAddUserModal = () => {
    const modal = document.getElementById('add-user-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };
  window.closeAddUserModal = () => {
    const modal = document.getElementById('add-user-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.getElementById('add-user-form').reset();
  };

  // Filter Changes
  window.applyFilters = () => {
    currentFilters.role = document.getElementById('filter-role').value;
    currentFilters.location = document.getElementById('filter-location').value;
    currentFilters.status = document.getElementById('filter-status').value;
    currentPage = 1;
    fetchUsers();
  };

  window.clearFilters = () => {
    document.getElementById('filter-role').value = '';
    document.getElementById('filter-location').value = '';
    document.getElementById('filter-status').value = '';
    currentFilters = { role: '', location: '', status: '' };
    currentPage = 1;
    fetchUsers();
  };

  // Pagination
  window.nextPage = () => {
    currentPage++;
    fetchUsers();
  };
  window.previousPage = () => {
    if (currentPage > 1) {
      currentPage--;
      fetchUsers();
    }
  };

  // Form Submit for Add User
  const form = document.getElementById('add-user-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Saving...';
      submitBtn.disabled = true;

      try {
        const newUser = {
          name: document.getElementById('user-name').value,
          email: document.getElementById('user-email').value,
          role: document.getElementById('user-role').value.toLowerCase(),
          location: document.getElementById('user-location').value,
          status: document.getElementById('user-status').value.toLowerCase() || 'active'
        };

        await apiRequest('/users', 'POST', newUser);

        showToast('User added successfully!');
        window.closeAddUserModal();
        fetchUsers(); // Refresh list
        fetchStats(); // Refresh stats
      } catch (err) {
        console.error(err);
        showToast(err.message || 'Error adding user', 'error');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Form Submit for Edit User
  const editForm = document.getElementById('edit-user-form');
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = editForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Saving...';
      submitBtn.disabled = true;

      try {
        const id = document.getElementById('edit-user-id').value;
        const updatedUser = {
          name: document.getElementById('edit-user-name').value,
          email: document.getElementById('edit-user-email').value,
          role: document.getElementById('edit-user-role').value.toLowerCase(),
          location: document.getElementById('edit-user-location').value,
          status: document.getElementById('edit-user-status').value.toLowerCase()
        };

        await apiRequest(`/users/${id}`, 'PUT', updatedUser);

        showToast('User updated successfully!');
        window.closeEditUserModal();
        fetchUsers(); // Refresh list
      } catch (err) {
        console.error(err);
        showToast(err.message || 'Error updating user', 'error');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Settings Headers
  window.saveThreshold = async (type) => {
    try {
      let updateData = {};
      if (type === 'low-stock') {
        updateData.lowStockThreshold = parseInt(document.getElementById('low-stock-threshold').value, 10);
      } else if (type === 'expiry') {
        updateData.expiryAlertDays = parseInt(document.getElementById('expiry-alert-days').value, 10);
      }

      await apiRequest('/settings', 'PUT', updateData);
      showToast(`${type.replace('-', ' ')} settings saved!`);
    } catch (err) {
      showToast('Failed to update settings', 'error');
    }
  };

  // AI Toggle
  const aiToggle = document.getElementById('ai-toggle');
  if (aiToggle) {
    aiToggle.addEventListener('change', async (e) => {
      try {
        await apiRequest('/settings', 'PUT', { aiMode: e.target.checked });
        showToast(`AI Mode ${e.target.checked ? 'Enabled' : 'Disabled'}`);
      } catch (err) {
        showToast('Failed to update settings', 'error');
        e.target.checked = !e.target.checked; // Revert
      }
    });
  }

  // Role Permissions Auto-Save
  const permissionMatrix = document.getElementById('permissions-matrix');
  if (permissionMatrix) {
    permissionMatrix.addEventListener('change', async (e) => {
      if (e.target.type === 'checkbox') {
        const role = e.target.getAttribute('data-role');
        const action = e.target.getAttribute('data-action');
        const isGranted = e.target.checked;

        try {
          const currentSettings = await apiRequest('/settings');
          let perms = currentSettings.rolePermissions || {};
          if (!perms[role]) perms[role] = {};
          perms[role][action] = isGranted;

          await apiRequest('/settings', 'PUT', { rolePermissions: perms });
          showToast(`Permission updated for ${role}`);
        } catch (err) {
          showToast('Failed to update permission', 'error');
          e.target.checked = !isGranted; // revert
        }
      }
    });
  }

  // User Actions
  window.deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    // Optimistic UI Update
    const userIndex = users.findIndex(u => u._id === id);
    if (userIndex === -1) return;

    const userToRestore = users[userIndex];
    users.splice(userIndex, 1);
    renderUsers({ totalUsers: Math.max(0, parseInt(document.getElementById('total-users-count').textContent) - 1), totalPages: parseInt(document.getElementById('total-pages').textContent) });

    try {
      await apiRequest(`/users/${id}`, 'DELETE');
      showToast('User deleted successfully');
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to delete user', 'error');
      // Revert Optimistic Update
      users.splice(userIndex, 0, userToRestore);
      renderUsers({ totalUsers: parseInt(document.getElementById('total-users-count').textContent) + 1, totalPages: parseInt(document.getElementById('total-pages').textContent) });
    }
  };

  window.editUser = (id) => {
    const user = users.find(u => u._id === id);
    if (!user) return;

    document.getElementById('edit-user-id').value = id;
    document.getElementById('edit-user-name').value = user.name || '';
    document.getElementById('edit-user-email').value = user.email || '';
    document.getElementById('edit-user-role').value = user.role.toLowerCase() || 'admin';
    document.getElementById('edit-user-location').value = user.location || '';
    document.getElementById('edit-user-status').value = capitalize(user.status || 'active');

    const modal = document.getElementById('edit-user-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  window.closeEditUserModal = () => {
    const modal = document.getElementById('edit-user-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.getElementById('edit-user-form').reset();
  };

  // Notifications and Logout
  window.toggleNotifications = () => {
    document.getElementById('notification-panel').classList.toggle('hidden');
  };

  window.logout = authLogout;
}

// Helpers
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function capitalize(str) {
  if (!str) return '';
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function getStatusClass(status) {
  return status === 'active' ? 'badge-green' : 'badge-amber';
}

function getStatusDotClass(status) {
  return status === 'active' ? '#059669' : '#d97706';
}
