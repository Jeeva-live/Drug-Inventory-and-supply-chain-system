import { apiRequest } from './api.js';
import { updateLastUpdated, formatDate, showToast } from './utils.js';
import { protectPage, logout as authLogout } from "./auth.js";

protectPage(['admin', 'pharmacist']);

let batchData = [];
let html5QrcodeScanner = null;
let weeklyChartInstance = null;
let stockChartInstance = null;

// DOM Elements
const dom = {
    scanBtnTop: document.getElementById('scan-btn'),
    scanBtnModal: document.querySelector('#qr-modal .btn-primary'),
    manualEntryBtn: document.getElementById('manual-entry-btn'),
    closeModal: document.getElementById('close-modal'),
    qrModal: document.getElementById('qr-modal'),
    tableBody: document.getElementById('inventory-table'),
    pendingReqs: document.getElementById('pending-requests')
};

document.addEventListener('DOMContentLoaded', () => {
    initPharmacy();
    window.logout = authLogout;
});

async function initPharmacy() {
    // Bind buttons
    if (dom.scanBtnTop) dom.scanBtnTop.addEventListener('click', openScannerModal);
    if (dom.scanBtnModal) dom.scanBtnModal.addEventListener('click', startScanner);
    if (dom.manualEntryBtn) dom.manualEntryBtn.addEventListener('click', manualEntryScan);
    if (dom.closeModal) dom.closeModal.addEventListener('click', closeScannerModal);

    // Fetch data and init UI
    await fetchInventory();
    initCharts();
    renderPendingRequests();
}

async function fetchInventory() {
    updateLastUpdated();
    try {
        // Fetch inventory
        batchData = await apiRequest('/inventory');
        renderTable(batchData);
        updateStats();
    } catch (e) {
        console.error(e);
        showToast('Failed to load inventory data', 'error');
        batchData = [];
        renderTable(batchData);
    }
}

function updateStats() {
    const totalSkus = document.querySelector('.pharma-card:nth-child(1) .text-2xl');
    const lowStock = document.querySelector('.pharma-card:nth-child(2) .text-2xl');

    if (totalSkus) totalSkus.textContent = batchData.length;
    if (lowStock) lowStock.textContent = batchData.filter(i => i.current_stock < (i.threshold || 100)).length;
}

function renderTable(data) {
    if (!dom.tableBody) return;

    if (data.length === 0) {
        dom.tableBody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:var(--t2);padding:24px;">No inventory found</td></tr>';
        return;
    }

    dom.tableBody.innerHTML = data.map(item => {
        const isLow = item.current_stock < (item.threshold || Infinity);
        return `
        <tr class="table-row">
          <td style="padding:10px 14px;font-weight:500;color:var(--t1);">${item.drug ? item.drug.name : 'Unknown'}</td>
          <td style="padding:10px 14px;font-size:0.77rem;color:var(--t2);font-family:monospace;">${item._id.substring(item._id.length - 6)}</td>
          <td style="padding:10px 14px;font-size:0.77rem;font-family:monospace;color:var(--success);">${item.drug ? item.drug.batch_no : 'N/A'}</td>
          <td style="padding:10px 14px;text-align:center;font-weight:${isLow ? '700' : '400'};color:${isLow ? 'var(--warning)' : 'var(--t1)'};">${item.current_stock}</td>
          <td style="padding:10px 14px;text-align:center;color:var(--t2);">${item.threshold || 0}</td>
          <td style="padding:10px 14px;font-size:0.77rem;color:var(--t2);">${formatDate(item.drug ? item.drug.expiry_date : null)}</td>
          <td style="padding:10px 14px;font-size:0.77rem;color:var(--t2);">Default Vendor</td>
          <td style="padding:10px 14px;text-align:center;">
            <span class="badge badge-green">Stable</span>
          </td>
          <td style="padding:10px 14px;text-align:right;">
            <button class="btn btn-sm btn-primary" onclick="dispenseMedicine('${item._id}', ${item.current_stock})">Dispense</button>
          </td>
        </tr>`;
    }).join('');
}

// =============================
// DISPENSING
// =============================
window.dispenseMedicine = async function (id, currentStock) {
    const qtyStr = prompt(`Enter quantity to dispense (Current stock: ${currentStock}):`);
    if (!qtyStr) return;
    const qty = parseInt(qtyStr, 10);

    if (isNaN(qty) || qty <= 0 || qty > currentStock) {
        showToast('Please enter a valid amount', 'error', 'Invalid Quantity');
        return;
    }

    try {
        await apiRequest(`/inventory/${id}`, 'PUT', { current_stock: currentStock - qty });
        showToast(`Dispensed ${qty} units successfully`);
        fetchInventory();
    } catch (err) {
        showToast('Failed to dispense medicine', 'error');
    }
}

// =============================
// QR SCANNER
// =============================
function openScannerModal() {
    dom.qrModal.classList.remove('hidden');
    dom.qrModal.classList.add('flex');
}

function closeScannerModal() {
    dom.qrModal.classList.add('hidden');
    dom.qrModal.classList.remove('flex');
    if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(err => console.error("Failed to clear scanner", err));
        html5QrcodeScanner = null;
    }
}

function startScanner() {
    if (html5QrcodeScanner) return; // Already scanning

    // Replace placeholder with scanner
    document.getElementById('reader-container').style.display = 'block';

    html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
    html5QrcodeScanner.render(onScanSuccess, (e) => { });
}

function manualEntryScan() {
    const code = prompt("Enter Batch ID / QR Code manually:");
    if (code) {
        onScanSuccess(code);
    }
}

async function onScanSuccess(decodedText) {
    // We expect decoded text to be the batch_no e.g. "QR-BTH-2024" or just "BTH-2024"
    if (html5QrcodeScanner) {
        html5QrcodeScanner.pause(true);
    }

    // Find item
    const item = batchData.find(b => b.drug && (b.drug.batch_no === decodedText || b.drug.qr_code === decodedText));
    if (!item) {
        showToast(`QR Code ${decodedText} not found in inventory`, 'error');
        setTimeout(() => html5QrcodeScanner && html5QrcodeScanner.resume(), 2000);
        return;
    }

    closeScannerModal();
    window.dispenseMedicine(item._id, item.current_stock);
}

// =============================
// DYNAMIC CHARTS
// =============================
function initCharts() {
    // Replace empty divs with canvas
    const weeklyContainer = document.getElementById('weekly-chart');
    if (weeklyContainer) {
        weeklyContainer.innerHTML = '<canvas id="weeklyCanvas"></canvas>';
        const ctx = document.getElementById('weeklyCanvas').getContext('2d');
        weeklyChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Units Dispensed',
                    data: [120, 150, 180, 90, 200, 310, 342], // Mock stats
                    backgroundColor: 'rgba(52, 211, 153, 0.5)',
                    borderColor: 'rgba(52, 211, 153, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { display: false, beginAtZero: true },
                    x: { display: false }
                }
            }
        });
    }

    const stockContainer = document.getElementById('stock-threshold');
    if (stockContainer) {
        stockContainer.innerHTML = '<canvas id="stockCanvas"></canvas>';
        const ctx = document.getElementById('stockCanvas').getContext('2d');
        stockChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [
                    {
                        label: 'Average Stock',
                        data: [400, 350, 200, 150], // Trend dropping
                        borderColor: '#f87171',
                        tension: 0.4
                    },
                    {
                        label: 'Threshold Level',
                        data: [200, 200, 200, 200],
                        borderColor: '#94a3b8',
                        borderDash: [5, 5],
                        tension: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#64748b', font: { size: 10 } } } },
                scales: {
                    y: { display: false },
                    x: { display: false }
                }
            }
        });
    }
}

// =============================
// PENDING REQUESTS
// =============================
function renderPendingRequests() {
    if (!dom.pendingReqs) return;

    const mockRequests = [
        { ward: 'ICU Ward', drug: 'Amoxicillin 500mg', qty: 50, time: '10 mins ago' },
        { ward: 'Emergency', drug: 'Morphine 10mg/ml', qty: 10, time: '25 mins ago' },
        { ward: 'Pediatrics', drug: 'Paracetamol Syrup', qty: 20, time: '1 hr ago' }
    ];

    dom.pendingReqs.innerHTML = mockRequests.map(req => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:8px;background:var(--bg-3);margin-bottom:6px;cursor:pointer;transition:background 0.12s;" onmouseover="this.style.background='var(--bg-4)'" onmouseout="this.style.background='var(--bg-3)'">
            <div>
                <p style="font-weight:500;color:var(--t1);font-size:0.8rem;margin:0;">${req.ward}</p>
                <p style="font-size:0.72rem;color:var(--t2);margin:2px 0 0;">${req.qty}x ${req.drug}</p>
            </div>
            <div style="text-align:right;">
                <p style="font-size:0.7rem;color:var(--t3);margin:0;">${req.time}</p>
                <button style="margin-top:4px;font-size:0.72rem;color:var(--success);font-weight:600;background:none;border:none;cursor:pointer;padding:0;">Review</button>
            </div>
        </div>
    `).join('');
}
