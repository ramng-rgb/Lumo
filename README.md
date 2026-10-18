# 🌙 Lumo's Dream Delivery Service
> *"Sleep tight. I'm on my way."*

A cozy, immersive, hackathon-winning portfolio website for an **100% original baby character: Lumo the Baby Moon-Cloud**. Built with early-web soul—nostalgic charm, chunky buttons, tiled starlight, and window-chrome—crafted with modern web standards, smooth SVG animations, and zero build dependencies.

---

## 🌐 Live URL
- **Live Demo:** `https://lumo-dream-delivery.netlify.app` *(Placeholder for deployment)*
- **Repository:** `babyhack` (Local workspace / GitHub Pages ready)

---

## ☁️ 5-Point Character Sheet (Track 2: Your Own Baby)

| Point | Specification |
| :--- | :--- |
| **1. Name** | **Lumo** (they/them) |
| **2. What they are** | A round, squishy baby moon-cloud with a golden crescent curl on its head, rosy blushing cheeks, tiny stubby arms, and a warm glowing belly that serves as a nighttime nightlight. |
| **3. What they do** | Runs the **Dream Delivery Service**, carefully packing sweet glowing dreams into paper-boat parcels and floating them to sleeping towns across the night sky before sunrise. |
| **4. Their story** | Lumo was born from the final wisp of a lost bedtime lullaby that drifted up into the clouds. After a lonely first night searching for where lullabies go, Lumo discovered that every sleeping child created sweet, fragile dreams needing safe delivery past the dark shadows. Now Lumo is on a journey across starlit skies toward Dream #1,000,000. |
| **5. Tagline** | *“Sleep tight. I’m on my way.”* |

---

## 📖 Story Behind the Build

In the frantic era of hyper-optimized, sterile digital interfaces, we wanted to resurrect the **warmth and whimsy of the early web (90s and early 2000s)**—when personal homepages felt like secret treehouses filled with blinking badges, guestbook signatures, hand-drawn avatars, and webrings. 

**Lumo** was created from the ground up as a gentle antidote to bedtime restlessness. Everything in this project was built without stock assets or commercial character lookalikes: Lumo’s SVG body, golden crescent curl, nightlight belly gradient, and expressive eye sockets were coded by hand. As you scroll, the atmospheric background shifts continuously from twilight dusk into starry midnight and finally into a soft peach sunrise as the paper-boat courier arrives at Sunrise Cove.

### 🌟 Proudest Features

1. **Scroll-Driven Dream Delivery Map (Tier 2 Standout)**  
   A winding SVG river of starlight traverses five sleeping villages (*Slumberton, Starfall Glade, Pillow Peak, Dewdrop Hollow, Sunrise Cove*). Using SVG `getPointAtLength()` synchronized to scroll progress, Lumo’s paper boat sails gracefully along the curved trajectory. As Lumo reaches each milestone, village cottages light up with golden glowing windows and chime chords.

2. **Nightlight Flashlight Layer (Tier 2 Standout)**  
   In the dark skies, a dynamic CSS radial-gradient flashlight mask follows the visitor’s cursor (and touch-drags on mobile). Shining the flashlight reveals secret doodles hidden in the darkness: the *Teapot of Dreams Constellation*, the *Snoozing Bear Cub*, the *Moon Bunny Constellation*, and the elusive *Sleeping Star*.

3. **In-Browser Web Audio Synthesizer (No Audio Files)**  
   No external audio files to load or fail. All sound effects are generated mathematically in real time using the Web Audio API:
   - **Giggles:** Arpeggiated pitch-bent sine blips triggered by clicking/tickling Lumo.
   - **Wind Chimes:** Multi-harmonic pentatonic sine waves triggered on section reveals.
   - **Lullaby Music Box:** Triangle-wave chime sequence playing during Lumo’s sleep mode.
   - Always accessible via a fixed mute toggle button with full `aria-label` screen reader support and `localStorage` persistence.

4. **Secret Sleeping Star & Konami Easter Eggs**  
   - Finding the tiny Sleeping Star hidden in the night sky and tapping it 3 times puts Lumo into deep slumber, fades the entire website into a cozy dark lullaby mode, and plays a soothing music-box lullaby.
   - Triple-tapping the header logo or entering the classic Konami code (`↑ ↑ ↓ ↓ ← → ← → B A`) triggers a starry confetti shower and reveals the *Certified Dream Dreamer* badge.

5. **Early-Web Immersion & Side Quests (+13 Bonus)**  
   - **Responsive Chaos Mode (+5):** Fluid container queries (`@container`), adaptive clamp typography, and a live-updating resolution badge (`390×844 · Lumo adapted!`).
   - **Live Sticky-Note Guestbook (+2):** Sanitized, rate-limited bedtime wish board with random pin rotations and persistent `localStorage` memory.
   - **Sparkle Cursor Trail (+2):** Retro pastel stars and bubbles following the pointer, throttled with `requestAnimationFrame`.
   - **Hit Counter Odometer (+1):** Mechanical rolling digit odometer tracking worldwide dreams delivered.
   - **Sound & Mute Engine (+3):** Pure Web Audio synth with user gesture activation and muted-by-default safety.

---

## 🛠️ Tech Stack & Philosophy

- **Core:** Pure Semantic HTML5 + Vanilla CSS3 + Vanilla JavaScript (ES6+).
- **No Build Step:** Zero npm installs, zero bundling, zero webpack/vite configs. Works instantly out of the box in any browser.
- **CDN Libraries:** GSAP 3.12.5 & ScrollTrigger via cdnjs (used for smooth 60fps SVG timeline scrubbing).
- **Typography:** Google Fonts (*Fredoka*, *Nunito*, *VT323*).
- **Audio:** Native Web Audio API OscillatorNode & GainNode.

---

## 🚀 How to Run Locally

Because there is zero build step, you can run this repository with any static file server:

### Option 1: Python HTTP Server (Recommended)
```bash
python3 -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

### Option 2: Node Serve / npx
```bash
npx -y serve .
```

### Option 3: Direct File Open
Simply double-click `index.html` in your file explorer.

---

## 🚢 Deployment Steps

### Deploy to Netlify
1. Drag and drop the project folder into [app.netlify.com/drop](https://app.netlify.com/drop).
2. It deploys in under 5 seconds with zero configuration required!

### Deploy to GitHub Pages
1. Push this repository to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/lumo-dream-delivery.git
   git branch -M main
   git push -u origin main
   ```
2. In your GitHub repository settings, go to **Pages** > **Branch: main** > **Save**.
3. Your site will be live at `https://<your-username>.github.io/lumo-dream-delivery/`.

### Deploy to Vercel
```bash
npx vercel .
```

---

## 📜 Credits & Acknowledgments

- **Character & World Creation:** *Lumo the Baby Moon-Cloud* — 100% original creation designed for the Baby Hackathon.
- **Typography:**
  - *Fredoka* (Display) by Milena Brandao (Google Fonts)
  - *Nunito* (Body) by Vernon Adams (Google Fonts)
  - *VT323* (Pixel Monospace) by Peter Hull (Google Fonts)
- **Animation Framework:** GSAP & ScrollTrigger by GreenSock via cdnjs.
- **Audio:** Procedural Web Audio API sound generator (custom code, zero external media).
- **Pair Programming & Code Craft:** Antigravity (Google DeepMind).

*© 2026 Lumo's Dream Delivery Service. May your pillow always be the cool side.* 🌙✨
