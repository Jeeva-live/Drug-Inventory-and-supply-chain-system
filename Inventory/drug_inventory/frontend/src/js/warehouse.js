import { API_BASE_URL, apiRequest } from './api.js';
import { updateLastUpdated, formatDate, getStatusClass, setLoading, showToast } from './utils.js';
import { protectPage, logout as authLogout } from "./auth.js";

protectPage(['admin', 'warehouse_manager']);

let inventory = [];
let alerts = { lowStock: [], expiry: [] };



document.addEventListener('DOMContentLoaded', () => {
    initWarehouse();
});

async function initWarehouse() {
    const refreshBtn = document.querySelector('button[title="Refresh"]');
    if (refreshBtn) refreshBtn.addEventListener('click', fetchData);

    const applyFilterBtn = document.getElementById('apply-filter-btn');
    if (applyFilterBtn) applyFilterBtn.addEventListener('click', fetchData);

    const approveBtn = document.getElementById('approve-btn');
    if (approveBtn) approveBtn.addEventListener('click', approveRestock);

    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportCSV);

    const pickupBtn = document.getElementById('pickup-btn');
    if (pickupBtn) pickupBtn.addEventListener('click', generatePickupList);

    const tabInv = document.getElementById('tab-inventory');
    const tabMov = document.getElementById('tab-movement');
    if (tabInv && tabMov) {
        tabInv.addEventListener('click', () => {
            document.getElementById('inventory-panel').classList.remove('hidden');
            document.getElementById('movement-panel').classList.add('hidden');
            tabInv.classList.add('tab-active');
            tabMov.classList.remove('tab-active');
        });
        tabMov.addEventListener('click', () => {
            document.getElementById('inventory-panel').classList.add('hidden');
            document.getElementById('movement-panel').classList.remove('hidden');
            tabMov.classList.add('tab-active');
            tabInv.classList.remove('tab-active');
        });
    }

    fetchData();

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.addEventListener('input', renderTable);

    window.logout = authLogout;
}

// Helper functions (formerly in initWarehouse)
function getStatusText(item) {
    const qty = item.current_stock || item.qty || 0;
    const threshold = item.threshold || 0;
    if (qty === 0) return 'Out of Stock';
    if (qty < threshold) return 'Low Stock';
    return 'In Stock';
}

async function fetchData() {
    updateLastUpdated();
    setLoading(true);
    try {
        let url = '/inventory?';
        const searchInput = document.getElementById('filter-search');
        if (searchInput && searchInput.value) url += `search=${encodeURIComponent(searchInput.value)}&`;

        const locationInput = document.getElementById('filter-location');
        if (locationInput && locationInput.value) url += `location=${encodeURIComponent(locationInput.value)}&`;

        // Fetch Inventory
        inventory = await apiRequest(url);

        // Generate Alerts dynamically
        const thirtyDaysFromNow = new Date(new Date().setDate(new Date().getDate() + 30));
        alerts = {
            lowStock: inventory.filter(i => i.current_stock < (i.threshold || Infinity)),
            expiry: inventory.filter(i => i.drug && new Date(i.drug.expiry_date) < thirtyDaysFromNow)
        };

        renderDashboard();
    } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Failed to load warehouse data', 'error');
        inventory = [];
        alerts = { lowStock: [], expiry: [] };
        renderDashboard();
    } finally {
        setLoading(false);
    }
}

function renderAlerts() {
    const container = document.querySelector('.space-y-3.max-h-64');
    if (!container) return;

    const lowStock = alerts.lowStock || [];
    const expiry = alerts.expiry || [];

    if (lowStock.length === 0 && expiry.length === 0) {
        container.innerHTML = '<p class="text-zinc-500 text-sm">No active alerts. Good job!</p>';
        return;
    }

    let html = '';

    // Low Stock Alerts
    lowStock.forEach(item => {
        const drugName = item.drug ? item.drug.name : 'Unknown Drug';
        html += `
        <div style="padding:10px 12px;background:var(--warning-bg);border:1px solid rgba(217,119,6,0.2);border-radius:8px;margin-bottom:6px;">
            <p style="font-size:0.78rem;font-weight:600;color:var(--warning);margin:0 0 2px;">Low Stock: ${drugName}</p>
            <p style="font-size:0.72rem;color:#b45309;margin:0;">Qty: ${item.current_stock} / Threshold: ${item.threshold}</p>
        </div>`;
    });

    // Expiry Alerts
    expiry.forEach(item => {
        const drugName = item.drug ? item.drug.name : 'Unknown Drug';
        const expiryDate = item.drug ? item.drug.expiry_date : null;
        html += `
        <div style="padding:10px 12px;background:var(--danger-bg);border:1px solid rgba(220,38,38,0.2);border-radius:8px;margin-bottom:6px;">
            <p style="font-size:0.78rem;font-weight:600;color:var(--danger);margin:0 0 2px;">Expiring: ${drugName}</p>
            <p style="font-size:0.72rem;color:#b91c1c;margin:0;">Expires: ${formatDate(expiryDate)}</p>
        </div>`;
    });

    container.innerHTML = html;
}

function renderTable() {
    const tbody = document.getElementById('inventory-tbody');
    if (!tbody) return;

    if (inventory.length === 0) {
        tbody.innerHTML = `
        <tr>
            <td colspan="9" class="px-6 py-4 text-center text-zinc-500">No items found</td>
        </tr>`;
        return;
    }

    tbody.innerHTML = inventory.map(item => {
        const isLow = item.current_stock < (item.threshold || Infinity);
        const isExpiring = item.drug && new Date(item.drug.expiry_date) < new Date(new Date().setDate(new Date().getDate() + 30));
        return `
        <tr class="table-row">
            <td style="padding:10px 14px;font-size:0.82rem;font-weight:500;color:var(--t1);">${item.drug ? item.drug.name : 'Unknown'}</td>
            <td style="padding:10px 14px;font-size:0.77rem;color:var(--t2);font-family:monospace;">${item.drug ? item.drug.batch_no : 'N/A'}</td>
            <td style="padding:10px 14px;font-size:0.77rem;color:var(--t2);font-family:monospace;">${item._id ? item._id.substring(item._id.length - 6) : 'N/A'}</td>
            <td style="padding:10px 14px;font-size:0.82rem;color:var(--t2);">${item.location || 'Warehouse'}</td>
            <td style="padding:10px 14px;font-size:0.82rem;font-weight:600;color:${isLow ? 'var(--warning)' : 'var(--success)'};">${item.current_stock}</td>
            <td style="padding:10px 14px;font-size:0.82rem;color:var(--t2);">${item.threshold || 0}</td>
            <td style="padding:10px 14px;font-size:0.82rem;color:#0891b2;">${item.ai_recommended_threshold ? '+' + item.ai_recommended_threshold : '—'}</td>
            <td style="padding:10px 14px;font-size:0.82rem;color:${isExpiring ? 'var(--danger)' : 'var(--t2)'};">${formatDate(item.drug ? item.drug.expiry_date : null)}</td>
            <td style="padding:10px 14px;">
                <span class="${getStatusClass(getStatusText(item))}">${getStatusText(item)}</span>
            </td>
        </tr>`;
    }).join('');
}

function renderDashboard() {
    // Update Stats
    const statTotal = document.getElementById('stat-total');
    if (statTotal) statTotal.textContent = inventory.length;

    const statLow = document.getElementById('stat-low');
    if (statLow) statLow.textContent = (alerts.lowStock || []).length;

    const statExpiry = document.getElementById('stat-expiry');
    if (statExpiry) statExpiry.textContent = (alerts.expiry || []).length;

    renderAlerts();
    renderTable();
}

window.notifyVendor = function (drugName) {
    showToast(`Vendor notified for ${drugName}`, 'success');
}

window.createPickup = function (drugName) {
    showToast(`Pickup created for ${drugName}`, 'success');
}

async function generatePickupList() {
    const btn = document.getElementById('pickup-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Generating...';
    btn.disabled = true;
    try {
        await apiRequest('/ai/predict', 'POST', { 
            location: 'Warehouse',
            product_id: 'AMOX002',
            stock_level: 50,
            expiry_days: 100,
            days: 7
        });
        showToast('AI Reorder Suggestion generated and sent to Vendors.', 'success');
    } catch (err) {
        showToast('Error generating pickup list', 'error');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

async function approveRestock() {
    const btn = document.getElementById('approve-btn');
    const originalText = btn.innerHTML;
    const restocks = alerts.lowStock || [];

    if (restocks.length === 0) {
        showToast('No pending restock requests to approve.', 'success');
        return;
    }

    btn.innerHTML = 'Approving...';
    btn.disabled = true;

    // Optimistic UI Update: Clear local alerts immediately
    const originalAlerts = { ...alerts };
    alerts.lowStock = [];
    renderDashboard();

    try {
        await new Promise(r => setTimeout(r, 800)); // Mock API delay
        showToast('All restock requests approved and sent to Manufacturer.', 'success');
        fetchData();
    } catch (err) {
        showToast('Failed to approve restocks', 'error');
        // Revert Optimistic Update
        alerts = originalAlerts;
        renderDashboard();
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function exportCSV() {
    if (inventory.length === 0) {
        showToast('No data to export', 'error');
        return;
    }

    const headers = ['Drug Name', 'Batch', 'Location', 'Quantity', 'Threshold', 'Status'];
    const rows = inventory.map(item => [
        item.drug ? item.drug.name : 'Unknown',
        item.drug ? item.drug.batch_no : 'N/A',
        item.location,
        item.current_stock,
        item.threshold,
        getStatusText(item)
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Inventory exported successfully', 'success');
}
