# Coding Agent Instructions & Guardrails (AGENTS.md)

# 🌙 Lumo's Dream Delivery Service
**Document Version:** 1.0.0  
**Status:** Mandatory Coding Standards & System Guardrails  
**Target Delivery Platform:** Modern Web (Desktop & Mobile Responsive, Zero-Build Static)  
**Applies To:** AI Coding Assistants, Pair Programming Agents, and Human Contributors  

---

## 1. Prime Directives & North Star

As a coding agent working on **Lumo's Dream Delivery Service**, your primary objective is to maintain and enhance an original, cozy, hackathon-winning web sanctuary with **early-web soul and modern technical polish**.

### The 7 Golden Rules
1. **Inspect Before Changing:** ALWAYS inspect existing code using search and view tools before modifying or generating code. Never guess function signatures, CSS class names, or DOM selectors.
2. **Respect the Source of Truth:** `PRD.md`, `DESIGN.md`, `ARCHITECTURE.md`, `DATABASE.md`, and `API.md` are the canonical specifications. Never invent rogue features, change approved designs, or add out-of-scope complexity without explicit user confirmation.
3. **Zero-Build Static Discipline:** Do NOT introduce bundlers (Webpack, Vite, Rollup), transpilers (Babel, TypeScript compilers), or package managers (npm, yarn) into the runtime. The project runs directly in the browser via native HTML5, Vanilla CSS3, and modern ES6+ JavaScript.
4. **Surgical, Non-Destructive Edits:** Make precise, targeted changes. Never wipe out working code or reformat entire files unless explicitly instructed.
5. **Story-Over-Text Restraint:** Every major section must strictly adhere to the **≤ 150 words** copy limit defined in `PRD.md`.
6. **Zero External Audio Assets:** All sound effects, chimes, and piano notes MUST be procedurally synthesized using the W3C Web Audio API. Never add external `.mp3`, `.wav`, or `.ogg` assets.
7. **Zero Console Errors:** The application must execute with 0 uncaught exceptions, 0 runtime errors, and 0 missing resource 404s across desktop and mobile viewports.

---

## 2. Project Architecture & File System Structure

The repository maintains an intentionally minimal, deterministic layout:

```
babyhack/
├── index.html              # Canonical semantic markup & inline SVG defs
├── styles.css              # Master design system & responsive styling
├── app.js                  # Modular client application & Web Audio synthesizer
├── favicon.svg             # Handcrafted original character SVG favicon
├── PRD.md                  # Product Requirements Document
├── DESIGN.md               # Visual Design System & UI/UX Specification
├── ARCHITECTURE.md         # System Architecture & Technical Specifications
├── DATABASE.md             # Data Model & Persistence Specification
├── API.md                  # API Contracts & Integration Specification
├── AGENTS.md               # Coding Agent Instructions & Guardrails (This Document)
├── README.md               # User documentation, local running instructions, credits
└── .git/                   # Version control repository
```

### File Modification Constraints
* **HTML:** Modify `index.html` only when adding semantic sections, updating inline SVGs, or modifying modal structures. Keep CSS and JS linked with cache-busting querystrings (`?v=X.Y`).
* **CSS:** Modify `styles.css` only using predefined CSS custom properties (`var(--token)`). Do not hardcode arbitrary hex colors or ad-hoc margins.
* **JavaScript:** Maintain single-responsibility modular structure inside `app.js`. Avoid global variable pollution.

---

## 3. Code Quality, Naming & Style Conventions

### 3.1 HTML Standards
* Use semantic HTML5 elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<dialog>`.
* IDs and Classes must use lowercase kebab-case (e.g. `id="soundToggleBtn"`, `class="parcel-card"`, `class="retro-window-frame"`).
* Interactive elements must specify accessible names:
  * Buttons: visible text or `aria-label`.
  * Dialogs: `aria-labelledby` and `aria-modal="true"`.
  * Dynamic regions: `aria-live="polite"`.

### 3.2 CSS Standards
* **Design Token Adherence:** Always use CSS custom properties defined in `:root`:
  * Colors: `var(--indigo-dusk)`, `var(--indigo-night)`, `var(--midnight-deep)`, `var(--glow-gold)`, `var(--cream-soft)`, `var(--butter-yellow)`, `var(--blush-pink)`, `var(--mint-dream)`, `var(--text-dark)`, `var(--text-light)`.
  * Radii: `var(--radius-sm)`, `var(--radius-md)`, `var(--radius-lg)`, `var(--radius-pill)`.
  * Shadows: `var(--shadow-retro)`, `var(--shadow-retro-hover)`, `var(--shadow-glow)`.
* **Zero Horizontal Scroll:** Always enforce `box-sizing: border-box;`, `max-width: 100%;`, and `overflow-x: hidden;` on body/containers.
* **Responsive Units:** Use `clamp()`, `rem`, and `%` for layout and fluid typography. Avoid fixed pixel widths on layout containers.

### 3.3 JavaScript Standards
* Use strict mode (`'use strict';`).
* Naming rules:
  * Functions & variables: `camelCase` (e.g., `initAudioEngine()`, `calculateSvgPath()`).
  * Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_NAME_LENGTH`, `PIANO_NOTE_MAP`).
  * DOM Elements: Prefix with `el` or descriptive element role (e.g., `soundBtn`, `dreamModal`, `canvasEl`).
* Prefer early returns over deeply nested `if/else` ladders.
* Write concise JSDoc comments explaining the "why" for non-obvious algorithms or Web Audio formulas.

---

## 4. Component Reuse & Pattern Guidelines

### 4.1 UI Components
* **Buttons:** Reuse `.btn-primary` and `.btn-secondary` classes. All buttons must support keyboard focus (`:focus-visible`) and physical press-down depression (`:active`).
* **Retro Window Frames:** Wrap workshop panels and interactive modules in `.retro-window-frame` with header title bars and window control dots.
* **Sticky Notes:** Community wishes must use `.sticky-note` with soft pastel background tokens and subtle randomized rotation angles (`-2deg` to `+2deg`).
* **Modal Dialogs:** Must use the native `<dialog id="dreamModal">` element.

### 4.2 Modal Focus Trapping Pattern
When opening any modal dialog, the agent MUST adhere to the accessible focus trapping pattern:
```javascript
// Canonical Modal Open Pattern
function openModal(modalEl, triggerEl) {
  modalEl.showModal();
  document.body.classList.add('modal-open');
  
  // Trap Tab and Shift+Tab within modal focusable elements
  const focusables = modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusables.length) focusables[0].focus();
  
  // Return focus on close
  modalEl.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (triggerEl) triggerEl.focus();
  }, { once: true });
}
```

### 4.3 Web Audio Procedural Synthesis Pattern
All audio cues must be routed through `playSound(soundType)`:
* **AudioContext Autoplay Policy:** The `AudioContext` must initialize in a suspended state or cold muted state (`Sound: OFF 🔇`), resuming exclusively upon user gesture (`click`, `touchstart`, `keydown`).
* **Oscillator Lifecycle:** Create oscillator -> connect to GainNode -> ramp gain down exponentially -> stop and disconnect oscillator node:
```javascript
// Canonical Audio Node Cleanup
const osc = audioCtx.createOscillator();
const gain = audioCtx.createGain();
osc.connect(gain);
gain.connect(masterGain);
gain.gain.setValueAtTime(volume, audioCtx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
osc.start();
osc.stop(audioCtx.currentTime + duration);
```

---

## 5. Dependency & Integration Rules

1. **Strict Dependency Ban:** Never install or import npm packages, Node.js modules, or unapproved third-party scripts.
2. **Approved External CDNs Only:**
   * GSAP 3.12.5 & ScrollTrigger via Cloudflare CDNJS (for 60fps SVG timeline scrubbing).
   * Google Fonts (*Fredoka*, *Nunito*, *VT323*).
3. **No Heavy Frameworks:** Absolutely no React, Vue, Svelte, Angular, jQuery, Tailwind runtime, or Three.js.
4. **Sub-resource Integrity:** When loading CDN scripts, always use HTTPS and include `defer` attributes.

---

## 6. Type Safety & Defensive Programming

While the runtime uses Vanilla JavaScript, you must enforce strict type discipline:

1. **JSDoc Type Annotations:** Add JSDoc headers for public APIs, state models, and configuration dictionaries:
```javascript
/**
 * @typedef {Object} GuestbookEntry
 * @property {string} name - Sanitized author handle (max 30 chars).
 * @property {string} wish - Sanitized bedtime message (max 140 chars).
 * @property {number} timestamp - Unix epoch millisecond.
 */
```
2. **Defensive Parameter Validation:** Verify argument types before manipulating DOM or state (e.g. `if (!name || typeof name !== 'string') return;`).
3. **Safe Storage Wrappers:** Always wrap `localStorage` access in `try...catch` blocks to protect against Safari Private Browsing restrictions or storage quota limits:
```javascript
function safeGetStorage(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch (err) {
    console.warn(`[Storage] Failed to read ${key}:`, err);
    return fallback;
  }
}
```

---

## 7. Security, Privacy & Secret Management

1. **Zero Secret Storage:** Never commit or hardcode API keys, database credentials, access tokens, or private secrets into client-side code.
2. **XSS Prevention (Mandatory):**
   * Never use `innerHTML` with raw user input.
   * Strip HTML tags using regex (`/[<>&"'/]/g`) or insert text strictly via `.textContent`.
3. **Privacy by Design:**
   * Never collect or store PII (real names, emails, phone numbers, or physical addresses).
   * Never log raw client IP addresses.
4. **Client-Side Rate Limiting:** Enforce a minimum **4-second cooldown** between guestbook submissions to prevent accidental or automated message spam.

---

## 8. Accessibility (a11y) & Motion Rules

1. **WCAG 2.1 Level AA Compliance:**
   * Maintain text contrast ratios ≥ 4.5:1 against light and dark backgrounds.
   * Ensure interactive touch targets are at least **44 × 44px**.
   * Provide visible focus rings (`:focus-visible { outline: 3px solid var(--butter-yellow); }`).
2. **Reduced Motion Support (`prefers-reduced-motion: reduce`):**
   * All continuous CSS floating animations must be paused or disabled.
   * Replace rapid scaling or sliding transforms with soft opacity fades.
   * Confetti and floating star particles must be suppressed when reduced motion is requested.

---

## 9. Verification & Testing Playbook

Before marking any coding task complete or committing changes, execute the following QA checklist:

| Verification Check | Tool / Method | Acceptance Criteria |
| :--- | :--- | :--- |
| **Console Errors** | Browser Subagent / DevTools Console | **0 uncaught errors**, 0 warnings, 0 failed network requests. |
| **Horizontal Overflow** | Window width check at 360px, 390px, 768px, 1280px | `document.documentElement.scrollWidth <= window.innerWidth` (Zero horizontal scroll). |
| **Audio Compliance** | Cold page load test | Audio starts muted; resumes cleanly on user click without console autoplay warnings. |
| **Keyboard Trapping** | `Tab` / `Shift+Tab` / `Escape` on Modals | Focus remains trapped inside modal dialog; `Escape` closes modal and restores focus. |
| **Word Count Limit** | Script / Word count audit | Every major section (`#hero`, `#about`, `#story`, `#work`, `#map`, `#footer`) strictly **≤ 150 words**. |
| **Form Resilience** | Empty input, long string (>140 chars), rapid clicks | Form validates gracefully; displays friendly rate limit alert; rejects script tags. |

---

## 10. Git & Change Discipline

1. **Atomic Commits:** Make focused commits addressing one task or bug at a time.
2. **Conventional Commit Messages:** Format commit titles strictly following the Conventional Commits specification:
   * `feat(component): add marshmallow piano keybindings`
   * `fix(layout): prevent constellation label clipping on mobile`
   * `docs(agents): update coding agent guardrails and testing playbook`
   * `refactor(audio): streamline oscillator cleanup in gain envelope`
3. **Clean Workspace:** Never commit temporary scratch files, test dumps, or IDE-specific directories. Run `git status` before committing.
4. **No Regressions:** Verify previous milestones still function before pushing or closing a task.

---

*End of Coding Agent Instructions & Guardrails (AGENTS.md)*
