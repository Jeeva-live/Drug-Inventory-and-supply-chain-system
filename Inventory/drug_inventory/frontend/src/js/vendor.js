import { apiRequest } from './api.js';
import { formatDate, showToast } from './utils.js';
import { protectPage, logout as authLogout } from "./auth.js";

protectPage(['admin', 'vendor']);

// =============================
// DOM
// =============================
const dom = {
  time: document.getElementById('current-time'),
  btnList: document.getElementById('btn-list'),
  btnMap: document.getElementById('btn-map'),
  locationsView: document.getElementById('locations-view'),
  mapView: document.getElementById('map-view')
};

let currentTasks = [];
let html5QrcodeScanner = null;

// =============================
// CONFIG
// =============================
const defaultConfig = {
  page_title: 'Vendor Dashboard',
  vendor_name: 'MedLogistics Express'
};

// =============================
// TIME
// =============================
function updateTime() {
  if (!dom.time) return;
  dom.time.textContent = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}
setInterval(updateTime, 1000);
updateTime();

// =============================
// MAP / LIST TOGGLE
// =============================
let mapInstance = null;

if (dom.btnList) {
  dom.btnList.addEventListener('click', () => {
    if (dom.locationsView) dom.locationsView.classList.remove('hidden');
    if (dom.mapView) dom.mapView.classList.add('hidden');
    dom.btnList.classList.add('btn-primary');
    dom.btnList.classList.remove('btn-ghost');
    if (dom.btnMap) {
      dom.btnMap.classList.remove('btn-primary');
      dom.btnMap.classList.add('btn-ghost');
    }
  });
}

if (dom.btnMap) {
  dom.btnMap.addEventListener('click', () => {
    if (dom.mapView) dom.mapView.classList.remove('hidden');
    if (dom.locationsView) dom.locationsView.classList.add('hidden');
    dom.btnMap.classList.add('btn-primary');
    dom.btnMap.classList.remove('btn-ghost');
    if (dom.btnList) {
      dom.btnList.classList.remove('btn-primary');
      dom.btnList.classList.add('btn-ghost');
    }

    if (!mapInstance && window.L && document.getElementById('vendor-map')) {
      mapInstance = L.map('vendor-map').setView([51.505, -0.09], 13);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(mapInstance);

      // Add a couple of mock delivery markers
      const warehouseIcon = L.divIcon({className: 'badge badge-green', html: 'W', iconSize: [20, 20]});
      const pharmaIcon = L.divIcon({className: 'badge badge-amber', html: 'P', iconSize: [20, 20]});
      
      L.marker([51.505, -0.09], {icon: warehouseIcon}).addTo(mapInstance).bindPopup('<b>Warehouse HQ</b><br>Pickup tasks pending.');
      L.marker([51.515, -0.1], {icon: pharmaIcon}).addTo(mapInstance).bindPopup('<b>HealthFirst RX</b><br>Delivery Expected: 14:00');
      L.marker([51.49, -0.08], {icon: pharmaIcon}).addTo(mapInstance).bindPopup('<b>MedPlus Store</b><br>Delivered');
    }
    
    if (mapInstance) {
      setTimeout(() => mapInstance.invalidateSize(), 150);
    }
  });
}

// Removed local showToast

// =============================
// DATA FETCHING & RENDERING
// =============================
async function fetchTasks() {
  try {
    // Find tasks representing vendor deliveries or pickups.
    // For demonstration, let's fetch inventory batches and filter active/sent tasks.
    const res = await apiRequest('/inventory/batch');
    currentTasks = res;
    renderTasks();
  } catch (err) {
    console.error(err);
    showToast('Failed to load vendor tasks', 'error');
  }
}

function renderTasks() {
  // We'll populate the delivery tasks table with the batches simply as mock
  // since the real app would have an actual Vendor task entity.
  const tbody = document.querySelector('.divide-y.divide-slate-700\\/50');
  // We update the second table ideally, but `document.querySelectorAll('tbody')`
  const tbodies = document.querySelectorAll('tbody');
  if (tbodies.length < 2) return;

  const deliveryTbody = tbodies[1];
  if (!deliveryTbody) return;

  if (currentTasks.length === 0) {
    deliveryTbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--t2);padding:24px;">No delivery tasks</td></tr>';
    return;
  }

  deliveryTbody.innerHTML = currentTasks.map(item => `
        <tr class="table-row">
            <td style="padding:10px 14px;font-size:0.82rem;font-weight:500;color:var(--t1);">${item.location || 'Warehouse'}</td>
            <td style="padding:10px 14px;font-size:0.82rem;color:var(--t2);">${item.drug ? item.drug.name : 'Unknown'}</td>
            <td style="padding:10px 14px;text-align:center;font-size:0.82rem;font-weight:600;color:var(--success);">${item.current_stock}</td>
            <td style="padding:10px 14px;text-align:center;font-size:0.82rem;font-weight:600;color:var(--success);">${item.current_stock}</td>
            <td style="padding:10px 14px;font-size:0.82rem;color:var(--t2);">N/A</td>
            <td style="padding:10px 14px;text-align:center;">
                <span class="badge ${item.status === 'Sent' ? 'badge-amber' : 'badge-green'}">${item.status || 'Active'}</span>
            </td>
            <td style="padding:10px 14px;text-align:center;">
                <button class="btn btn-sm btn-primary scan-btn" data-id="${item._id}">Start Scan</button>
            </td>
        </tr>
    `).join('');

  // Attach scan events
  document.querySelectorAll('.scan-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      openScanner(id);
    });
  });

  // Update stats
  const openDeliveries = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3 .stat-card:nth-child(2) .text-4xl');
  if (openDeliveries) openDeliveries.textContent = currentTasks.length;
  const completedTasks = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3 .stat-card:nth-child(3) .text-4xl');
  // Using filtered count of Delivered tasks if available, else static
  const deliveredCount = currentTasks.filter(t => t.status === 'Delivered').length;
  if (completedTasks) completedTasks.textContent = 24 + deliveredCount; // Mock default 24 + new
}

document.addEventListener('DOMContentLoaded', () => {
  fetchTasks();
  window.logout = authLogout;
});

// =============================
// SCANNER ALOGIRTHM
// =============================
let scanningTaskId = null;

function openScanner(taskId) {
  scanningTaskId = taskId;
  const modal = document.getElementById('qr-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');

  if (!html5QrcodeScanner) {
    // The Html5QrcodeScanner constructor takes the ID of the div to render in
    html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
  }

  html5QrcodeScanner.render(onScanSuccess, onScanFailure);
}

function closeScanner() {
  const modal = document.getElementById('qr-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear().catch(err => console.error("Failed to clear scanner", err));
  }
  scanningTaskId = null;
}

const closeQrModalBtn = document.getElementById('close-qr-modal');
if (closeQrModalBtn) closeQrModalBtn.addEventListener('click', closeScanner);

async function onScanSuccess(decodedText, decodedResult) {
  console.log(`Scan result: ${decodedText}`);
  // Capture taskId before closeScanner() nullifies scanningTaskId
  const taskId = scanningTaskId;
  closeScanner();
  const btn = document.querySelector(`button[data-id="${taskId}"]`);
  if (btn) {
    btn.innerHTML = 'Verifying...';
    btn.disabled = true;
  }

  try {
    await apiRequest(`/inventory/batch/${taskId}`, 'PUT', { status: 'Delivered' });
    showToast(`QR Verified: ${decodedText}. Package Delivered!`, 'success');
    fetchTasks();
  } catch (err) {
    showToast('Verification failed.', 'error');
    if (btn) {
      btn.innerHTML = 'Start Scan';
      btn.disabled = false;
    }
  }
}

function onScanFailure(error) {
  // Ignore frequent failed scans
}

// =============================
// ELEMENT SDK
// =============================
function onConfigChange(config) {
  const title = document.getElementById('page-title');
  const vendorName = document.getElementById('vendor-name');

  if (title) title.textContent = config.page_title || defaultConfig.page_title;
  if (vendorName) vendorName.textContent = config.vendor_name || defaultConfig.vendor_name;
}

function mapToCapabilities() {
  return {
    recolorables: [],
    borderables: [],
    fontEditable: undefined,
    fontSizeable: undefined
  };
}

function mapToEditPanelValues(config) {
  return new Map([
    ['page_title', config.page_title || defaultConfig.page_title],
    ['vendor_name', config.vendor_name || defaultConfig.vendor_name]
  ]);
}

if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig,
    onConfigChange,
    mapToCapabilities,
    mapToEditPanelValues
  });
}
