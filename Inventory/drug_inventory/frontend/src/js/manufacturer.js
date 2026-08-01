import Chart from 'chart.js/auto';
import { updateLastUpdated, formatDate, getStatusClass, setLoading, showToast } from './utils.js';
import { apiRequest } from './api.js';
import { protectPage, logout as authLogout } from "./auth.js";

protectPage(['admin', 'manufacturer']);

// Default config
const defaultConfig = {
  page_title: 'Manufacturer Dashboard',
  company_name: 'PharmaCorp Industries'
};

let batchData = [];

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initManufacturer();
});

function initManufacturer() {
  if (window.elementSdk) {
    window.elementSdk.init({
      defaultConfig,
      onConfigChange: async (config) => {
        const pt = document.getElementById('page-title');
        if (pt) pt.textContent = config.page_title || defaultConfig.page_title;
        const cn = document.getElementById('company-name');
        if (cn) cn.textContent = config.company_name || defaultConfig.company_name;
      },
      mapToCapabilities: (config) => ({ recolorables: [], borderables: [] }),
      mapToEditPanelValues: (config) => new Map([
        ['page_title', config.page_title || defaultConfig.page_title],
        ['company_name', config.company_name || defaultConfig.company_name]
      ])
    });
  }

  // Attach global listeners for Manufacturer
  const searchBatch = document.getElementById('search-batch');
  if (searchBatch) searchBatch.addEventListener('input', () => debounce(fetchBatches, 500)());

  const filterStatus = document.getElementById('filter-status');
  if (filterStatus) filterStatus.addEventListener('change', fetchBatches);

  const refreshBtn = document.querySelector('button[title="Refresh"]');
  if (refreshBtn) refreshBtn.addEventListener('click', () => { fetchBatches(); updateLastUpdated(); });

  const batchForm = document.getElementById('create-batch-form');
  if (batchForm) {
    batchForm.addEventListener('submit', handleCreateBatch);
  }

  window.clearFilters = () => {
    if (searchBatch) searchBatch.value = '';
    if (filterStatus) filterStatus.value = '';
    const dateFrom = document.getElementById('date-from');
    if (dateFrom) dateFrom.value = '';
    const dateTo = document.getElementById('date-to');
    if (dateTo) dateTo.value = '';
    fetchBatches();
  };

  // Debounce helper
  let timeoutId;
  function debounce(func, delay) {
    return function () {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, arguments), delay);
    };
  }

  initCharts();
  fetchBatches();

  window.logout = authLogout;
}

let forecastChartInstance = null;
let expiryChartInstance = null;

async function initCharts() {
  const forecastCtx = document.getElementById('forecastChart');
  if (forecastCtx) {
    try {
      const data = await apiRequest('/ai/forecast');
      forecastChartInstance = new Chart(forecastCtx, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [
            {
              label: 'AI Forecast',
              data: data.forecast,
              borderColor: '#dc2626',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Actual Production',
              data: data.actual,
              borderColor: '#10b981',
              borderDash: [5, 5],
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } catch (err) {
      console.error("Failed to load forecast data", err);
    }
  }
}

async function fetchBatches() {
  try {
    setLoading(true);
    let url = '/inventory/batch?';

    const searchInput = document.getElementById('search-batch');
    const statusInput = document.getElementById('filter-status');

    if (searchInput && searchInput.value) url += `search=${encodeURIComponent(searchInput.value)}&`;
    if (statusInput && statusInput.value) url += `status=${encodeURIComponent(statusInput.value)}&`;

    const data = await apiRequest(url);
    batchData = data;
    renderTable(batchData);
    updateLastUpdated();
    updateStats(batchData);
    renderExpiryChart(batchData);
  } catch (err) {
    console.error("Fetch Error:", err);
    showToast("Failed to load inventory batches", "error");
  } finally {
    setLoading(false);
  }
}

function updateStats(data) {
  const totalEl = document.getElementById('stat-total');
  const activeEl = document.getElementById('stat-active');
  const qtyEl = document.getElementById('stat-quantity');

  if (totalEl) totalEl.textContent = data.length;
  if (activeEl) activeEl.textContent = data.filter(b => b.status === 'Active').length;
  if (qtyEl) {
    const totalQty = data.reduce((sum, b) => sum + (b.current_stock || 0), 0);
    qtyEl.textContent = totalQty >= 1000000 ? (totalQty / 1000000).toFixed(1) + 'M' :
      totalQty >= 1000 ? (totalQty / 1000).toFixed(1) + 'k' : totalQty;
  }
}

function renderExpiryChart(data) {
  const ctx = document.getElementById('expiryChart');
  if (!ctx) return;

  const monthCounts = {};
  data.forEach(batch => {
    if (batch.drug && batch.drug.expiry_date) {
      const d = new Date(batch.drug.expiry_date);
      const monthYear = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
      monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
    }
  });

  // Sort labels chronologically (approximate by parsing the short month/year)
  const labels = Object.keys(monthCounts).sort((a, b) => {
    const [m1, y1] = a.split(' ');
    const [m2, y2] = b.split(' ');
    return new Date(`${m1} 1, 20${y1}`) - new Date(`${m2} 1, 20${y2}`);
  });
  const counts = labels.map(l => monthCounts[l]);

  if (expiryChartInstance) {
    expiryChartInstance.destroy();
  }

  expiryChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Expiring Batches',
        data: counts,
        backgroundColor: '#f59e0b',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function renderTable(data) {
  const tbody = document.getElementById('batch-table-body');
  if (!tbody) return;
  tbody.innerHTML = data.map(batch => `
    <tr class="table-row">
      <td style="padding:10px 16px;font-size:0.78rem;font-family:monospace;font-weight:600;color:var(--t1);">${batch.drug ? batch.drug.batch_no : 'N/A'}</td>
      <td style="padding:10px 16px;font-size:0.82rem;color:var(--t2);">${batch.drug ? batch.drug.name : 'Unknown Drug'}</td>
      <td style="padding:10px 16px;">
        <span class="badge ${batch.qrStatus === 'Generated' ? 'badge-green' : 'badge-amber'}">${batch.qrStatus || 'Generated'}</span>
      </td>
      <td style="padding:10px 16px;font-size:0.82rem;color:var(--t2);">${batch.drug ? formatDate(batch.drug.mfg_date) : '-'}</td>
      <td style="padding:10px 16px;font-size:0.82rem;color:var(--t2);">${batch.drug ? formatDate(batch.drug.expiry_date) : '-'}</td>
      <td style="padding:10px 16px;font-size:0.82rem;font-weight:600;color:var(--t1);">${batch.current_stock}</td>
      <td style="padding:10px 16px;">
        <span class="${getStatusClass(batch.status)}">${batch.status || 'Active'}</span>
      </td>
      <td style="padding:10px 16px;">
        <button class="btn-action send-btn" data-id="${batch._id}" ${batch.status === 'Sent' ? 'disabled' : ''}>
          ${batch.status === 'Sent' ? 'Sent' : 'Send'}
        </button>
      </td>
    </tr>
  `).join('');

  // Re-attach listeners for dynamic buttons
  tbody.querySelectorAll('.send-btn').forEach(btn => {
    btn.addEventListener('click', (e) => sendToWarehouse(e.target));
  });

  const sc = document.getElementById('showing-count');
  if (sc) sc.textContent = data.length;
  const tc = document.getElementById('total-count');
  if (tc) tc.textContent = data.length;
}

async function sendToWarehouse(btn) {
  const id = btn.getAttribute('data-id');
  if (!id) return;

  // Optimistic UI Update
  const batchIndex = batchData.findIndex(b => b._id === id);
  if (batchIndex === -1) return;

  const originalStatus = batchData[batchIndex].status;
  batchData[batchIndex].status = 'Sent';
  renderTable(batchData);
  updateStats(batchData);

  try {
    await apiRequest(`/inventory/batch/${id}`, 'PUT', { status: 'Sent' });
    showToast('Batch sent to warehouse successfully', 'success');
  } catch (err) {
    console.error(err);
    showToast('Failed to send batch', 'error');
    // Revert Optimistic Update
    batchData[batchIndex].status = originalStatus;
    renderTable(batchData);
    updateStats(batchData);
  }
}

async function handleCreateBatch(e) {
  e.preventDefault();

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = 'Processing...';
  submitBtn.disabled = true;

  try {
    const drugName = document.getElementById('drug-select').value;
    const quantity = document.getElementById('quantity').value;
    const mfgDate = document.getElementById('mfg-date').value;
    const expiryDate = document.getElementById('expiry-date').value;

    // Generate pseudo batch ID
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randId = Math.floor(Math.random() * 9000) + 1000;
    const batchId = `BTH-${dateStr}-${randId}`;

    const newBatch = await apiRequest('/inventory/batch', 'POST', {
      batchId,
      drugName,
      mfgDate,
      expiryDate,
      quantity: Number(quantity)
    });

    const msgBox = document.getElementById('success-message');
    document.getElementById('new-batch-id').textContent = newBatch.drug.batch_no || batchId;
    msgBox.classList.remove('hidden');

    e.target.reset();
    fetchBatches();

    // Hide success message after 5 seconds
    setTimeout(() => {
      msgBox.classList.add('hidden');
    }, 5000);

  } catch (err) {
    console.error(err);
    showToast(err.message || 'Error creating batch', 'error');
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}
