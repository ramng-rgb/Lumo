# 🌙 Lumo's Dream Delivery Service
> *"Sleep tight. I'm on my way."*

A cozy, immersive, hackathon-winning portfolio website for an **100% original baby character: Lumo the Baby Moon-Cloud**. Built with early-web soul—nostalgic charm, chunky buttons, tiled starlight, and retro window-chrome—paired with modern web standards, handcrafted SVG animations, Web Audio synthesis, and zero external runtime dependencies.

---

## 🌐 Live URL & Repository
- **Production Live URL:** [https://lumos-dream-delivery-service.vercel.app](https://lumos-dream-delivery-service.vercel.app)
- **GitHub Repository:** [https://github.com/ramng-rgb/Lumo](https://github.com/ramng-rgb/Lumo)
- **Demo Video (YouTube / Google Drive):** [https://youtu.be/PLACEHOLDER_DEMO_VIDEO](https://youtu.be/PLACEHOLDER_DEMO_VIDEO) *(Unlisted Demo Walkthrough)*


---

## ☁️ 5-Point Character Sheet (Track 2: Original Baby Character)

| Point | Specification |
| :--- | :--- |
| **1. Name** | **Lumo** (they/them) |
| **2. What they are** | A round, squishy baby moon-cloud with a golden crescent curl on their head, rosy blushing cheeks, stubby little arms, and a warm glowing belly that acts as a gentle bedtime nightlight. |
| **3. What they do** | Operates the **Dream Delivery Service**, carefully folding golden paper boats packed with sweet dreams and sailing them to sleeping villages across the starlit sky before first light. |
| **4. Their story** | Lumo was born from the final wisp of a lost bedtime lullaby that drifted into the clouds. After a lonely first night searching for where forgotten lullabies go, Lumo discovered that every sleeping child creates sweet, fragile dreams needing safe passage past dark night shadows. Guided by their glowing nightlight belly, Lumo took flight with a fleet of paper boats. |
| **5. Tagline** | *“Sleep tight. I’m on my way.”* |

---

## 📖 Story Behind the Build

In the frantic era of sterile, hyper-monetized web apps, we wanted to resurrect the **warmth, whimsy, and cozy wonder of the early web (late 90s and early 2000s personal homepages)**: retro OS title bars, mechanical rolling hit counters, guestbook sticky-note walls, webrings, and secret Easter eggs.

**Lumo** was conceived as a gentle antidote to bedtime anxiety. Everything in this site is handcrafted from scratch without third-party design systems or commercial characters:
- Handcrafted SVG illustrations for Lumo's body, expressions, paper boats, and sleeping towns.
- Atmospheric scroll gradient that transitions organically from twilight dusk into deep starry midnight and finally into a blushing peach-gold sunrise at Sunrise Cove.
- Strict constraint: **Every section is under 150 words**, prioritizing story through interaction, sound, and motion rather than walls of text.

---

## 🌟 Proudest Features

### 1. The Dawn Finale (Signature Delivery Milestone)
When the user scrolls the Delivery Route to 100%:
- The entire sky transitions dynamically into a warm peach, pink, and gold sunrise.
- The paper boat docks at Sunrise Cove, the lighthouse illuminates, and all five villages glow in unison.
- A celebratory star confetti shower bursts across the screen, the odometer increments by +1, and wind chimes ring out.
- A sleepy celebration card appears showing Lumo curled up fast asleep with floating "z z z" and an interactive *"Deliver Another Dream ⛵"* replay button.

### 2. "Deliver a Dream to Me" Custom Bedtime Origami
A personalized dream generator:
- Visitors type their name (up to 20 characters, sanitized).
- Tapping *"Pack My Dream ⛵"* triggers a paper-boat folding animation.
- Generates a whimsical, poetic dream from curated word combinations (e.g. *"Maya, tonight you ride a toasted marshmallow whale over a warm pancake sea..."*).
- Features an animated wax-seal pop, a *"Copy Dream 📋"* button with starlight clipboard toast, and auto-increments the worldwide odometer.

### 3. Playable Marshmallow Piano & Animated Looping Scenes
- **Parcel #03 (The Marshmallow Piano Dream):** Opens an accessible modal with **8 squishy pastel keys** tuned to a pure pentatonic scale (C5 through E6). Keys bounce on tap/click and respond to physical keyboard keys `A, S, D, F, G, H, J, K`, synthesizing warm marimba chimes with zero audio files.
- **Parcels #01 & #02:** Feature pure SVG looping animations—stack of golden pancakes with dripping syrup and rising steam wisps, and a luminescent jellyfish bobbing between coral shelves with floating bubbles and a drifting bedtime book.
- Full accessibility: focus trap within modal and `Escape`-to-close support.

### 4. Interactive Lumo Companion
- A tiny baby moon-cloud peeks from the bottom-right corner.
- Reacts to the current viewport section with section-aware thought bubbles (💤 in Hero, 💛 in About, ✨ in Story, 🥞 in Work, ⛵ on Map, 📝 in Footer).
- Wiggles with squish physics and plays an adorable giggle chime when tapped.
- Automatically hides on screens narrower than 380px to prevent content overlap.

### 5. Scroll-Driven Delivery Route & Nightlight Flashlight
- **Delivery Map:** 5 illustrated towns (*Slumberton, Starfall Glade, Pillow Peak, Dewdrop Hollow, Sunrise Cove*) along an SVG starlight path scrubbed by scroll progress with traveler orientation tangents.
- **Nightlight Cursor:** Dynamic radial-gradient mask that reveals secret constellations and sleeping creatures in the night sky on desktop mouse movement and mobile touch drags.

### 6. 100% In-Browser Web Audio Synthesizer
- Zero external `.mp3` or `.wav` files.
- Real-time procedural oscillators (sine, triangle) synthesizing giggles, wind chimes, piano notes, and Brahms lullaby music boxes.
- Muted by default on fresh load, unlocked on user gesture, with accessible fixed mute toggle button and `localStorage` memory.

### 7. Early-Web Soul & Side Quests
- **Live Hit Counter Odometer:** Mechanical rolling digit display synchronized across marquee and generator.
- **Sticky-Note Guestbook:** Persistent `localStorage` wish wall with cozy profanity safety and pin rotation.
- **Sparkle Cursor Trail:** 60fps pooled canvas sparkles following mouse and mobile touch taps.
- **Konami Code & Sleeping Star:** Triple-clicking logo or tapping the hidden star triggers deep lullaby sleep mode and secret certificates.
- **Responsive Chaos Mode:** Live-updating resolution badge with zero horizontal overflow across 360px, 390px, 768px, and desktop displays.

---

## 🛠️ Technology Stack

- **Markup & Layout:** Semantic HTML5, CSS Grid, Flexbox, Container Queries.
- **Typography:** Google Fonts (*Fredoka*, *Nunito*, *VT323*).
- **Animation:** GSAP 3.12.5 & ScrollTrigger via cdnjs.
- **Sound:** In-browser Web Audio API synthesis.
- **Zero Build Step:** 100% vanilla JavaScript (ES6+), zero dependencies or bundlers required.

---

## 🚀 How to Run Locally

```bash
# Option 1: Python HTTP server
python3 -m http.server 8080

# Option 2: Node npx serve
npx -y serve .
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🚢 Deployment Instructions

### Deploy to Netlify
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop this folder (`babyhack`).
3. Your site is live instantly!

### Deploy to GitHub Pages
1. Push to your GitHub repository:
   ```bash
   git remote add origin https://github.com/<your-username>/lumo-dream-delivery.git
   git branch -M main
   git push -u origin main
   ```
2. In GitHub repository settings, navigate to **Pages** > **Source: Deploy from branch `main`**.

---

## 📜 Credits & Acknowledgments

- **Character:** *Lumo the Baby Moon-Cloud* — 100% original creation.
- **Typography:** Google Fonts (*Fredoka* by Milena Brandao, *Nunito* by Vernon Adams, *VT323* by Peter Hull).
- **Libraries:** GreenSock GSAP 3.12.5 & ScrollTrigger via CDN.
- **Audio:** Custom procedural Web Audio API synthesis.
- **AI Tools:** Crafted with **Antigravity** (Google DeepMind) and **Claude**.

*© 2026 Lumo's Dream Delivery Service. May your pillow always have the cool side.* 🌙✨
