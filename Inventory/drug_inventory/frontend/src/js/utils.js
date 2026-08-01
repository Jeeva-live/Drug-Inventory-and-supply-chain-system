export function updateLastUpdated() {
    const el = document.getElementById('last-updated');
    if (el) {
        const now = new Date();
        el.textContent = now.toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }
}

export function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getStatusClass(status) {
    const classes = {
        'Active':       'badge badge-green',
        'Completed':    'badge badge-blue',
        'On Hold':      'badge badge-amber',
        'In Stock':     'badge badge-green',
        'Low Stock':    'badge badge-amber',
        'Out of Stock': 'badge badge-red'
    };
    return classes[status] || 'badge badge-gray';
}

export function setLoading(isLoading) {
    const btn = document.querySelector('button[title="Refresh"] svg');
    if (btn) {
        if (isLoading) btn.classList.add('animate-spin');
        else btn.classList.remove('animate-spin');
    }
}

export function showToast(message, type = 'success', title = null) {
    const isError = type === 'error';
    const displayTitle = title || (isError ? 'Error' : 'Success');

    let toastContainer = document.getElementById('global-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'global-toast-container';
        toastContainer.style.cssText = 'position:fixed;bottom:1rem;right:1rem;z-index:9999;display:flex;flex-direction:column;gap:8px;';
        document.body.appendChild(toastContainer);
    }

    const bg     = isError ? '#fff1f1' : '#f0fdf4';
    const border = isError ? '#fca5a5' : '#6ee7b7';
    const color  = isError ? '#b91c1c' : '#065f46';
    const iconPath = isError
        ? 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        : 'M5 13l4 4L19 7';

    const toast = document.createElement('div');
    toast.style.cssText = `background:${bg};border:1px solid ${border};border-radius:8px;padding:11px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 4px 12px rgba(0,0,0,0.08);min-width:220px;opacity:0;transform:translateY(12px);transition:opacity 0.25s,transform 0.25s;`;
    toast.innerHTML = `
        <svg width="16" height="16" fill="none" stroke="${color}" viewBox="0 0 24 24" style="flex-shrink:0;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}"/>
        </svg>
        <div>
            <p style="font-weight:600;font-size:0.78rem;color:${color};margin:0;">${displayTitle}</p>
            ${message ? `<p style="font-size:0.7rem;color:${color};opacity:0.8;margin:2px 0 0;">${message}</p>` : ''}
        </div>`;

    toastContainer.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; });
    setTimeout(() => {
        toast.style.opacity = '0'; toast.style.transform = 'translateY(12px)';
        setTimeout(() => toast.remove(), 280);
    }, 3000);
}
