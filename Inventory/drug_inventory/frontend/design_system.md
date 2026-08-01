# Glassy Blood Red Theme - Design System

## 1. Visual Theme Description
The "Glassy Blood Red" theme combines a deep, rich dark mode with vibrant, "blood red" accents and a frosted-glass (glassmorphism) aesthetic.

*   **Base**: Deep Black (`#000000`) to Dark Zinc (`#18181b`). A subtle gradient or noise texture is recommended for the background to enhance the glass effect.
*   **Accents**:
    *   **Primary**: Blood Red (`#dc2626` / Tailwind `red-600`) to Rose (`#e11d48`).
    *   **Glows**: Subtle red shadows (`shadow-red-900/40`) to create depth.
*   **Glass Effect**:
    *   **Surface**: Semi-transparent dark zinc (`bg-zinc-900/60` to `bg-black/40`).
    *   **Blur**: `backdrop-blur-md` (12px) to `backdrop-blur-xl` (24px).
    *   **Borders**: Thin, semi-transparent white/zinc borders (`border-white/5` or `border-zinc-700/50`) to define edges without heavy lines.
*   **Typography**:
    *   **Font**: Inter or system sans-serif.
    *   **Colors**: High-contrast White (`text-white`) for headings, Zinc-400 (`text-zinc-400`) for secondary text. Avoid pure grey; lean towards cool zincs.

## 2. Color Palette & Variables

| Role | Color | Tailwind Class | Hex |
|------|-------|----------------|-----|
| **Background** | Deep Black | `bg-black` | `#000000` |
| **Surface (Glass)** | Translucent Zinc | `bg-zinc-900/60` | `#18181b` (60% opacity) |
| **Primary Accent** | Blood Red | `text-red-600` / `bg-red-600` | `#dc2626` |
| **Secondary Accent** | Rose Red | `text-rose-500` | `#f43f5e` |
| **Text Primary** | White | `text-white` | `#ffffff` |
| **Text Secondary** | Zinc Grey | `text-zinc-400` | `#a1a1aa` |
| **Success** | Emerald | `text-emerald-400` | `#34d399` |
| **Warning** | Amber | `text-amber-400` | `#fbbf24` |

## 3. Key Component Styles

### Global Background
To make the glass effect visible, the body should not be flat.
```css
body {
    @apply bg-zinc-950 text-zinc-300;
    /* Subtle radial gradient to give depth behind glass */
    background-image: radial-gradient(circle at 50% 0%, #3f1010 0%, #000000 60%);
    min-height: 100vh;
}
```

### Glassy Cards & Panels
```css
.glass-panel {
    @apply bg-zinc-900/60 backdrop-blur-md border border-white/5 shadow-xl;
}

/* Hover effects for interactive cards */
.glass-card-interactive {
    @apply hover:bg-zinc-800/60 hover:border-red-500/30 transition-all duration-300;
}
```

### Primary Action Button ("Blood Mode")
```css
.btn-blood {
    @apply bg-gradient-to-r from-red-700 to-red-900 
           hover:from-red-600 hover:to-red-800 
           text-white font-medium 
           shadow-lg shadow-red-900/40 
           border border-red-800/50
           backdrop-blur-sm;
}
```

### Accessibility & Focus
*   **Focus Rings**: Use the primary red for clear focus indication.
    *   `focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black`
*   **Contrast**: Ensure all text on glassy backgrounds passes WCAG AA. `text-zinc-400` on `bg-zinc-900` usually passes, but `text-zinc-500` might fail. Stick to 400 or lighter.

## 4. Implementation Snippet

### Tailwind Config (for reference)
Ensure `backdropFilter` is enabled (default in Tailwind v3+).

### HTML Example
```html
<div class="relative min-h-screen bg-black overflow-hidden">
    <!-- Background Blob for Glass Effect -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[100px] pointer-events-none"></div>

    <!-- Glass Modal -->
    <div class="relative z-10 p-8 max-w-lg mx-auto mt-20 rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl shadow-2xl">
        <h2 class="text-2xl font-bold text-white mb-2">System Alert</h2>
        <p class="text-zinc-300 mb-6">Glassmorphism applied. Background is blurred.</p>
        <button class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/50 transition-all">
            Acknowledge
        </button>
    </div>
</div>
```

## 5. Local Implementation & Testing
1.  **Apply CSS**: Add the provided classes to `src/main.css`.
2.  **Update HTML**: Refactor `class="..."` attributes to use `.glass-panel` instead of solid backgrounds.
3.  **Test**: Open `index.html` (or the relevant page) in Chrome.
4.  **Debug**: Use Chrome DevTools > Rendering > "Emulate vision deficiencies" to check contrast if unsure.
