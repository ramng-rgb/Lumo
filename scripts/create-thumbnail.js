/**
 * High-Resolution 1280x720 Thumbnail Generator for Lumo's Dream Delivery Service
 * Renders Lumo, glowing night sky, crescent curl, star particles, and title typography.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Nunito:wght@700;800&family=VT323&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1280px;
      height: 720px;
      overflow: hidden;
      font-family: 'Fredoka', cursive, sans-serif;
      background: radial-gradient(circle at 75% 45%, #2a204e 0%, #181432 45%, #0f0a1e 100%);
      position: relative;
      color: #fff7ee;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 80px;
    }

    /* Starlight background dots */
    .star {
      position: absolute;
      border-radius: 50%;
      background: #ffd36b;
      opacity: 0.6;
    }

    /* Left side text block */
    .text-container {
      max-width: 620px;
      z-index: 10;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 211, 107, 0.15);
      border: 2px solid #ffd36b;
      padding: 8px 18px;
      border-radius: 9999px;
      font-family: 'Nunito', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: #ffd36b;
      margin-bottom: 24px;
      box-shadow: 0 4px 15px rgba(255, 211, 107, 0.2);
    }

    h1 {
      font-size: 64px;
      line-height: 1.15;
      color: #fff7ee;
      text-shadow: 0 4px 20px rgba(0,0,0,0.6);
      margin-bottom: 16px;
    }

    h1 span {
      color: #ffd36b;
    }

    .tagline {
      font-family: 'Nunito', sans-serif;
      font-size: 26px;
      font-weight: 600;
      color: #ffaa88;
      margin-bottom: 24px;
    }

    .pills-row {
      display: flex;
      gap: 12px;
    }

    .pill {
      font-family: 'Nunito', sans-serif;
      font-size: 16px;
      font-weight: 700;
      background: rgba(255, 247, 238, 0.12);
      border: 1px solid rgba(255, 247, 238, 0.25);
      padding: 6px 14px;
      border-radius: 12px;
      color: #fff7ee;
    }

    /* Right side Lumo Showcase */
    .lumo-showcase {
      position: relative;
      width: 480px;
      height: 480px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }

    .lumo-glow {
      position: absolute;
      width: 380px;
      height: 380px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 211, 107, 0.4) 0%, rgba(255, 170, 136, 0.15) 50%, transparent 70%);
      filter: blur(20px);
    }

    .lumo-svg {
      width: 420px;
      height: 420px;
      position: relative;
      filter: drop-shadow(0 15px 30px rgba(0,0,0,0.5));
    }

    .credit-badge {
      position: absolute;
      bottom: 24px;
      right: 40px;
      font-family: 'VT323', monospace;
      font-size: 22px;
      color: rgba(255, 247, 238, 0.6);
      background: rgba(15, 10, 30, 0.7);
      padding: 6px 14px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  </style>
</head>
<body>
  <!-- Starlight dots -->
  <div class="star" style="top: 80px; left: 120px; width: 6px; height: 6px;"></div>
  <div class="star" style="top: 140px; left: 450px; width: 4px; height: 4px;"></div>
  <div class="star" style="top: 600px; left: 200px; width: 5px; height: 5px;"></div>
  <div class="star" style="top: 220px; left: 620px; width: 8px; height: 8px; opacity: 0.8;"></div>
  <div class="star" style="top: 520px; left: 580px; width: 4px; height: 4px;"></div>
  <div class="star" style="top: 90px; right: 180px; width: 6px; height: 6px;"></div>
  <div class="star" style="top: 560px; right: 140px; width: 5px; height: 5px;"></div>

  <div class="text-container">
    <div class="badge">🌙 ORIGINAL CHARACTER PORTFOLIO</div>
    <h1>Lumo's Dream <span>Delivery Service</span></h1>
    <div class="tagline">“Sleep tight. I'm on my way.” ⛵✨</div>
    <div class="pills-row">
      <div class="pill">✨ 100% Original Character</div>
      <div class="pill">🎵 Web Audio Piano</div>
      <div class="pill">⛵ Scroll-Synced Path</div>
      <div class="pill">💛 Early-Web Soul</div>
    </div>
  </div>

  <div class="lumo-showcase">
    <div class="lumo-glow"></div>
    <svg class="lumo-svg" viewBox="0 0 200 200">
      <!-- Glow Aura -->
      <circle cx="100" cy="115" r="48" fill="#ffd36b" opacity="0.85" filter="drop-shadow(0 0 15px #ffd36b)" />
      <circle cx="100" cy="115" r="28" fill="#ffe39a" opacity="0.9" />

      <!-- Lumo Main Cloud Body -->
      <path d="M 50 120 
               C 30 110, 25 85, 45 70 
               C 50 45, 80 40, 100 50 
               C 120 40, 150 45, 155 70 
               C 175 85, 170 110, 150 120 
               C 160 145, 130 165, 100 155 
               C 70 165, 40 145, 50 120 Z" 
            fill="#fff7ee" 
            stroke="#3b1f4a" 
            stroke-width="5" 
            stroke-linejoin="round" />

      <!-- Golden Crescent Forehead Curl -->
      <path d="M 98 42 C 114 48, 112 64, 98 70 C 92 72, 84 70, 84 70 C 96 64, 98 52, 90 46 Z" 
            fill="#ffd36b" 
            stroke="#d49b25" 
            stroke-width="3" />

      <!-- Cute Blinking Eyes -->
      <circle cx="86" cy="92" r="6" fill="#2a1e3b" />
      <circle cx="84" cy="89" r="2" fill="#ffffff" />
      <circle cx="114" cy="92" r="6" fill="#2a1e3b" />
      <circle cx="112" cy="89" r="2" fill="#ffffff" />

      <!-- Rosy Cheeks -->
      <ellipse cx="74" cy="102" rx="9" ry="5" fill="#ffc2d4" opacity="0.85" />
      <ellipse cx="126" cy="102" rx="9" ry="5" fill="#ffc2d4" opacity="0.85" />

      <!-- Sweet Smile -->
      <path d="M 94 105 Q 100 111 106 105" fill="none" stroke="#2a1e3b" stroke-width="3" stroke-linecap="round" />

      <!-- Stubby Little Waving Arm -->
      <ellipse cx="156" cy="92" rx="12" ry="8" fill="#fff7ee" stroke="#3b1f4a" stroke-width="4" transform="rotate(-20 156 92)" />
      <!-- Left Little Arm -->
      <ellipse cx="44" cy="102" rx="10" ry="7" fill="#fff7ee" stroke="#3b1f4a" stroke-width="4" transform="rotate(20 44 102)" />

      <!-- Tiny Gold Star in Nightlight -->
      <polygon points="100,108 103,114 109,115 105,119 106,125 100,122 94,125 95,119 91,115 97,114" fill="#d49b25" />
    </svg>
  </div>

  <div class="credit-badge">★ LUMO'S DREAM DELIVERY SERVICE ★</div>
</body>
</html>`;

async function generateThumbnail() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1
  });

  await page.setContent(htmlContent, { waitUntil: 'networkidle' });
  // Wait for fonts to fully render
  await page.waitForTimeout(1000);

  fs.mkdirSync('demo', { recursive: true });
  await page.screenshot({ path: 'demo/thumbnail.png' });
  await browser.close();
  console.log('✅ Generated 1280x720 thumbnail: demo/thumbnail.png');
}

generateThumbnail();
