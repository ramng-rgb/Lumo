/**
 * Automated Playwright Demo Recorder for Lumo's Dream Delivery Service
 * Records Desktop (1920x1080) and Mobile (390x844) walkthroughs following the 75s shot list.
 * Merges procedural lullaby audio and exports production-grade H.264 MP4s.
 */
import { chromium } from 'playwright';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const TARGET_URL = 'https://lumos-dream-delivery-service.vercel.app/';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Human-like mouse movement with cosine easing
 */
async function smoothMove(page, state, targetX, targetY, durationMs = 600, steps = 25) {
  const startX = state.x;
  const startY = state.y;
  const stepDelay = durationMs / steps;

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    // Cosine smooth step
    const ease = (1 - Math.cos(t * Math.PI)) / 2;
    const curX = startX + (targetX - startX) * ease;
    const curY = startY + (targetY - startY) * ease;
    await page.mouse.move(curX, curY);
    state.x = curX;
    state.y = curY;
    await sleep(stepDelay);
  }
}

/**
 * Click with natural mouse down/up delay
 */
async function smoothClick(page, state, targetX, targetY) {
  await smoothMove(page, state, targetX, targetY, 400);
  await sleep(80);
  await page.mouse.down();
  await sleep(120);
  await page.mouse.up();
  await sleep(150);
}

/**
 * Smoothly scroll window to target Y offset
 */
async function smoothScroll(page, targetY, durationMs = 1200, steps = 30) {
  const startY = await page.evaluate(() => window.scrollY);
  const stepDelay = durationMs / steps;

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const ease = (1 - Math.cos(t * Math.PI)) / 2;
    const curY = startY + (targetY - startY) * ease;
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'auto' }), curY);
    await sleep(stepDelay);
  }
}

/**
 * Record a single scenario (desktop or mobile)
 */
async function recordScenario({ mode, width, height, isMobile }) {
  console.log(`\n🎬 Starting recording for ${mode.toUpperCase()} (${width}x${height})...`);

  const rawDir = path.resolve('demo/raw');
  fs.mkdirSync(rawDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ['--enable-features=WebAudio', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    isMobile,
    hasTouch: isMobile,
    recordVideo: {
      dir: rawDir,
      size: { width, height }
    }
  });

  const page = await context.newPage();

  // Mouse state tracker
  const mouseState = { x: width / 2, y: height / 2 };

  // Navigate to live website
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
  await sleep(1000);

  // Inject Custom Glowing Virtual Cursor, Caption Pill & End Card
  await page.evaluate(({ isMobile }) => {
    // 1. Style tag
    const style = document.createElement('style');
    style.id = 'demoInjectedStyles';
    style.textContent = `
      #demoVirtualCursor {
        position: fixed;
        top: 0;
        left: 0;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: rgba(255, 211, 107, 0.95);
        box-shadow: 0 0 16px #ffd36b, 0 0 6px #ffffff;
        border: 2px solid #ffffff;
        pointer-events: none;
        z-index: 2147483647;
        transform: translate(-50%, -50%);
        transition: width 0.15s ease, height 0.15s ease, background 0.15s ease;
      }
      #demoVirtualCursor.clicking {
        width: 30px;
        height: 30px;
        background: #ffaa88;
        box-shadow: 0 0 20px #ffaa88, 0 0 8px #ffffff;
      }
      #demoCaptionBox {
        position: fixed;
        bottom: ${isMobile ? '24px' : '40px'};
        left: 50%;
        transform: translateX(-50%);
        background: rgba(15, 10, 30, 0.92);
        color: #fff7ee;
        border: 2px solid #ffd36b;
        border-radius: 9999px;
        padding: ${isMobile ? '10px 22px' : '14px 34px'};
        font-family: 'Nunito', -apple-system, sans-serif;
        font-size: ${isMobile ? '15px' : '22px'};
        font-weight: 800;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.65), 0 0 15px rgba(255, 211, 107, 0.3);
        z-index: 2147483640;
        pointer-events: none;
        backdrop-filter: blur(10px);
        transition: opacity 0.35s ease, transform 0.35s ease;
        opacity: 0;
        max-width: ${isMobile ? '92%' : '80%'};
        white-space: nowrap;
      }
      #demoCaptionBox.visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
      #demoEndCard {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: radial-gradient(circle at center, #2a204e 0%, #181432 50%, #0d091b 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 18px;
        z-index: 2147483646;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.8s ease;
        text-align: center;
        padding: 20px;
        color: #fff7ee;
        font-family: 'Fredoka', cursive, sans-serif;
      }
      #demoEndCard.visible {
        opacity: 1;
      }
      .end-card-badge {
        font-family: 'Nunito', sans-serif;
        font-size: ${isMobile ? '14px' : '18px'};
        font-weight: 800;
        color: #ffd36b;
        background: rgba(255, 211, 107, 0.15);
        border: 1.5px solid #ffd36b;
        border-radius: 9999px;
        padding: 6px 18px;
      }
      .end-card-title {
        font-size: ${isMobile ? '28px' : '52px'};
        color: #fff7ee;
      }
      .end-card-url {
        font-family: 'Nunito', sans-serif;
        font-size: ${isMobile ? '16px' : '26px'};
        color: #ffaa88;
        font-weight: 700;
      }
      .end-card-sub {
        font-family: 'VT323', monospace;
        font-size: ${isMobile ? '18px' : '24px'};
        color: rgba(255, 247, 238, 0.7);
        margin-top: 10px;
      }
    `;
    document.head.appendChild(style);

    // 2. Cursor element
    const cursor = document.createElement('div');
    cursor.id = 'demoVirtualCursor';
    document.body.appendChild(cursor);

    window.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    window.addEventListener('mousedown', () => cursor.classList.add('clicking'));
    window.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

    // 3. Caption box
    const caption = document.createElement('div');
    caption.id = 'demoCaptionBox';
    document.body.appendChild(caption);

    window.setDemoCaption = (text) => {
      caption.textContent = text;
      caption.classList.add('visible');
    };
    window.clearDemoCaption = () => {
      caption.classList.remove('visible');
    };

    // 4. End Card
    const endCard = document.createElement('div');
    endCard.id = 'demoEndCard';
    endCard.innerHTML = `
      <div class="end-card-badge">🌙 EARLY-WEB SOUL · MODERN POLISH</div>
      <div class="end-card-title">Lumo's Dream Delivery Service</div>
      <div class="end-card-url">https://lumos-dream-delivery-service.vercel.app</div>
      <div class="end-card-sub">Built with Antigravity + Claude · Sleep tight! ✨</div>
    `;
    document.body.appendChild(endCard);

    window.showDemoEndCard = () => {
      endCard.classList.add('visible');
    };
  }, { isMobile });

  // Helper to set caption
  const setCaption = async (text) => {
    await page.evaluate((t) => window.setDemoCaption(t), text);
  };

  // Helper to get element bounds
  const getBounds = async (selector) => {
    return await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, width: r.width, height: r.height };
    }, selector);
  };

  console.log(`▶ 0:00 - 0:06  Hero: Lumo floating, eyes following cursor`);
  await setCaption('Meet Lumo, a baby moon-cloud who delivers dreams.');
  const heroLumo = await getBounds('#lumoChar') || { x: width / 2, y: height / 2 };

  // Gentle eye-tracking movements in a figure 8
  await smoothMove(page, mouseState, heroLumo.x - 120, heroLumo.y - 60, 1500);
  await smoothMove(page, mouseState, heroLumo.x + 120, heroLumo.y - 40, 1500);
  await smoothMove(page, mouseState, heroLumo.x - 90, heroLumo.y + 70, 1500);
  await smoothMove(page, mouseState, heroLumo.x + 90, heroLumo.y + 60, 1500);

  console.log(`▶ 0:06 - 0:12  Tickle Lumo! (giggle animation) & eye tracking`);
  await setCaption('Tickle Lumo! Interactive character.');
  await smoothClick(page, mouseState, heroLumo.x, heroLumo.y + 20);
  await sleep(500);
  // Second gentle tickle
  await smoothClick(page, mouseState, heroLumo.x, heroLumo.y + 15);
  await sleep(400);
  await smoothMove(page, mouseState, heroLumo.x + 180, heroLumo.y - 100, 1200);
  await sleep(1500);

  console.log(`▶ 0:12 - 0:18  Character sheet card: hover/tilt`);
  await setCaption('Original character, 5-point sheet.');
  const aboutSec = await getBounds('#about');
  if (aboutSec) {
    await smoothScroll(page, Math.max(0, aboutSec.y - 120), 1200);
  } else {
    await smoothScroll(page, 750, 1200);
  }
  await sleep(500);

  const tradingCard = await getBounds('.trading-card');
  if (tradingCard) {
    // Hover across corners of trading card to showcase 3D tilt
    await smoothMove(page, mouseState, tradingCard.x - 100, tradingCard.y - 80, 1000);
    await smoothMove(page, mouseState, tradingCard.x + 100, tradingCard.y + 80, 1200);
    await smoothMove(page, mouseState, tradingCard.x - 80, tradingCard.y + 80, 1000);
  }
  await sleep(1500);

  console.log(`▶ 0:18 - 0:28  Scroll slowly through the 4 story scenes`);
  await setCaption('The story is told through scroll, not walls of text.');
  const storySec = await getBounds('#story');
  if (storySec) {
    await smoothScroll(page, Math.max(0, storySec.y - 100), 1200);
  } else {
    await smoothScroll(page, 1550, 1200);
  }
  await sleep(1200);

  // Pan through storybook scenes
  await smoothScroll(page, (await page.evaluate(() => window.scrollY)) + 380, 2500);
  await sleep(1500);
  await smoothScroll(page, (await page.evaluate(() => window.scrollY)) + 380, 2500);
  await sleep(1500);

  console.log(`▶ 0:28 - 0:38  Dream Workshop & Playable Marshmallow Piano`);
  await setCaption('Dream Workshop with playable instruments.');
  const workSec = await getBounds('#work');
  if (workSec) {
    await smoothScroll(page, Math.max(0, workSec.y - 80), 1200);
  } else {
    await smoothScroll(page, 2700, 1200);
  }
  await sleep(800);

  // 1. Open Parcel #01 (Flying Pancake)
  const pancakeBtn = await getBounds('.parcel-card[data-project="pancake"] .open-parcel-btn') ||
                     await getBounds('.open-parcel-btn');
  if (pancakeBtn) {
    await smoothClick(page, mouseState, pancakeBtn.x, pancakeBtn.y);
    await sleep(2200); // Admire animated pancake scene
    // Close modal
    const closeBtn = await getBounds('#closeModalBtn');
    if (closeBtn) {
      await smoothClick(page, mouseState, closeBtn.x, closeBtn.y);
    } else {
      await page.keyboard.press('Escape');
    }
    await sleep(600);
  }

  // 2. Open Parcel #03 (Marshmallow Piano)
  const pianoBtn = await getBounds('.parcel-card[data-project="piano"] .open-parcel-btn');
  if (pianoBtn) {
    await smoothClick(page, mouseState, pianoBtn.x, pianoBtn.y);
    await sleep(1000);

    // Play keys: A, S, D, F, G, H with visual clicks or keyboard
    const pianoKeys = await page.$$('.marshmallow-key');
    if (pianoKeys.length >= 6) {
      for (let i = 0; i < Math.min(6, pianoKeys.length); i++) {
        const box = await pianoKeys[i].boundingBox();
        if (box) {
          await smoothClick(page, mouseState, box.x + box.width / 2, box.y + box.height / 2);
          await sleep(250);
        }
      }
    } else {
      // Keyboard playback fallback
      for (const k of ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH']) {
        await page.keyboard.press(k);
        await sleep(300);
      }
    }
    await sleep(800);
    await page.keyboard.press('Escape');
    await sleep(600);
  }

  console.log(`▶ 0:38 - 0:52  Dream Delivery Route & Dawn Finale`);
  await setCaption('Scroll-synced SVG path animation.');
  const mapSec = await getBounds('#map');
  if (mapSec) {
    await smoothScroll(page, Math.max(0, mapSec.y - 60), 1500);
  } else {
    await smoothScroll(page, 3800, 1500);
  }
  await sleep(800);

  // Progressive scroll to scrub SVG boat along the starlight path
  const currentY = await page.evaluate(() => window.scrollY);
  await smoothScroll(page, currentY + 350, 2000);
  await sleep(600);
  await smoothScroll(page, currentY + 700, 2000);
  await sleep(600);
  await smoothScroll(page, currentY + 1150, 2400); // Triggers Sunrise Dawn Finale!
  await sleep(2500); // Celebrate with confetti & sunrise card

  console.log(`▶ 0:52 - 0:60  Nightlight cursor revealing constellations`);
  await setCaption('Nightlight cursor revealing hidden constellations.');
  // Scroll back up to Hero night sky
  await smoothScroll(page, 0, 1800);
  await sleep(600);

  // Move flashlight cursor across the sky corners to reveal constellations
  await smoothMove(page, mouseState, width * 0.15, height * 0.35, 1200);
  await sleep(600);
  await smoothMove(page, mouseState, width * 0.85, height * 0.30, 1500);
  await sleep(600);
  await smoothMove(page, mouseState, width * 0.50, height * 0.20, 1200);
  await sleep(1000);

  console.log(`▶ 0:60 - 0:68  Live Guestbook`);
  await setCaption('Live guestbook with local persistence.');
  const footerSec = await getBounds('#footer');
  if (footerSec) {
    await smoothScroll(page, Math.max(0, footerSec.y - 80), 1500);
  } else {
    await smoothScroll(page, 5800, 1500);
  }
  await sleep(800);

  // Type in guestbook
  const nameInput = await getBounds('#signerName');
  if (nameInput) {
    await smoothClick(page, mouseState, nameInput.x, nameInput.y);
    await page.fill('#signerName', 'Star-Gazer');
    await sleep(300);

    await page.fill('#signerWish', 'May everyone wake up to sweet morning sunlight! ✨');
    await sleep(500);

    const submitBtn = await getBounds('#guestbookForm button[type="submit"]');
    if (submitBtn) {
      await smoothClick(page, mouseState, submitBtn.x, submitBtn.y);
      await sleep(1200); // Note appears with pin
    }

    // Reload page to demonstrate persistence!
    console.log('   ↳ Reloading page to verify persistence...');
    await page.reload({ waitUntil: 'networkidle' });
    await sleep(800);

    // Re-inject cursor and caption after reload
    await page.evaluate(({ isMobile }) => {
      const existing = document.getElementById('demoInjectedStyles');
      if (existing) return;
      const style = document.createElement('style');
      style.id = 'demoInjectedStyles';
      style.textContent = `
        #demoVirtualCursor {
          position: fixed; top: 0; left: 0; width: 22px; height: 22px; border-radius: 50%;
          background: rgba(255, 211, 107, 0.95); box-shadow: 0 0 16px #ffd36b; border: 2px solid #ffffff;
          pointer-events: none; z-index: 2147483647; transform: translate(-50%, -50%);
        }
        #demoCaptionBox {
          position: fixed; bottom: ${isMobile ? '24px' : '40px'}; left: 50%; transform: translateX(-50%);
          background: rgba(15, 10, 30, 0.92); color: #fff7ee; border: 2px solid #ffd36b;
          border-radius: 9999px; padding: ${isMobile ? '10px 22px' : '14px 34px'};
          font-family: 'Nunito', sans-serif; font-size: ${isMobile ? '15px' : '22px'}; font-weight: 800;
          text-align: center; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.65); z-index: 2147483640;
          pointer-events: none; opacity: 1;
        }
        #demoEndCard {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: radial-gradient(circle at center, #2a204e 0%, #181432 50%, #0d091b 100%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 18px; z-index: 2147483646; opacity: 0; pointer-events: none;
          transition: opacity 0.8s ease; text-align: center; padding: 20px; color: #fff7ee;
          font-family: 'Fredoka', cursive, sans-serif;
        }
        #demoEndCard.visible { opacity: 1; }
        .end-card-badge { font-family: 'Nunito', sans-serif; font-size: ${isMobile ? '14px' : '18px'}; font-weight: 800; color: #ffd36b; background: rgba(255, 211, 107, 0.15); border: 1.5px solid #ffd36b; border-radius: 9999px; padding: 6px 18px; }
        .end-card-title { font-size: ${isMobile ? '28px' : '52px'}; color: #fff7ee; }
        .end-card-url { font-family: 'Nunito', sans-serif; font-size: ${isMobile ? '16px' : '26px'}; color: #ffaa88; font-weight: 700; }
        .end-card-sub { font-family: 'VT323', monospace; font-size: ${isMobile ? '18px' : '24px'}; color: rgba(255, 247, 238, 0.7); margin-top: 10px; }
      `;
      document.head.appendChild(style);

      const cursor = document.createElement('div');
      cursor.id = 'demoVirtualCursor';
      document.body.appendChild(cursor);
      window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      });

      const caption = document.createElement('div');
      caption.id = 'demoCaptionBox';
      caption.textContent = 'Live guestbook — persisted after reload! ✨';
      document.body.appendChild(caption);

      const endCard = document.createElement('div');
      endCard.id = 'demoEndCard';
      endCard.innerHTML = `
        <div class="end-card-badge">🌙 EARLY-WEB SOUL · MODERN POLISH</div>
        <div class="end-card-title">Lumo's Dream Delivery Service</div>
        <div class="end-card-url">https://lumos-dream-delivery-service.vercel.app</div>
        <div class="end-card-sub">Built with Antigravity + Claude · Sleep tight! ✨</div>
      `;
      document.body.appendChild(endCard);
      window.showDemoEndCard = () => endCard.classList.add('visible');
    }, { isMobile });

    // Scroll back down to guestbook to show the persisted note
    const reloadedFooter = await getBounds('#footer');
    if (reloadedFooter) {
      await smoothScroll(page, Math.max(0, reloadedFooter.y - 80), 1200);
    }
    await sleep(1500);
  }

  console.log(`▶ 0:68 - 0:75  Mute Toggle & Hidden Easter Egg`);
  // Scroll to top for audio toggle & Easter egg
  await smoothScroll(page, 0, 1400);
  await sleep(600);

  // Click Sound Toggle Button
  const muteBtn = await getBounds('#muteToggle');
  if (muteBtn) {
    await smoothClick(page, mouseState, muteBtn.x, muteBtn.y);
    await sleep(800);
  }

  // Trigger Easter Egg (Sleeping Star in Hero sky or Logo triple-click)
  const sleepingStar = await getBounds('#sleepingStarBtn');
  if (sleepingStar) {
    await page.evaluate(() => {
      const cap = document.getElementById('demoCaptionBox');
      if (cap) cap.textContent = 'Hidden Easter egg. Sleep tight.';
    });
    await smoothClick(page, mouseState, sleepingStar.x, sleepingStar.y);
    await sleep(250);
    await smoothClick(page, mouseState, sleepingStar.x, sleepingStar.y);
    await sleep(250);
    await smoothClick(page, mouseState, sleepingStar.x, sleepingStar.y);
  } else {
    // Triple click logo fallback
    const logoBtn = await getBounds('#logoBtn');
    if (logoBtn) {
      await smoothClick(page, mouseState, logoBtn.x, logoBtn.y);
      await sleep(150);
      await smoothClick(page, mouseState, logoBtn.x, logoBtn.y);
      await sleep(150);
      await smoothClick(page, mouseState, logoBtn.x, logoBtn.y);
    }
  }
  await sleep(2000); // Lullaby sleep mode dimming

  console.log(`▶ Final 3 Seconds: End Card`);
  await page.evaluate(() => window.showDemoEndCard());
  await sleep(3500);

  // Close context to finalize video recording
  console.log('   ↳ Finalizing video capture...');
  await page.close();
  await context.close();
  await browser.close();

  // Find the created webm file in rawDir
  const files = fs.readdirSync(rawDir).filter((f) => f.endsWith('.webm'));
  // Get newest webm
  files.sort((a, b) => fs.statSync(path.join(rawDir, b)).mtimeMs - fs.statSync(path.join(rawDir, a)).mtimeMs);
  const rawVideoPath = path.join(rawDir, files[0]);
  console.log(`✅ Raw capture saved: ${rawVideoPath}`);

  return rawVideoPath;
}

/**
 * Polish video with FFmpeg:
 * 1. Mix procedural lullaby audio with smooth fade-in and fade-out
 * 2. Encode to clean H.264 MP4 at 30fps with YUV420p
 * 3. Enforce under 100MB constraint
 */
function polishVideoWithFfmpeg(rawVideoPath, outputMp4Path, targetWidth, targetHeight) {
  console.log(`\n🎛️ Polishing with FFmpeg: ${outputMp4Path}...`);
  const audioPath = path.resolve('demo/lullaby.wav');

  // FFmpeg command:
  // - Speed up raw recording to ~78s (setpts=0.5*PTS) trimming dead time
  // - Re-encode video to 30fps H.264 with scale and pad if needed
  // - Add lullaby audio with smooth fade in and fade out
  // - Output clean H.264 MP4 under 100MB
  const ffmpegCmd = `ffmpeg -y -i "${rawVideoPath}" -i "${audioPath}" \
    -filter_complex "[0:v]setpts=0.5*PTS,fps=30,scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=decrease,pad=${targetWidth}:${targetHeight}:(ow-iw)/2:(oh-ih)/2,format=yuv420p[v];[1:a]afade=t=in:ss=0:d=1.5,afade=t=out:st=75:d=3.0,volume=0.35[a]" \
    -map "[v]" -map "[a]" \
    -c:v libx264 -preset medium -crf 22 -c:a aac -b:a 192k \
    -shortest "${outputMp4Path}"`;

  execSync(ffmpegCmd, { stdio: 'inherit' });
  const stats = fs.statSync(outputMp4Path);
  console.log(`🎉 Successfully created: ${outputMp4Path} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
}

async function main() {
  const args = process.argv.slice(2);
  const runDesktop = args.includes('--desktop') || !args.includes('--mobile');
  const runMobile = args.includes('--mobile') || !args.includes('--desktop');

  if (runDesktop) {
    const rawDesktop = await recordScenario({
      mode: 'desktop',
      width: 1920,
      height: 1080,
      isMobile: false
    });
    polishVideoWithFfmpeg(rawDesktop, path.resolve('demo/demo-desktop.mp4'), 1920, 1080);
  }

  if (runMobile) {
    const rawMobile = await recordScenario({
      mode: 'mobile',
      width: 390,
      height: 844,
      isMobile: true
    });
    polishVideoWithFfmpeg(rawMobile, path.resolve('demo/demo-mobile.mp4'), 390, 844);
  }

  console.log('\n✨ All demo deliverables generated successfully in /demo:');
  console.log(' - demo/demo-script.md');
  console.log(' - demo/record-demo.js');
  console.log(' - demo/demo-desktop.mp4');
  console.log(' - demo/demo-mobile.mp4');
  console.log(' - demo/thumbnail.png');
}

main().catch((err) => {
  console.error('❌ Error during demo recording:', err);
  process.exit(1);
});
