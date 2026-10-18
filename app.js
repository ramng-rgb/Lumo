/**
 * LUMO'S DREAM DELIVERY SERVICE
 * Core Application Logic, Web Audio Synth, Immersion & Scroll Story Engine
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. STATE & STORAGE MANAGEMENT
     ========================================================================== */
  const state = {
    audioEnabled: false,
    audioMuted: true,
    audioContext: null,
    idleTimer: null,
    idleHintTimer: null,
    lastInteractionTime: Date.now(),
    isYawning: false,
    isSleeping: false,
    logoClickCount: 0,
    logoClickTimer: null,
    sleepingStarClicks: 0,
    konamiIndex: 0,
    deliveredDreamsCount: 1204,
    currentTownIndex: 0,
    lullabyOscillators: []
  };

  // Konami Code Sequence: Up Up Down Down Left Right Left Right B A
  const KONAMI_CODE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];

  /* ==========================================================================
     2. PURE WEB AUDIO SYNTHESIZER (Zero external sound files)
     ========================================================================== */
  const AudioEngine = {
    init() {
      if (!state.audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          state.audioContext = new AudioCtx();
        }
      }
      if (state.audioContext && state.audioContext.state === 'suspended') {
        state.audioContext.resume();
      }
    },

    playGiggle() {
      if (state.audioMuted || !state.audioContext) return;
      this.init();
      const ctx = state.audioContext;
      const now = ctx.currentTime;

      // Arpeggiated pitch-bent sine blips (Lumo giggling)
      const freqs = [587.33, 783.99, 880.0, 1046.5, 1174.66];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const startTime = now + idx * 0.055;
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, startTime + 0.06);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.07);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.08);
      });
    },

    playClick() {
      if (state.audioMuted || !state.audioContext) return;
      this.init();
      const ctx = state.audioContext;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    },

    playChime(noteFreq = 659.25) {
      if (state.audioMuted || !state.audioContext) return;
      this.init();
      const ctx = state.audioContext;
      const now = ctx.currentTime;

      // Soft wind chime / bell harmonic
      [1, 2.02, 3.01].forEach((multiplier, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(noteFreq * multiplier, now);

        const initialVol = 0.1 / (i + 1);
        gain.gain.setValueAtTime(initialVol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.2);
      });
    },

    playTownArrival() {
      if (state.audioMuted || !state.audioContext) return;
      // Dreamy town arrival chord: C6, E6, G6
      const chord = [1046.5, 1318.5, 1567.98];
      chord.forEach((freq, idx) => {
        setTimeout(() => this.playChime(freq), idx * 75);
      });
    },

    playLullaby() {
      if (state.audioMuted || !state.audioContext) return;
      this.init();
      const ctx = state.audioContext;
      const now = ctx.currentTime;

      // Music box melody notes (Brahms Lullaby opening phrase: G4, G4, Bb4...)
      const notes = [
        { f: 392.0, d: 0.35, t: 0 },
        { f: 392.0, d: 0.35, t: 0.4 },
        { f: 440.0, d: 0.7,  t: 0.8 },
        { f: 392.0, d: 0.4,  t: 1.6 },
        { f: 523.25, d: 0.8, t: 2.1 },
        { f: 493.88, d: 1.2, t: 3.0 }
      ];

      notes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        const startTime = now + n.t;
        osc.frequency.setValueAtTime(n.f, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + n.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + n.d + 0.05);
      });
    }
  };

  /* ==========================================================================
     3. AUDIO CONTROLS & MUTE TOGGLE
     ========================================================================== */
  function setupAudioControls() {
    const muteToggle = document.getElementById('muteToggle');
    const soundIcon = document.getElementById('soundIcon');
    const soundText = document.getElementById('soundText');

    // Retrieve saved state (default muted)
    const savedMute = localStorage.getItem('lumo_sound_muted');
    state.audioMuted = savedMute !== 'false'; // default true

    function updateMuteButtonUI() {
      if (state.audioMuted) {
        soundIcon.textContent = '🔇';
        soundText.textContent = 'Sound: OFF';
        muteToggle.setAttribute('aria-pressed', 'false');
        muteToggle.setAttribute('aria-label', 'Sound is muted. Click or press space to enable cozy chimes and lullabies');
        muteToggle.classList.remove('sound-active');
      } else {
        soundIcon.textContent = '🔔';
        soundText.textContent = 'Sound: ON';
        muteToggle.setAttribute('aria-pressed', 'true');
        muteToggle.setAttribute('aria-label', 'Sound is enabled. Click or press space to mute');
        muteToggle.classList.add('sound-active');
      }
    }

    updateMuteButtonUI();

    muteToggle.addEventListener('click', () => {
      AudioEngine.init();
      state.audioMuted = !state.audioMuted;
      localStorage.setItem('lumo_sound_muted', state.audioMuted ? 'true' : 'false');
      updateMuteButtonUI();

      if (!state.audioMuted) {
        AudioEngine.playChime(784);
      }
    });

    // Unlock AudioContext on very first user gesture anywhere
    const unlockAudio = () => {
      AudioEngine.init();
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });
  }

  /* ==========================================================================
     4. LUMO CHARACTER IMMERSION: EYES, BLUSH, GIGGLE & YAWN
     ========================================================================== */
  function setupLumoCharacter() {
    const lumoChar = document.getElementById('lumoChar');
    const lumoBelly = document.getElementById('lumoBelly');
    const lumoStatus = document.getElementById('lumoStatusText');
    const tickleBtn = document.getElementById('tickleBtn');
    const pupilLeft = document.getElementById('pupilLeft');
    const pupilRight = document.getElementById('pupilRight');
    const mouthSmile = document.getElementById('mouthSmile');
    const mouthOpen = document.getElementById('mouthOpen');
    const mouthTongue = document.getElementById('mouthTongue');
    const closedEyes = document.querySelectorAll('.eye-closed');
    const sockets = document.querySelectorAll('.eye-white');
    const floatingZzz = document.getElementById('floatingZzz');

    // 1. Eye Tracking Pointer
    function trackEyes(clientX, clientY) {
      if (state.isSleeping || state.isYawning) return;

      const eyeSockets = [
        { el: pupilLeft, base: { x: 120, y: 132 } },
        { el: pupilRight, base: { x: 200, y: 132 } }
      ];

      const lumoSvg = document.getElementById('lumoSvg');
      if (!lumoSvg) return;
      const rect = lumoSvg.getBoundingClientRect();
      const svgCenterX = rect.left + rect.width / 2;
      const svgCenterY = rect.top + rect.height / 2;

      const deltaX = clientX - svgCenterX;
      const deltaY = clientY - svgCenterY;
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.hypot(deltaX, deltaY), 300);
      const maxOffset = 5;
      const factor = (distance / 300) * maxOffset;

      const offsetX = Math.cos(angle) * factor;
      const offsetY = Math.sin(angle) * factor;

      pupilLeft.setAttribute('transform', `translate(${120 + offsetX}, ${132 + offsetY})`);
      pupilRight.setAttribute('transform', `translate(${200 + offsetX}, ${132 + offsetY})`);
    }

    window.addEventListener('mousemove', (e) => {
      trackEyes(e.clientX, e.clientY);
      resetIdleTimer();
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        trackEyes(e.touches[0].clientX, e.touches[0].clientY);
      }
      resetIdleTimer();
    }, { passive: true });

    // 2. Random Natural Blinking
    function scheduleBlink() {
      const nextBlink = Math.random() * 4000 + 2500;
      setTimeout(() => {
        if (!state.isSleeping && !state.isYawning) {
          closedEyes.forEach(el => el.style.display = 'block');
          pupilLeft.style.display = 'none';
          pupilRight.style.display = 'none';
          sockets.forEach(s => s.style.display = 'none');

          setTimeout(() => {
            if (!state.isSleeping && !state.isYawning) {
              closedEyes.forEach(el => el.style.display = 'none');
              pupilLeft.style.display = 'block';
              pupilRight.style.display = 'block';
              sockets.forEach(s => s.style.display = 'block');
            }
          }, 160);
        }
        scheduleBlink();
      }, nextBlink);
    }
    scheduleBlink();

    // 3. Tickle & Giggle Interaction
    function triggerGiggle() {
      if (state.isSleeping) {
        wakeLumo();
        return;
      }

      state.isYawning = false;
      AudioEngine.playGiggle();

      // Expressions: open mouth smile, blushing, bouncing
      mouthSmile.style.display = 'none';
      mouthOpen.style.display = 'block';
      mouthTongue.style.display = 'block';
      lumoChar.classList.add('is-blushing');

      // GSAP bounce wiggle
      if (window.gsap) {
        gsap.to('#lumoBody', {
          y: -16,
          rotation: 4,
          duration: 0.15,
          yoyo: true,
          repeat: 3,
          ease: 'power1.inOut',
          onComplete: () => {
            mouthSmile.style.display = 'block';
            mouthOpen.style.display = 'none';
            mouthTongue.style.display = 'none';
            lumoChar.classList.remove('is-blushing');
          }
        });
      }

      // Dialog bubble message
      const giggles = [
        "Teehee! That tickles my stardust!",
        "Giggles! Ready for the next dream delivery!",
        "*Hums a sweet lullaby chord* ✨",
        "Warmed up and glowing! 💛"
      ];
      lumoStatus.textContent = giggles[Math.floor(Math.random() * giggles.length)];
      resetIdleTimer();
    }

    lumoChar.addEventListener('click', triggerGiggle);
    lumoChar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerGiggle();
      }
    });

    if (tickleBtn) {
      tickleBtn.addEventListener('click', triggerGiggle);
    }

    // 4. Idle Timer & Yawn (8 seconds of inactivity)
    function triggerYawn() {
      if (state.isSleeping || state.isYawning) return;
      state.isYawning = true;

      lumoStatus.textContent = "Yaaawn... *rubs eyes with cloud paws* 💤";

      // Mouth opens wide, eyes close gently
      mouthSmile.style.display = 'none';
      mouthOpen.style.display = 'block';
      mouthTongue.style.display = 'block';
      closedEyes.forEach(el => el.style.display = 'block');
      pupilLeft.style.display = 'none';
      pupilRight.style.display = 'none';

      AudioEngine.playChime(329.63); // Gentle sleepy pitch

      // Floating 'z z z'
      spawnZzz();

      setTimeout(() => {
        if (!state.isSleeping) {
          mouthSmile.style.display = 'block';
          mouthOpen.style.display = 'none';
          mouthTongue.style.display = 'none';
          closedEyes.forEach(el => el.style.display = 'none');
          pupilLeft.style.display = 'block';
          pupilRight.style.display = 'block';
          state.isYawning = false;
          lumoStatus.textContent = "Still watching over sleepy dreams! ✨";
        }
      }, 3500);
    }

    function spawnZzz() {
      floatingZzz.innerHTML = '';
      ['z', 'z', 'Z'].forEach((letter, i) => {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', 190 + i * 14);
        text.setAttribute('y', 110 - i * 16);
        text.setAttribute('fill', '#ffe39a');
        text.setAttribute('font-family', 'Fredoka');
        text.setAttribute('font-weight', '700');
        text.setAttribute('font-size', 14 + i * 4);
        text.setAttribute('opacity', '0.9');
        text.textContent = letter;
        floatingZzz.appendChild(text);

        if (window.gsap) {
          gsap.fromTo(text, 
            { y: 0, opacity: 0 },
            { y: -30, opacity: 1, duration: 1.8, delay: i * 0.4, ease: 'power1.out',
              onComplete: () => text.remove()
            }
          );
        }
      });
    }

    function resetIdleTimer() {
      state.lastInteractionTime = Date.now();
      clearTimeout(state.idleTimer);
      clearTimeout(state.idleHintTimer);

      const idleHint = document.getElementById('idleHint');
      if (idleHint) idleHint.classList.remove('visible');

      state.idleTimer = setTimeout(triggerYawn, 8000);
      state.idleHintTimer = setTimeout(() => {
        if (idleHint) idleHint.classList.add('visible');
      }, 30000);
    }

    resetIdleTimer();

    // 5. Belly Glow Slider Gadget
    const glowSlider = document.getElementById('glowSlider');
    const glowVal = document.getElementById('glowVal');
    if (glowSlider && glowVal) {
      glowSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        const normalized = val / 100;
        document.documentElement.style.setProperty('--lumo-glow-intensity', normalized);
        glowVal.textContent = `${val}% Warmth`;
        lumoStatus.textContent = val > 75 ? "Belly is bright as a guiding star! ✨" : "Cozy soft nightlight active 🌙";
      });
    }
  }

  /* ==========================================================================
     5. TIER 2 STANDOUT FEATURE 2: NIGHTLIGHT FLASHLIGHT MASK
     ========================================================================== */
  function setupNightlightCursor() {
    let maskSize = 150;

    function updateCoordinates(x, y, pulse = false) {
      document.documentElement.style.setProperty('--mouse-x', `${x}px`);
      document.documentElement.style.setProperty('--mouse-y', `${y}px`);
      if (pulse) {
        document.documentElement.style.setProperty('--mask-radius', '200px');
        setTimeout(() => {
          document.documentElement.style.setProperty('--mask-radius', '150px');
        }, 400);
      }
    }

    // Default to center if initial
    updateCoordinates(window.innerWidth * 0.5, window.innerHeight * 0.35);

    window.addEventListener('mousemove', (e) => {
      updateCoordinates(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        updateCoordinates(e.touches[0].clientX, e.touches[0].clientY, true);
      }
    }, { passive: true });

    // Interactive constellation and sleeping creature clicks
    document.querySelectorAll('.hidden-item:not(.sleeping-star-egg)').forEach(item => {
      item.addEventListener('click', () => {
        AudioEngine.playChime(880);
        if (window.gsap) {
          gsap.fromTo(item, { scale: 1 }, { scale: 1.25, yoyo: true, repeat: 1, duration: 0.3 });
        }
      });
    });
  }

  /* ==========================================================================
     6. TIER 2 STANDOUT FEATURE 1: DREAM DELIVERY MAP
     SVG Path Motion & Towns Synced to Scroll Progress
     ========================================================================== */
  function setupDeliveryMap() {
    const mapSection = document.getElementById('map');
    const routeActivePath = document.getElementById('routeActivePath');
    const travelerGroup = document.getElementById('travelerGroup');
    const routeProgressVal = document.getElementById('routeProgressVal');
    const nextStopLabel = document.getElementById('nextStopLabel');

    if (!mapSection || !routeActivePath || !travelerGroup) return;

    const pathLength = routeActivePath.getTotalLength();
    routeActivePath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    routeActivePath.style.strokeDashoffset = `${pathLength}`;

    const towns = [
      { id: 'town1', name: 'Slumberton', ratio: 0.0 },
      { id: 'town2', name: 'Starfall Glade', ratio: 0.26 },
      { id: 'town3', name: 'Pillow Peak', ratio: 0.52 },
      { id: 'town4', name: 'Dewdrop Hollow', ratio: 0.76 },
      { id: 'town5', name: 'Sunrise Cove', ratio: 1.0 }
    ];

    function applyMapProgress(progress) {
      const clamped = Math.max(0, Math.min(1, progress));

      // 1. Scrub SVG stroke
      const currentOffset = pathLength * (1 - clamped);
      routeActivePath.style.strokeDashoffset = `${currentOffset}`;

      // 2. Position traveler paper boat along path
      const currentLength = clamped * pathLength;
      const point = routeActivePath.getPointAtLength(currentLength);
      
      // Calculate slight tangent angle for boat orientation
      const nextLength = Math.min(pathLength, currentLength + 3);
      const nextPoint = routeActivePath.getPointAtLength(nextLength);
      const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);

      travelerGroup.setAttribute('transform', `translate(${point.x}, ${point.y}) rotate(${angle * 0.4})`);

      // 3. Update Progress Bar & Next Stop
      const percent = Math.round(clamped * 100);
      routeProgressVal.textContent = `${percent}%`;

      // 4. Towns lighting up & chime triggering
      towns.forEach((town, index) => {
        const townEl = document.getElementById(town.id);
        if (!townEl) return;

        if (clamped >= town.ratio - 0.05) {
          if (!townEl.classList.contains('active')) {
            townEl.classList.add('active');
            AudioEngine.playTownArrival();
          }
        } else if (index > 0) {
          townEl.classList.remove('active');
        }

        if (clamped < town.ratio && (!towns[index - 1] || clamped >= towns[index - 1].ratio)) {
          nextStopLabel.textContent = town.name;
        }
      });

      if (clamped >= 0.98) {
        nextStopLabel.textContent = "Sunrise Cove Reached! ☀️";
      }
    }

    // Scroll listener fallback & synchronization
    function updateMapScroll() {
      const rect = mapSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start calculating when map top reaches 80% viewport, finish when bottom reaches 20% viewport
      const totalScrollDistance = rect.height + windowHeight * 0.6;
      const currentScrolled = (windowHeight * 0.8) - rect.top;
      const progress = currentScrolled / totalScrollDistance;

      applyMapProgress(progress);
    }

    window.addEventListener('scroll', updateMapScroll, { passive: true });
    window.addEventListener('resize', updateMapScroll);
    updateMapScroll();

    // If GSAP ScrollTrigger is available, use it to ensure 60fps scrub
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.create({
        trigger: '#map',
        start: 'top 80%',
        end: 'bottom 30%',
        scrub: true,
        onUpdate: (self) => applyMapProgress(self.progress)
      });
    }
  }

  /* ==========================================================================
     7. DREAM WORKSHOP: 3 PROJECTS & ACCESSIBLE MODAL
     ========================================================================== */
  function setupDreamWorkshop() {
    const dreamModal = document.getElementById('dreamModal');
    const modalHeading = document.getElementById('modalHeading');
    const modalLine1 = document.getElementById('modalLine1');
    const modalLine2 = document.getElementById('modalLine2');
    const modalSvgStage = document.getElementById('modalSvgStage');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const packDreamBtn = document.getElementById('packDreamBtn');

    const dreamProjects = {
      pancake: {
        title: "The Flying Pancake Dream",
        line1: "Fluffy, golden flapjacks drifting across starlit skies with whipped stardust butter.",
        line2: "Sweet maple rain drizzles softly over sleepy rooftops while hungry dreamers smile.",
        svg: `<svg viewBox="0 0 200 150" style="width:100%;max-width:200px;">
                <ellipse cx="100" cy="110" rx="60" ry="20" fill="#d99543"/>
                <ellipse cx="100" cy="95" rx="55" ry="18" fill="#e8a855"/>
                <ellipse cx="100" cy="80" rx="50" ry="16" fill="#f7c06d"/>
                <rect x="90" y="65" width="20" height="12" rx="3" fill="#ffe39a"/>
                <path d="M 98 77 Q 95 90 92 105" stroke="#ffe39a" stroke-width="3" fill="none"/>
                <circle cx="50" cy="40" r="3" fill="#ffd36b"/>
                <circle cx="150" cy="35" r="4" fill="#ffd36b"/>
                <text x="100" y="142" text-anchor="middle" fill="#ffe39a" font-family="VT323" font-size="16">100% FLUFFY DREAMS</text>
              </svg>`
      },
      library: {
        title: "The Underwater Library Dream",
        line1: "Luminescent jellyfish floating between spiraling coral shelves in quiet ocean depths.",
        line2: "Waterproof bedtime books softly read themselves aloud in gentle underwater bubbles.",
        svg: `<svg viewBox="0 0 200 150" style="width:100%;max-width:200px;">
                <path d="M 70 60 C 70 30, 130 30, 130 60 Z" fill="#bfeedd" opacity="0.85"/>
                <path d="M 80 60 Q 75 90 85 115 M 100 60 Q 105 95 100 120 M 120 60 Q 125 90 115 115" stroke="#bfeedd" stroke-width="2" fill="none"/>
                <!-- Open book floating -->
                <polygon points="80,95 100,105 120,95 100,85" fill="#fff7ee"/>
                <circle cx="45" cy="50" r="6" fill="none" stroke="#bfeedd" stroke-width="1.5"/>
                <circle cx="160" cy="70" r="8" fill="none" stroke="#bfeedd" stroke-width="1.5"/>
                <text x="100" y="142" text-anchor="middle" fill="#bfeedd" font-family="VT323" font-size="16">CORAL ARCHIVES</text>
              </svg>`
      },
      piano: {
        title: "The Marshmallow Piano Dream",
        line1: "Squishy pastel musical keys that chime sweet lullabies with every soft bounce.",
        line2: "No wrong notes exist here—every hop plays harmony, drifting you into gentle slumber.",
        svg: `<svg viewBox="0 0 200 150" style="width:100%;max-width:200px;">
                <rect x="30" y="60" width="24" height="60" rx="6" fill="#ffc2d4"/>
                <rect x="58" y="60" width="24" height="60" rx="6" fill="#fff7ee"/>
                <rect x="86" y="60" width="24" height="60" rx="6" fill="#ffe39a"/>
                <rect x="114" y="60" width="24" height="60" rx="6" fill="#bfeedd"/>
                <rect x="142" y="60" width="24" height="60" rx="6" fill="#ffc2d4"/>
                <text x="60" y="45" fill="#ffd36b" font-size="20">♪</text>
                <text x="120" y="40" fill="#ffc2d4" font-size="22">♫</text>
                <text x="100" y="142" text-anchor="middle" fill="#ffc2d4" font-family="VT323" font-size="16">SQUISHY ACCORD</text>
              </svg>`
      }
    };

    document.querySelectorAll('.parcel-card').forEach(card => {
      const openParcel = () => {
        const projKey = card.getAttribute('data-project');
        const proj = dreamProjects[projKey];
        if (!proj) return;

        AudioEngine.playClick();
        modalHeading.textContent = proj.title;
        modalLine1.textContent = proj.line1;
        modalLine2.textContent = proj.line2;
        modalSvgStage.innerHTML = proj.svg;

        dreamModal.showModal();
        AudioEngine.playChime(659.25);
      };

      card.addEventListener('click', openParcel);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openParcel();
        }
      });
    });

    closeModalBtn.addEventListener('click', () => {
      AudioEngine.playClick();
      dreamModal.close();
    });

    packDreamBtn.addEventListener('click', () => {
      AudioEngine.playChime(1046.5);
      incrementOdometer();
      packDreamBtn.textContent = 'Shipped via Paper Boat! ⛵✨';
      setTimeout(() => {
        packDreamBtn.textContent = 'Ship in Paper Boat ⛵';
        dreamModal.close();
      }, 1200);
    });

    // Close on backdrop click
    dreamModal.addEventListener('click', (e) => {
      const rect = dreamModal.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        dreamModal.close();
      }
    });
  }

  /* ==========================================================================
     8. EASTER EGGS: SLEEPING STAR & TRIPLE-TAP SECRET
     ========================================================================== */
  function setupEasterEggs() {
    const sleepingStarBtn = document.getElementById('sleepingStarBtn');
    const logoBtn = document.getElementById('logoBtn');
    const secretModal = document.getElementById('secretModal');
    const closeSecretBtn = document.getElementById('closeSecretBtn');

    // 1. Sleeping Star (Footer/Sky Easter Egg)
    if (sleepingStarBtn) {
      sleepingStarBtn.addEventListener('click', () => {
        state.sleepingStarClicks++;
        AudioEngine.playChime(523.25 + state.sleepingStarClicks * 100);

        if (state.sleepingStarClicks >= 3) {
          triggerSleepMode();
          state.sleepingStarClicks = 0;
        } else {
          // Subtle wink
          if (window.gsap) {
            gsap.fromTo(sleepingStarBtn, { scale: 1 }, { scale: 1.35, yoyo: true, repeat: 1, duration: 0.25 });
          }
        }
      });
    }

    function triggerSleepMode() {
      state.isSleeping = true;
      document.body.classList.add('lullaby-sleeping-mode');

      const mouthSmile = document.getElementById('mouthSmile');
      const mouthOpen = document.getElementById('mouthOpen');
      const closedEyes = document.querySelectorAll('.eye-closed');
      const pupilLeft = document.getElementById('pupilLeft');
      const pupilRight = document.getElementById('pupilRight');
      const lumoStatus = document.getElementById('lumoStatusText');

      mouthSmile.style.display = 'block';
      mouthOpen.style.display = 'none';
      closedEyes.forEach(el => el.style.display = 'block');
      pupilLeft.style.display = 'none';
      pupilRight.style.display = 'none';

      lumoStatus.textContent = "Shh... Lumo is fast asleep dreaming of you! 🌙💤";

      // Play soft music box lullaby
      AudioEngine.playLullaby();

      // Tap anywhere to wake Lumo
      const wakeHandler = () => {
        wakeLumo();
        window.removeEventListener('click', wakeHandler);
      };
      setTimeout(() => window.addEventListener('click', wakeHandler), 1000);
    }

    function wakeLumo() {
      state.isSleeping = false;
      document.body.classList.remove('lullaby-sleeping-mode');

      const closedEyes = document.querySelectorAll('.eye-closed');
      const pupilLeft = document.getElementById('pupilLeft');
      const pupilRight = document.getElementById('pupilRight');
      const lumoStatus = document.getElementById('lumoStatusText');

      closedEyes.forEach(el => el.style.display = 'none');
      pupilLeft.style.display = 'block';
      pupilRight.style.display = 'block';

      lumoStatus.textContent = "I'm awake and ready to deliver dreams! ⛵✨";
      AudioEngine.playGiggle();
    }

    // 2. Logo Triple-Tap Secret / Konami Code
    if (logoBtn) {
      logoBtn.addEventListener('click', () => {
        state.logoClickCount++;
        clearTimeout(state.logoClickTimer);

        if (state.logoClickCount >= 3) {
          unlockSecret();
          state.logoClickCount = 0;
        } else {
          AudioEngine.playClick();
          state.logoClickTimer = setTimeout(() => {
            state.logoClickCount = 0;
          }, 1500);
        }
      });
    }

    // Konami Code Listener
    window.addEventListener('keydown', (e) => {
      if (e.key === KONAMI_CODE[state.konamiIndex]) {
        state.konamiIndex++;
        if (state.konamiIndex === KONAMI_CODE.length) {
          unlockSecret();
          state.konamiIndex = 0;
        }
      } else {
        state.konamiIndex = 0;
      }
    });

    function unlockSecret() {
      AudioEngine.playChime(1174.66);
      spawnStarConfetti();
      secretModal.showModal();
    }

    closeSecretBtn.addEventListener('click', () => {
      secretModal.close();
    });

    function spawnStarConfetti() {
      const colors = ['#ffd36b', '#ffc2d4', '#bfeedd', '#fff7ee'];
      for (let i = 0; i < 40; i++) {
        const star = document.createElement('div');
        star.className = 'cursor-sparkle';
        star.textContent = ['★', '✦', '✧', '💛'][Math.floor(Math.random() * 4)];
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 60 + 10}vh`;
        star.style.fontSize = `${Math.random() * 16 + 14}px`;
        star.style.color = colors[Math.floor(Math.random() * colors.length)];
        star.style.setProperty('--sparkle-dx', `${(Math.random() - 0.5) * 80}px`);
        star.style.setProperty('--sparkle-dy', `${Math.random() * 100 + 40}px`);
        document.body.appendChild(star);

        setTimeout(() => star.remove(), 1200);
      }
    }
  }

  /* ==========================================================================
     9. SIDE QUESTS (+13 BONUS):
     - Hit Counter Odometer (+1)
     - Live Guestbook (+2)
     - Responsive Chaos Mode (+5)
     - Sparkle Cursor Trail (+2)
     - Sound FX & Mute (+3 - in AudioEngine)
     ========================================================================== */

  // 1. Odometer Rolling Hit Counter (+1)
  function setupOdometer() {
    const savedCount = localStorage.getItem('lumo_dreams_count');
    state.deliveredDreamsCount = savedCount ? parseInt(savedCount, 10) + 1 : 1204;
    localStorage.setItem('lumo_dreams_count', state.deliveredDreamsCount);

    renderOdometer(state.deliveredDreamsCount, false);
  }

  function incrementOdometer() {
    state.deliveredDreamsCount++;
    localStorage.setItem('lumo_dreams_count', state.deliveredDreamsCount);
    renderOdometer(state.deliveredDreamsCount, true);
  }

  function renderOdometer(num, animate = true) {
    const formatted = num.toString().padStart(6, '0');
    const digits = document.querySelectorAll('.digit-box');
    if (digits.length >= 6) {
      for (let i = 0; i < 6; i++) {
        const box = digits[i];
        if (box.textContent !== formatted[i]) {
          if (animate) {
            box.classList.add('rolling');
            setTimeout(() => {
              box.textContent = formatted[i];
              box.classList.remove('rolling');
            }, 180);
          } else {
            box.textContent = formatted[i];
          }
        }
      }
    }
  }

  // 2. Live Guestbook with Pre-seeded Wishes, Rate Limit & Profanity Safety (+2)
  function setupGuestbook() {
    const form = document.getElementById('guestbookForm');
    const signerName = document.getElementById('signerName');
    const signerWish = document.getElementById('signerWish');
    const charCount = document.getElementById('charCount');
    const stickyBoard = document.getElementById('stickyBoard');
    let lastSubmitTime = 0;

    const defaultEntries = [
      { name: "Star-Gazer Maya", wish: "May everyone sleeping under cloudy skies find a sweet moonlit dream tonight!" },
      { name: "Grandma Nora", wish: "A paper boat with lullaby melodies for my newborn granddaughter Lily." },
      { name: "Sleepy Leo (age 6)", wish: "I want a dream where pancakes fall from the clouds and don't make a mess!" },
      { name: "Astrid the Pilot", wish: "Smooth air and clear starfields for Lumo's courier route." },
      { name: "Clover the Kitten", wish: "Purrs and warm milk foam for baby Lumo's night journey. 🐾" }
    ];

    let entries = defaultEntries;
    const stored = localStorage.getItem('lumo_guestbook_entries');
    if (stored) {
      try {
        entries = JSON.parse(stored);
      } catch (e) {
        entries = defaultEntries;
      }
    }

    function escapeHtml(str) {
      return str.replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[m]));
    }

    // Gentle profanity filter for cozy baby theme
    function sanitizeProfanity(text) {
      const forbidden = ['hate', 'ugly', 'stupid', 'bad', 'kill', 'die', 'jerk'];
      let clean = text;
      forbidden.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        clean = clean.replace(regex, '💛✨');
      });
      return clean;
    }

    function renderEntries() {
      stickyBoard.innerHTML = '';
      const colors = ['#fff3b0', '#cbf3dd', '#ffd1dc', '#d4e6f1'];
      entries.slice(0, 8).forEach((entry, idx) => {
        const note = document.createElement('article');
        note.className = 'pinned-wish';
        const rot = ((idx % 5) - 2) * 1.5;
        note.style.transform = `rotate(${rot}deg)`;
        note.style.backgroundColor = colors[idx % colors.length];

        note.innerHTML = `
          <span class="wish-pin" aria-hidden="true">📌</span>
          <p class="wish-text">“${escapeHtml(entry.wish)}”</p>
          <div class="wish-author">— ${escapeHtml(entry.name)}</div>
        `;
        stickyBoard.appendChild(note);
      });
    }

    renderEntries();

    signerWish.addEventListener('input', () => {
      const left = 140 - signerWish.value.length;
      charCount.textContent = `${left} chars left`;
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastSubmitTime < 4000) {
        alert("Patience, sleepy friend! Please wait a moment before sending another dream wish. ✨");
        return;
      }

      let name = signerName.value.trim();
      let wish = signerWish.value.trim();

      if (!name || !wish) return;

      name = sanitizeProfanity(name.slice(0, 30));
      wish = sanitizeProfanity(wish.slice(0, 140));

      entries.unshift({ name, wish });
      localStorage.setItem('lumo_guestbook_entries', JSON.stringify(entries));
      renderEntries();
      lastSubmitTime = now;

      signerWish.value = '';
      signerName.value = '';
      charCount.textContent = '140 chars left';
      AudioEngine.playChime(987.77);
      incrementOdometer();
    });
  }

  // 3. Responsive Chaos Mode Live Badge & Dynamic Observer (+5)
  function setupResponsiveChaosMode() {
    const screenDimensions = document.getElementById('screenDimensions');

    function updateDimensions() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (screenDimensions) {
        screenDimensions.textContent = `${w}×${h}`;
      }
    }

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    // Webring interactive buttons
    const webringPrev = document.getElementById('webringPrev');
    const webringRandom = document.getElementById('webringRandom');
    const webringNext = document.getElementById('webringNext');

    [webringPrev, webringRandom, webringNext].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          AudioEngine.playClick();
          const orig = btn.textContent;
          btn.textContent = '✦ Teleporting...';
          setTimeout(() => {
            btn.textContent = orig;
            AudioEngine.playChime(784);
          }, 800);
        });
      }
    });
  }

  // 4. Sparkle Cursor Trail with rAF Pooling (+2)
  function setupSparkleTrail() {
    let mousePos = { x: -100, y: -100 };
    let hasMoved = false;
    let frameId = null;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const sparklePool = [];
    const MAX_SPARKLES = 20;

    function spawnSparkleAt(x, y) {
      if (sparklePool.length >= MAX_SPARKLES) {
        const oldest = sparklePool.shift();
        if (oldest && oldest.parentNode) oldest.remove();
      }

      const sparkle = document.createElement('span');
      sparkle.className = 'cursor-sparkle';
      sparkle.textContent = ['✧', '✦', '★', '•'][Math.floor(Math.random() * 4)];
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.fontSize = `${Math.random() * 10 + 10}px`;
      sparkle.style.color = ['#ffd36b', '#ffe39a', '#ffc2d4', '#bfeedd'][Math.floor(Math.random() * 4)];
      sparkle.style.setProperty('--sparkle-dx', `${(Math.random() - 0.5) * 35}px`);
      sparkle.style.setProperty('--sparkle-dy', `${(Math.random() - 0.5) * 35}px`);

      document.body.appendChild(sparkle);
      sparklePool.push(sparkle);

      setTimeout(() => {
        const idx = sparklePool.indexOf(sparkle);
        if (idx !== -1) sparklePool.splice(idx, 1);
        sparkle.remove();
      }, 700);
    }

    let lastTime = 0;
    function renderLoop(time) {
      if (hasMoved && time - lastTime > 45) { // ~22fps sparkle emission
        spawnSparkleAt(mousePos.x, mousePos.y);
        lastTime = time;
        hasMoved = false;
      }
      frameId = requestAnimationFrame(renderLoop);
    }

    if (!isTouch) {
      window.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
        hasMoved = true;
      });
      frameId = requestAnimationFrame(renderLoop);
    } else {
      // Tap sparkles for mobile devices
      window.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          spawnSparkleAt(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });
    }
  }

  /* ==========================================================================
     10. INITIALIZATION
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    setupAudioControls();
    setupLumoCharacter();
    setupNightlightCursor();
    setupDeliveryMap();
    setupDreamWorkshop();
    setupEasterEggs();
    setupOdometer();
    setupGuestbook();
    setupResponsiveChaosMode();
    setupSparkleTrail();
  });

})();
