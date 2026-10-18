# Design System & UI/UX Specification (DESIGN.md)

# 🌙 Lumo's Dream Delivery Service
**Document Version:** 1.0.0  
**Status:** Approved for Implementation / Design Source of Truth  
**Target Delivery Platform:** Modern Web (Desktop & Mobile Responsive, Zero-Build Static)  
**Author:** Senior Product Designer & Design Systems Architect  

---

## 1. Visual Direction & Design Principles

### 1.1 Aesthetic Theme: Early-Web Soul with Modern Polish
The visual language bridges late-90s/early-2000s personal homepages (cozy whimsy, pixel badges, guestbooks, mechanical rolling counters, retro window frames, tactile skeuomorphism) with contemporary front-end polish (fluid SVG scroll scrubbing, procedural Web Audio synthesis, accessible modal dialogs, and smooth CSS color transitions).

### 1.2 Core Design Principles

1. **Bedtime Sanctuary (Low-Stimulation Warmth):**
   * Avoid jarring neon colors, harsh pure whites (`#ffffff`), high-contrast dark-mode glare, or aggressive strobe effects.
   * Colors must feel like twilight, candlelight, and glowing moonbeams.

2. **Tactility & Softness:**
   * Every interactive surface communicates squishiness and warmth.
   * Corners are heavily rounded (`8px` to `24px` and full pill shapes).
   * Interactive elements use physical "press-down" 3D bevel shadows (`0 4px 0`) that depress on click.

3. **Story-Driven Restraint:**
   * Story and character emotion take precedence over dry informational copy.
   * Every major section is strictly constrained to **≤ 150 words**. Visual illustrations, micro-animations, and acoustic feedback do the heavy lifting.

4. **Nostalgic Tangibility:**
   * Physical metaphors make digital interactions memorable: a mechanical rolling odometer for view counts, wax seals for delivered dreams, paper-boat origami folds, and sticky notes pinned to a cloud board.

5. **Universal Accessibility & Ergonomics:**
   * Visual flair never compromises usability. Keyboard focus rings, screen reader landmarks, reduced-motion fallbacks, and zero horizontal overflow are non-negotiable.

---

## 2. Colors & Atmospheric Palettes

### 2.1 Design Tokens (Hex & CSS Custom Properties)

```css
:root {
  /* Night Sky & Atmospheric Surfaces */
  --indigo-dusk:     #2a2a5e; /* Dusk horizon starting tone */
  --indigo-night:    #181432; /* Midnight sky base */
  --midnight-deep:   #0f0a1e; /* Deep nocturnal base for modal & contrast */
  --plum-deep:       #3b1f4a; /* Bevel ink, trading card shadow, borders */

  /* Warm Star & Character Accents */
  --glow-gold:       #ffd36b; /* Lumo's nightlight belly, primary CTA, active glow */
  --butter-yellow:   #ffe39a; /* Sticky notes, badges, hover accents */
  --dawn-peach:      #ffaa88; /* Sunrise horizon, warm celebratory alerts */
  --blush-pink:      #ffc2d4; /* Lumo's rosy cheeks, sweet badges, hearts */
  --mint-dream:      #bfeedd; /* Retro mint badges, soft accent tiles */

  /* Surface Ink & Contrast Typography */
  --cream-soft:      #fff7ee; /* Off-white primary text, card surface, window body */
  --cloud-shadow:    #dbe3f5; /* Subtle borders, card dividers, soft shadows */
  --text-dark:       #2a1e3b; /* High-contrast readable ink on cream surfaces */
  --text-light:      #fff7ee; /* High-contrast readable text on dark sky */
}
```

### 2.2 Continuous Sky Journey Gradient (Scroll Progression)

The application simulates the passage of night into morning as the user scrolls from top to bottom:

| Scroll Progression | Page Section | Dominant Color Hex | Emotional Atmosphere |
| :--- | :--- | :--- | :--- |
| **0% – 15%** | Hero (`#hero`) | `#2a204e` (Deep Twilight Dusk) | Welcoming, peaceful, starry |
| **16% – 35%** | About Lore (`#about`) | `#1b153b` (Evening Plum) | Intimate, cozy, bedtime story |
| **36% – 60%** | Storybook (`#story`) | `#130e2c` (Deep Midnight) | Wonder, quiet solitude, starlight |
| **61% – 80%** | Dream Workshop (`#work`) | `#0f0b22` (Starry Midnight Vault) | Tactile workshop, dream craft |
| **81% – 95%** | Delivery Route (`#map`) | `#1f143a` → `#4a2245` (Pre-Dawn Violet) | Voyage, gradual horizon warming |
| **96% – 100%** | Dawn Finale & Footer | `#883c50` → `#ffaa88` (Golden Peach Dawn) | Triumph, safe arrival, restful sleep |

### 2.3 Color Contrast Matrix (WCAG 2.1 AA Compliance)

* **`--text-light` (`#fff7ee`) on `--indigo-dusk` (`#2a2a5e`):** Contrast **7.8:1** (Passes AAA).
* **`--text-light` (`#fff7ee`) on `--midnight-deep` (`#0f0a1e`):** Contrast **14.2:1** (Passes AAA).
* **`--text-dark` (`#2a1e3b`) on `--cream-soft` (`#fff7ee`):** Contrast **11.5:1** (Passes AAA).
* **`--text-dark` (`#2a1e3b`) on `--butter-yellow` (`#ffe39a`):** Contrast **10.1:1** (Passes AAA).
* **`--glow-gold` (`#ffd36b`) on `--text-dark` (`#2a1e3b`):** Contrast **8.9:1** (Passes AAA).

---

## 3. Typography System

### 3.1 Font Families

```css
--font-display: 'Fredoka', cursive, system-ui, sans-serif;
--font-body:    'Nunito', -apple-system, BlinkMacSystemFont, sans-serif;
--font-pixel:   'VT323', monospace;
```

* **`Fredoka` (Display & Headings):** Rounded geometric shapes with warm, stubby curves. Conveys child-like innocence, softness, and cozy familiarity.
* **`Nunito` (Body, Controls & Labels):** Highly legible humanist sans-serif with rounded terminals that soften technical UI without sacrificing readability.
* **`VT323` (Mechanical, Badges & Tickers):** Evokes 1990s BBS monitors, retro hit counters, and handheld pixel game devices.

### 3.2 Responsive Type Scale

| Role | Token / Selector | Font Family | Size (Clamp / Fluid) | Weight | Line Height |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `.hero-title` | Fredoka | `clamp(2.25rem, 5.5vw, 3.5rem)` | 700 | 1.15 |
| **Section Title** | `h2`, `.section-title` | Fredoka | `clamp(1.75rem, 3.5vw, 2.35rem)`| 700 | 1.25 |
| **Card Header** | `h3`, `.card-title` | Fredoka | `1.25rem` (`20px`) | 600 | 1.3 |
| **Section Tag / Eyebrow**| `.section-tag` | Nunito | `0.85rem` (`13.6px`) | 800 | 1.0 (Caps, +1px letter-spacing) |
| **Body Large** | `.lead-text` | Nunito | `1.125rem` (`18px`) | 500 | 1.6 |
| **Body Regular** | `p`, `.body-text` | Nunito | `1.0rem` (`16px`) | 400 / 600 | 1.6 |
| **Small / Meta** | `small`, `.caption` | Nunito | `0.875rem` (`14px`) | 400 | 1.45 |
| **Retro Ticker / Counter**| `.odometer-digit`, `.ticker`| VT323 | `1.25rem` – `1.75rem` | 400 | 1.0 |

---

## 4. Spacing, Elevation & Layout System

### 4.1 8pt Baseline Spacing Scale

* **`--space-1` (4px):** Micro gaps, tag padding, border radii offsets.
* **`--space-2` (8px):** Button internal vertical padding, badge gaps.
* **`--space-3` (12px):** Compact card padding, form input vertical padding.
* **`--space-4` (16px):** Standard card padding, button horizontal padding.
* **`--space-5` (24px):** Grid gaps, section eyebrow bottom margins.
* **`--space-6` (32px):** Card header margins, dialog internal padding.
* **`--space-7` (48px):** Section gap on mobile, major component separation.
* **`--space-8` (64px):** Desktop inter-section spacing (`margin-bottom`).
* **`--space-9` (96px):** Maximum desktop section breathing room.

### 4.2 Elevation, Depth & Shadow Tokens

1. **Retro 3D Button Bevel (`--shadow-retro`):**
   `0 4px 0 rgba(42, 30, 59, 0.35)`  
   Provides physical depth without noisy blur. On active press: transforms `translateY(3px)` and collapses shadow to `0 1px 0`.
2. **Elevated Card Shadow:**
   `0 8px 24px rgba(15, 10, 30, 0.45)`  
   Creates floating separation for trading cards and workshop window frames against the deep sky background.
3. **Celestial Starlight Glow (`--shadow-glow`):**
   `0 0 20px rgba(255, 211, 107, 0.45)`  
   Used on Lumo's nightlight belly, active route waypoints, and the sunrise lighthouse beacon.

### 4.3 Corner Radii Tokens

* `--radius-sm`: `8px` (Tags, small pills, inputs)
* `--radius-md`: `16px` (Cards, window containers, sticky notes)
* `--radius-lg`: `24px` (Hero showcases, modal dialogs)
* `--radius-pill`: `9999px` (Action buttons, status badges, sound toggle)

---

## 5. Reusable Component Specifications

### 5.1 Buttons & Interactive Controls

#### Primary Action Button (`.btn-primary`)
* **Background:** `--glow-gold` (`#ffd36b`)
* **Color:** `--text-dark` (`#2a1e3b`)
* **Border:** `2px solid var(--text-dark)`
* **Shadow:** `--shadow-retro` (`0 4px 0 rgba(42, 30, 59, 0.35)`)
* **Border Radius:** `--radius-pill` (`9999px`)
* **Typography:** `Nunito`, 700 weight, `1rem`
* **States:**
  * *Hover:* Scales to `1.03`, shadow expands to `0 6px 0`.
  * *Active:* `translateY(3px)`, shadow reduces to `0 1px 0`.
  * *Focus-Visible:* `3px solid var(--butter-yellow)` outline with `2px` offset.

#### Secondary Action Button (`.btn-secondary`)
* **Background:** `rgba(255, 247, 238, 0.15)`
* **Color:** `--cream-soft` (`#fff7ee`)
* **Border:** `2px solid var(--cream-soft)`
* **Backdrop Filter:** `blur(8px)`
* **Hover:** Background brightens to `rgba(255, 247, 238, 0.25)`.

#### Audio Control Switch (`#soundToggleBtn`)
* **Pill Shape:** Fixed in top header.
* **States:**
  * *Muted (`Sound: OFF 🔇`):* Neutral translucent background with gentle golden pulse to nudge user interaction.
  * *Active (`Sound: ON 🔔`):* Glowing butter-yellow background with dark ink text.

### 5.2 Retro Window Frame (`.retro-window-frame`)

Recreates a vintage early-OS desktop window:
* **Title Bar:** Gradient header (`#3b1f4a` to `#2a1e3b`) with title text in `Fredoka` and three decorative control pills (`_`, `□`, `✕`).
* **Frame Body:** Outer border `3px solid #3b1f4a` with inner `1px solid rgba(255, 255, 255, 0.1)`.
* **Bevel Effect:** Inset highlight on top/left edges, inset shadow on bottom/right edges.

### 5.3 Parcel Cards & Trading Cards (`.parcel-card`, `.trading-card`)

* **Structure:** Clean rounded rectangle with cream surface (`#fff7ee`) or deep indigo glass (`rgba(42, 32, 78, 0.7)`).
* **Card Metadata:** Wax seal or stamp icon in top-right corner; title, descriptive story excerpt (under 30 words), and pill button.
* **Interactivity:** Gentle spring hover lift (`translateY(-4px)`), soft starlight border illumination.

### 5.4 Playable Marshmallow Piano (`.marshmallow-piano`)

* **Keys Container:** 8 horizontal rounded pads mapped to pentatonic lullaby notes (`C5` to `E6`).
* **Visual Style:** Soft pastel pillow gradient (`#fff7ee` with mint, peach, and blush tints).
* **Tactile Depression:** On pointer down or keyboard trigger (`A, S, D, F, G, H, J, K`), the key compresses by `6px`, brightens with golden luminescence, and releases a floating musical note particle.

### 5.5 Mechanical Hit Counter (`.odometer-counter`)

* **Aesthetic:** Early-web mechanical brass and plastic rolling digit reel.
* **Bevel Box:** Dark recessed chamber (`#0f0a1e`) with metallic border gradient and individual digit tumblers (`.odometer-digit`) displaying cream numerals in `VT323`.
* **Motion:** Increments trigger rolling vertical translation with a gentle mechanical click sound.

### 5.6 Sticky-Note Bedtime Guestbook (`.sticky-note`)

* **Visual Style:** Pastel square cards (rotations randomized between `-2deg` and `+2deg`) pinned to a starry bulletin board.
* **Palettes:** Butter yellow (`#ffe39a`), Peach blush (`#ffc2d4`), Dream mint (`#bfeedd`).
* **Header:** Push-pin emoji (`📌`) with signer handle and timestamp.
* **Body:** Handwritten-feel or clean rounded typography, sanitized text, max 140 characters.

### 5.7 Floating Companion (`#lumoCompanion`)

* **Placement:** Fixed bottom-right corner (`bottom: 20px; right: 20px; z-index: 850`).
* **Avatar:** SVG mini-Lumo peeking from behind a starlight cloud.
* **Speech Bubble:** Rounded tooltip appearing above Lumo displaying context-aware thoughts (`💤`, `✨`, `💛`, `🥞`, `⛵`, `📝`).
* **Click Reaction:** Squishes, wiggles (`±15deg` shake), triggers baby laugh Web Audio chime, and displays temporary greeting toast.

---

## 6. Navigation & Form Systems

### 6.1 Top Header & Persistent Navigation

```
+-------------------------------------------------------------------------------+
| 🌙 LUMO'S DREAM CO.  [RES: 1280x800]  [Sound: OFF 🔇]  (★) 1,204 DREAMS DELIV |
+-------------------------------------------------------------------------------+
```

* **Position:** Fixed at viewport top (`top: 0; z-index: 900`).
* **Backdrop:** Translucent dark plum (`rgba(24, 20, 50, 0.85)`) with `backdrop-filter: blur(12px)` and `1px` starlight border below.
* **Brand Logo:** Triple-click Easter egg triggers secret celebratory chime.
* **Resolution Pill:** Live dynamic dimensions badge (`window.innerWidth × innerHeight`).
* **Delivery Marquee:** Continuous horizontal scrolling starlight ribbon.

### 6.2 Forms & Input Design

#### Input Fields (`.retro-input`)
* **Background:** Soft cream (`#fff7ee`) with dark ink text (`#2a1e3b`).
* **Border:** `2px solid #3b1f4a`, radius `12px`.
* **Padding:** `12px 16px`, font `Nunito` 500.
* **Focus State:** `outline: none; border-color: var(--glow-gold); box-shadow: 0 0 10px rgba(255, 211, 107, 0.5);`.
* **Character Counter:** Monospace counter (`140/140`) placed in lower right corner; transitions to warm coral when under 10 characters remain.

#### Wholesome Word Filtering & Form Feedback
* Non-cozy or offensive words are automatically converted into wholesome emojis (`💛✨`) without embarrassing rejection dialogs.
* Submissions enforce a 4-second cooldown to discourage automated spam.

---

## 7. Loading, Empty & Error States

| Context | State | Visual Presentation | Acoustic / Micro Feedback |
| :--- | :--- | :--- | :--- |
| **Audio Engine** | Cold / Initial | Translucent pill with `"Sound: OFF 🔇"`; subtle pulse animation every 4s. | None until first user gesture unlocks `AudioContext`. |
| **Dream Generator** | Loading (750ms) | Paper-boat origami folding SVG animation with pulsing starlight rings. | Soft procedural paper-crinkle tone. |
| **Clipboard Action** | Success | Starlight toast slides in from bottom: `"Copied to starlight clipboard! ✨"`. | High-register chime chord (C6-G6). |
| **Clipboard Action** | Error / Blocked | Fallback toast: `"Press Ctrl+C to copy your bedtime dream parcel"`. | Neutral low chime. |
| **Guestbook** | Rate Limited | Friendly notice: *"Patience, sleepy friend! Take a breath before sending another wish. ✨"* | Soft wooden block tap tone. |
| **Guestbook** | Empty Storage | 5 pre-seeded wholesome messages (*Star-Gazer Maya*, *Grandma Nora*, etc.) ensure board is never desolate. | Instant load. |

---

## 8. Micro-Interactions, Motion & Animation

### 8.1 Animation Philosophy
Animations should feel like drifting feathers, glowing nightlights, and gentle floating clouds. Rapid, jarring, or bouncing spring overshoots that cause motion sickness are strictly prohibited.

### 8.2 Animation Choreography Tokens

* **Fast Interactive Hover:** `200ms ease-out` (Buttons, key highlights, card elevation).
* **Medium Card / Modal Transition:** `350ms cubic-bezier(0.16, 1, 0.3, 1)` (Dialog open, origami fold).
* **Atmospheric Dawn Transition:** `1.2s cubic-bezier(0.16, 1, 0.3, 1)` (Sunrise sky shift).
* **Continuous Ambient Float:** `3.5s ease-in-out infinite alternate` (Lumo cloud floating in hero).

### 8.3 Scroll-Scrubbed Delivery Route (GSAP)
* Scroll progress is mathematically mapped to the SVG path stroke length.
* As the user scrolls through `#map`, the starlight trail illuminates and the paper boat rotates smoothly tangent to the curve.
* Reaching `96%` progress triggers the **Dawn Finale**:
  1. Sky transitions to glowing peach/gold.
  2. Lighthouse beacon pulses at `100%` opacity.
  3. 45 star-confetti particles burst upward and drift softly downward.
  4. Final celebratory card slides into view with curled sleeping Lumo.

### 8.4 Reduced Motion Accessibility (`prefers-reduced-motion`)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .lumo-floating-hero {
    transform: none !important;
  }
}
```
When reduced motion is preferred, continuous floating loops are frozen, particle bursts are suppressed, and transitions switch to instant opacity cross-fades.

---

## 9. Responsive Behavior & Breakpoint System

### 9.1 Breakpoint Architecture

```
[360px Compact Mobile] ──> [480px Large Mobile] ──> [768px Tablet] ──> [1080px+ Desktop]
```

| Breakpoint Range | Target Devices | Layout Behavior |
| :--- | :--- | :--- |
| **360px – 480px** | Compact Smartphones (iPhone SE, Galaxy S) | Single column layout; 16px screen padding; horizontal swipe for story cards; Lumo companion hidden below 380px to avoid obscuring content. |
| **481px – 768px** | Phablets & Mini Tablets | 2-column grids for dream parcels; route map SVG scaled to 16:9 aspect ratio; tactile touch targets ≥ 48px. |
| **769px – 1080px** | Tablets Landscape & Laptops | 4-column workshop grid; full SVG delivery route; desktop flashlight radial mask active on hover. |
| **1081px and above**| Desktop Displays | Max container width clamped to `1080px` with generous starlight outer margins. |

### 9.2 Strict Zero Horizontal Overflow
* All containers utilize `box-sizing: border-box`.
* SVGs specify `viewBox` and `width: 100%; height: auto;`.
* Text elements use `word-break: break-word;` and `overflow-wrap: anywhere;`.

---

## 10. Accessibility (a11y) & Usability Standards

1. **Semantic HTML5 Structure:**
   * Single `<h1>` on the page (`Lumo's Dream Delivery Service`).
   * Clear landmark hierarchy (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<dialog>`).
2. **Keyboard Navigation & Focus Management:**
   * A hidden skip link (`.skip-link`) appears on first `Tab` press to jump directly to `#hero`.
   * Focus rings use high-visibility `3px solid var(--butter-yellow)` with `2px` offset.
   * Modal dialogs trap `Tab` and `Shift+Tab` cycles, close on `Escape`, and return focus to the trigger button.
3. **Screen Reader Live Regions:**
   * Odometer counter and copy-to-clipboard notifications use `aria-live="polite"` so updates are announced gently.
4. **Touch Target Sizing:**
   * All clickable buttons, piano keys, and audio switches maintain a minimum touch target of **44 × 44px**.

---

## 11. Page-Level Layout & Composition Guidance

### 11.1 Section 1: Hero Showcase (`#hero`)
* **Visual Anchor:** Handcrafted SVG Lumo floating centrally with interactive eye tracking and tickle giggle sound.
* **Content:** Section tag ("COZY BEDTIME SANCTUARY"), display headline, and 66-word welcome lore.
* **Action:** Dual CTA buttons: *"Explore The Route ⛵"* and *"Unseal Dreams 📦"*.

### 11.2 Section 2: Character Sheet & Lore (`#about`)
* **Visual Anchor:** Vintage trading card with rounded golden border and 5 characteristic attributes.
* **Content:** 127-word backstory detailing Lumo's origin, personality quirks, and bedtime mission.

### 11.3 Section 3: Storybook Origin (`#story`)
* **Visual Anchor:** 4-scene illustrated narrative grid progressing from "The Lost Lullaby" to "The First Delivery".
* **Content:** 123-word story formatted in cozy episodic cards.

### 11.4 Section 4: DreamOS Workshop (`#work`)
* **Visual Anchor:** Retro desktop window chrome enclosing 4 parcel cards and an interactive nightlight dimmer dial.
* **Content:** 134-word overview with accessible modal containing the 8-key playable marshmallow piano.

### 11.5 Section 5: Delivery Route & Dawn Finale (`#map`)
* **Visual Anchor:** Scroll-scrubbed starlight trajectory passing 5 sleeping villages, culminating in the golden sunrise finale.
* **Content:** 96-word delivery guide and celebration card.

### 11.6 Section 6: Community & Footer (`#footer`)
* **Visual Anchor:** Rolling mechanical hit counter, custom folded origami dream maker, and live sticky-note guestbook.
* **Content:** 124-word concluding bedtime thoughts, early-web webring badges, and open source credits.

---

*End of Design System & UI/UX Specification (DESIGN.md)*
