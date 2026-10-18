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
    lullabyOscillators: [],
    dawnFinaleTriggered: false
  };

  function spawnStarConfetti() {
    const colors = ['#ffd36b', '#ffc2d4', '#bfeedd', '#fff7ee', '#ffaa88'];
    for (let i = 0; i < 45; i++) {
      const star = document.createElement('div');
      star.className = 'cursor-sparkle';
      star.textContent = ['★', '✦', '✧', '💛', '✨'][Math.floor(Math.random() * 5)];
      star.style.left = `${Math.random() * 100}vw`;
      star.style.top = `${Math.random() * 60 + 10}vh`;
      star.style.fontSize = `${Math.random() * 18 + 14}px`;
      star.style.color = colors[Math.floor(Math.random() * colors.length)];
      star.style.setProperty('--sparkle-dx', `${(Math.random() - 0.5) * 90}px`);
      star.style.setProperty('--sparkle-dy', `${Math.random() * 110 + 40}px`);
      document.body.appendChild(star);

      setTimeout(() => star.remove(), 1200);
    }
  }

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

    playPianoNote(freq = 523.25) {
      if (state.audioMuted || !state.audioContext) return;
      this.init();
      const ctx = state.audioContext;
      const now = ctx.currentTime;

      // Squishy marshmallow marimba chime: warm sine fundamental + gentle triangle harmonic
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);
      osc1.frequency.exponentialRampToValueAtTime(freq * 0.985, now + 0.35);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.24, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.7);
      osc2.stop(now + 0.7);
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

    // Always start muted by default until visitor explicitly clicks (browser gesture requirement)
    state.audioMuted = true;

    function updateMuteButtonUI() {
      if (state.audioMuted) {
        soundIcon.textContent = '🔇';
        soundText.textContent = 'Sound: OFF';
        muteToggle.setAttribute('aria-pressed', 'false');
        muteToggle.setAttribute('aria-label', 'Sound is muted. Tap to turn on cozy chimes and lullabies');
        muteToggle.classList.remove('sound-active');
      } else {
        soundIcon.textContent = '🔔';
        soundText.textContent = 'Sound: ON';
        muteToggle.setAttribute('aria-pressed', 'true');
        muteToggle.setAttribute('aria-label', 'Sound is enabled. Tap to mute');
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
      if (idleHint && !state.idleHintDismissed) idleHint.classList.remove('visible');

      state.idleTimer = setTimeout(triggerYawn, 8000);
      state.idleHintTimer = setTimeout(() => {
        if (idleHint && !state.idleHintDismissed) {
          idleHint.classList.add('visible');
          // Auto-hide after 6s as requested
          setTimeout(() => {
            if (idleHint) idleHint.classList.remove('visible');
          }, 6000);
        }
      }, 30000);
    }

    const closeIdleHint = document.getElementById('closeIdleHint');
    if (closeIdleHint) {
      closeIdleHint.addEventListener('click', (e) => {
        e.stopPropagation();
        state.idleHintDismissed = true;
        const idleHint = document.getElementById('idleHint');
        if (idleHint) idleHint.classList.remove('visible');
      });
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

    // Flashlight starts in darkness until user moves mouse or touches screen

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

      if (clamped >= 0.96) {
        nextStopLabel.textContent = "Sunrise Cove Reached! ☀️";
        if (!state.dawnFinaleTriggered) {
          triggerDawnFinale();
        }
      }
    }

    function triggerDawnFinale() {
      state.dawnFinaleTriggered = true;
      document.body.classList.add('dawn-sunrise-mode');
      
      const dawnCard = document.getElementById('dawnFinaleCard');
      const dawnMsg = document.getElementById('dawnMessageText');
      if (dawnCard) {
        dawnCard.classList.add('active');
      }

      // Roll odometer by +1
      incrementOdometer();
      if (dawnMsg) {
        dawnMsg.textContent = `Dream #${state.deliveredDreamsCount.toLocaleString()} delivered safely before first morning light. Lumo curls up into cloud pillows. Sleep tight.`;
      }

      // Wind-chime sounds
      AudioEngine.playTownArrival();
      setTimeout(() => AudioEngine.playChime(1174.66), 400);

      // Star confetti burst
      spawnStarConfetti();

      // Replay button listener
      const replayBtn = document.getElementById('replayDeliveryBtn');
      if (replayBtn) {
        replayBtn.onclick = () => {
          AudioEngine.playClick();
          state.dawnFinaleTriggered = false;
          if (dawnCard) dawnCard.classList.remove('active');
          document.body.classList.remove('dawn-sunrise-mode');
          mapSection.scrollIntoView({ behavior: 'smooth' });
          applyMapProgress(0);
          const toast = document.getElementById('webringToast');
          if (typeof showWebringToast === 'function') {
            showWebringToast("New paper boat launched! ⛵✨");
          }
        };
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
     7. DREAM WORKSHOP: 4 PROJECTS, ANIMATED SCENES & MARSHMALLOW PIANO (Step 4)
     ========================================================================== */
  function setupDreamWorkshop() {
    const dreamModal = document.getElementById('dreamModal');
    const modalHeading = document.getElementById('modalHeading');
    const modalLine1 = document.getElementById('modalLine1');
    const modalLine2 = document.getElementById('modalLine2');
    const modalSvgStage = document.getElementById('modalSvgStage');
    const modalInteractiveArea = document.getElementById('modalInteractiveArea');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalPackBtn = document.getElementById('modalPackBtn');

    let currentOpenProject = null;
    let lastActiveTrigger = null;

    // 8 Squishy Marshmallow Piano Keys (Pentatonic Scale across Octaves)
    const pianoNotes = [
      { key: 'a', note: 'C', freq: 523.25, bg: '#ffc2d4', label: 'Do' },
      { key: 's', note: 'D', freq: 587.33, bg: '#fed0bb', label: 'Re' },
      { key: 'd', note: 'E', freq: 659.25, bg: '#ffd36b', label: 'Mi' },
      { key: 'f', note: 'G', freq: 783.99, bg: '#bfeedd', label: 'Sol' },
      { key: 'g', note: 'A', freq: 880.00, bg: '#d9c8ff', label: 'La' },
      { key: 'h', note: 'C', freq: 1046.50, bg: '#ffc2d4', label: 'Do²' },
      { key: 'j', note: 'D', freq: 1174.66, bg: '#ffe39a', label: 'Re²' },
      { key: 'k', note: 'E', freq: 1318.51, bg: '#bfeedd', label: 'Mi²' }
    ];

    const dreamProjects = {
      pancake: {
        title: "The Flying Pancake Dream",
        line1: "Fluffy golden flapjacks drifting across starlit skies with warm syrup clouds.",
        line2: "Sweet maple rain drizzles softly over sleepy rooftops while hungry dreamers smile.",
        svg: `<svg viewBox="0 0 240 160" class="looping-parcel-svg pancake-scene">
                <defs>
                  <linearGradient id="syrupGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#ffd36b"/>
                    <stop offset="100%" stop-color="#d9822b"/>
                  </linearGradient>
                </defs>
                <ellipse cx="120" cy="132" rx="90" ry="20" fill="#ffd36b" opacity="0.2" class="pancake-shadow"/>
                <g class="pancake-stack-group">
                  <ellipse cx="120" cy="115" rx="72" ry="22" fill="#c77826" stroke="#87470f" stroke-width="1.5"/>
                  <ellipse cx="120" cy="110" rx="72" ry="20" fill="#e09438"/>
                  <ellipse cx="120" cy="98" rx="68" ry="20" fill="#c77826" stroke="#87470f" stroke-width="1.5"/>
                  <ellipse cx="120" cy="93" rx="68" ry="19" fill="#f0ab4d"/>
                  <ellipse cx="120" cy="80" rx="64" ry="19" fill="#d48328" stroke="#87470f" stroke-width="1.5"/>
                  <ellipse cx="120" cy="76" rx="64" ry="18" fill="#f7bf63"/>
                  <polygon points="108,60 128,54 136,66 116,72" fill="#ffe39a" stroke="#ffd36b" stroke-width="1.5"/>
                  <path d="M 120 70 Q 124 88 122 102 Q 118 112 124 118" stroke="url(#syrupGrad)" stroke-width="5" stroke-linecap="round" fill="none"/>
                  <circle cx="124" cy="126" r="3.5" fill="#d9822b" class="syrup-drop-fall"/>
                </g>
                <path d="M 95 50 Q 88 35 98 22" stroke="#fff7ee" stroke-width="2" stroke-linecap="round" fill="none" class="steam-wisp-1"/>
                <path d="M 140 48 Q 148 32 138 18" stroke="#fff7ee" stroke-width="2" stroke-linecap="round" fill="none" class="steam-wisp-2"/>
                <text x="120" y="152" text-anchor="middle" fill="#ffe39a" font-family="VT323" font-size="16">DRIFTING IN FLUFFY SYRUP SKIES</text>
              </svg>`,
        interactive: false
      },
      library: {
        title: "The Underwater Library Dream",
        line1: "Luminescent jellyfish floating between coral shelves holding bedtime storybooks.",
        line2: "Waterproof bedtime books softly read themselves aloud in gentle underwater bubbles.",
        svg: `<svg viewBox="0 0 240 160" class="looping-parcel-svg jellyfish-scene">
                <ellipse cx="120" cy="138" rx="85" ry="18" fill="#bfeedd" opacity="0.15"/>
                <circle cx="50" cy="120" r="4" fill="none" stroke="#bfeedd" stroke-width="1.5" class="bubble-float b1"/>
                <circle cx="70" cy="90" r="6" fill="none" stroke="#bfeedd" stroke-width="1.5" class="bubble-float b2"/>
                <circle cx="180" cy="110" r="5" fill="none" stroke="#bfeedd" stroke-width="1.5" class="bubble-float b3"/>
                <circle cx="195" cy="70" r="3.5" fill="none" stroke="#bfeedd" stroke-width="1.5" class="bubble-float b4"/>
                <g class="floating-book-group">
                  <polygon points="75,115 105,125 135,115 105,105" fill="#1b1c3e" stroke="#bfeedd" stroke-width="1.5"/>
                  <path d="M 75 115 Q 105 122 135 115" stroke="#ffe39a" stroke-width="2" fill="none"/>
                  <text x="105" y="118" text-anchor="middle" font-size="8" fill="#ffe39a">📖</text>
                </g>
                <g class="jellyfish-body-group">
                  <path d="M 85 62 C 85 24, 155 24, 155 62 C 145 66, 130 64, 120 66 C 110 64, 95 66, 85 62 Z" fill="#bfeedd" opacity="0.85" stroke="#fff7ee" stroke-width="1.5"/>
                  <ellipse cx="120" cy="46" rx="16" ry="10" fill="#ffffff" opacity="0.4"/>
                  <circle cx="112" cy="48" r="2" fill="#2a1e3b"/>
                  <circle cx="128" cy="48" r="2" fill="#2a1e3b"/>
                  <ellipse cx="106" cy="52" rx="3" ry="1.5" fill="#ffc2d4"/>
                  <ellipse cx="134" cy="52" rx="3" ry="1.5" fill="#ffc2d4"/>
                  <path d="M 117 54 Q 120 57 123 54" stroke="#2a1e3b" stroke-width="1.5" fill="none"/>
                  <path d="M 95 64 Q 90 85 98 108" stroke="#bfeedd" stroke-width="2" stroke-linecap="round" fill="none" class="tentacle t1"/>
                  <path d="M 108 66 Q 115 88 108 112" stroke="#ffe39a" stroke-width="2" stroke-linecap="round" fill="none" class="tentacle t2"/>
                  <path d="M 120 66 Q 126 90 120 115" stroke="#bfeedd" stroke-width="2.5" stroke-linecap="round" fill="none" class="tentacle t3"/>
                  <path d="M 132 66 Q 125 88 132 112" stroke="#ffc2d4" stroke-width="2" stroke-linecap="round" fill="none" class="tentacle t4"/>
                  <path d="M 145 64 Q 150 85 142 108" stroke="#bfeedd" stroke-width="2" stroke-linecap="round" fill="none" class="tentacle t5"/>
                </g>
                <text x="120" y="152" text-anchor="middle" fill="#bfeedd" font-family="VT323" font-size="16">CORAL ARCHIVES & LULLABY TALES</text>
              </svg>`,
        interactive: false
      },
      piano: {
        title: "The Marshmallow Piano Dream",
        line1: "8 squishy pastel keys that bounce softly and chime pure pentatonic lullabies.",
        line2: "No wrong notes exist—every gentle hop plays harmony. Drift into sweet slumber.",
        svg: `<svg viewBox="0 0 200 120" style="width:100%;max-width:200px;">
                <ellipse cx="100" cy="100" rx="80" ry="16" fill="#ffd36b" opacity="0.25"/>
                <!-- Cute jumping marshmallow with musical notes -->
                <ellipse cx="100" cy="55" rx="36" ry="26" fill="#fff7ee" stroke="#ffd36b" stroke-width="2"/>
                <circle cx="92" cy="52" r="3" fill="#2a1e3b"/>
                <circle cx="108" cy="52" r="3" fill="#2a1e3b"/>
                <ellipse cx="85" cy="57" rx="5" ry="3" fill="#ffc2d4"/>
                <ellipse cx="115" cy="57" rx="5" ry="3" fill="#ffc2d4"/>
                <path d="M 96 60 Q 100 64 104 60" stroke="#2a1e3b" stroke-width="2" fill="none"/>
                <!-- Music notes -->
                <text x="50" y="38" fill="#ffd36b" font-size="22">♪</text>
                <text x="145" y="35" fill="#ffc2d4" font-size="24">♫</text>
                <text x="100" y="112" text-anchor="middle" fill="#ffc2d4" font-family="VT323" font-size="16">SQUISHY PENTATONIC HARMONY</text>
              </svg>`,
        interactive: true
      },
      trampoline: {
        title: "The Cloud Trampoline Dream",
        line1: "Springy puff clouds that bounce you high enough to catch falling stars.",
        line2: "No gravity, only gentle giggles as you land softly on a feather mattress in the sky.",
        svg: `<svg viewBox="0 0 200 140" style="width:100%;max-width:200px;">
                <ellipse cx="100" cy="110" rx="65" ry="22" fill="#fff7ee" stroke="#ffd36b" stroke-width="2"/>
                <ellipse cx="100" cy="108" rx="45" ry="14" fill="#ffc2d4" opacity="0.6"/>
                <polygon points="100,45 106,60 122,60 109,70 114,85 100,75 86,85 91,70 78,60 94,60" fill="#ffd36b"/>
                <circle cx="96" cy="62" r="1.5" fill="#3b1f4a"/>
                <circle cx="104" cy="62" r="1.5" fill="#3b1f4a"/>
                <path d="M 85 95 Q 100 105 115 95" stroke="#ffe39a" stroke-width="2.5" fill="none"/>
                <text x="100" y="132" text-anchor="middle" fill="#ffe39a" font-family="VT323" font-size="16">MOON BOUNCE</text>
              </svg>`,
        interactive: false
      }
    };

    function triggerPianoKey(keyChar) {
      const target = document.querySelector(`.marshmallow-key[data-key="${keyChar.toLowerCase()}"]`);
      if (!target) return;
      const freq = parseFloat(target.getAttribute('data-freq')) || 523.25;
      AudioEngine.playPianoNote(freq);
      target.classList.add('squished');
      setTimeout(() => target.classList.remove('squished'), 140);
    }

    function buildPianoHtml() {
      let keysHtml = pianoNotes.map(n => `
        <button type="button" class="marshmallow-key" data-key="${n.key}" data-freq="${n.freq}" style="--key-bg:${n.bg}" aria-label="Key ${n.key.toUpperCase()}, ${n.note}">
          <span class="key-letter">${n.key.toUpperCase()}</span>
          <span class="key-note">${n.note}</span>
        </button>
      `).join('');

      return `
        <div class="marshmallow-piano-wrapper" role="region" aria-label="Playable Marshmallow Piano">
          <div class="piano-hint-pill">🎹 Tap keys or press [A S D F G H J K] to play lullabies:</div>
          <div class="piano-keyboard" role="group" aria-label="8 Marshmallow Keys">
            ${keysHtml}
          </div>
        </div>
      `;
    }

    function bindPianoKeys() {
      if (!modalInteractiveArea) return;
      const keys = modalInteractiveArea.querySelectorAll('.marshmallow-key');
      keys.forEach(keyEl => {
        const play = () => {
          const freq = parseFloat(keyEl.getAttribute('data-freq')) || 523.25;
          AudioEngine.playPianoNote(freq);
          keyEl.classList.add('squished');
          setTimeout(() => keyEl.classList.remove('squished'), 140);
        };
        keyEl.addEventListener('click', play);
        keyEl.addEventListener('touchstart', (e) => {
          e.preventDefault();
          play();
        }, { passive: false });
      });
    }

    // Keyboard listener for piano (active only when piano modal is open)
    window.addEventListener('keydown', (e) => {
      if (!dreamModal.open) return;

      // Escape to close
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
        return;
      }

      // Focus trap within modal
      if (e.key === 'Tab') {
        const focusables = dreamModal.querySelectorAll('button:not([disabled]), [tabindex="0"], input, [href]');
        if (focusables.length > 0) {
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            last.focus();
            e.preventDefault();
          } else if (!e.shiftKey && document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }

      // Playable keys
      if (currentOpenProject === 'piano') {
        const validKeys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k'];
        const pressed = e.key.toLowerCase();
        if (validKeys.includes(pressed)) {
          e.preventDefault();
          triggerPianoKey(pressed);
        }
      }
    });

    function openModalForProject(projKey, triggerEl) {
      const proj = dreamProjects[projKey];
      if (!proj) return;

      lastActiveTrigger = triggerEl;
      currentOpenProject = projKey;

      AudioEngine.playClick();
      modalHeading.textContent = proj.title;
      modalLine1.textContent = proj.line1;
      modalLine2.textContent = proj.line2;
      modalSvgStage.innerHTML = proj.svg;

      if (proj.interactive && projKey === 'piano') {
        modalInteractiveArea.innerHTML = buildPianoHtml();
        bindPianoKeys();
      } else {
        modalInteractiveArea.innerHTML = '';
      }

      dreamModal.showModal();
      AudioEngine.playChime(659.25);

      // Focus close button initially for accessibility
      setTimeout(() => {
        if (closeModalBtn) closeModalBtn.focus();
      }, 50);
    }

    function closeModal() {
      AudioEngine.playClick();
      dreamModal.close();
      currentOpenProject = null;
      if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
        lastActiveTrigger.focus();
      }
    }

    document.querySelectorAll('.parcel-card').forEach(card => {
      const projKey = card.getAttribute('data-project');
      const open = (e) => {
        if (e) e.stopPropagation();
        openModalForProject(projKey, card);
      };

      card.addEventListener('click', open);
      const btn = card.querySelector('.open-parcel-btn');
      if (btn) btn.addEventListener('click', open);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      });
    });

    closeModalBtn.addEventListener('click', closeModal);
    dreamModal.addEventListener('cancel', () => {
      currentOpenProject = null;
      if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
        lastActiveTrigger.focus();
      }
    });

    if (modalPackBtn) {
      modalPackBtn.addEventListener('click', () => {
        AudioEngine.playChime(1046.5);
        incrementOdometer();
        modalPackBtn.textContent = 'Shipped via Paper Boat! ⛵✨';
        setTimeout(() => {
          modalPackBtn.textContent = 'Ship in Paper Boat ⛵';
          closeModal();
        }, 900);
      });
    }

    // Close on backdrop click
    dreamModal.addEventListener('click', (e) => {
      const rect = dreamModal.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        closeModal();
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

    // Keep marquee delivery counter strictly synchronized from this single source of truth
    const marqueeSpan = document.getElementById('marqueeDreamCount');
    if (marqueeSpan) {
      marqueeSpan.textContent = `💤 ${num.toLocaleString()}+ dreams safely tucked in tonight`;
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

  // 2b. Deliver a Dream to Me (Step 3: Unique Personalized Dream Generator)
  function setupCustomDreamDelivery() {
    const form = document.getElementById('customDreamForm');
    const nameInput = document.getElementById('dreamRecipientName');
    const foldingLoader = document.getElementById('boatFoldingLoader');
    const resultCard = document.getElementById('customDreamResult');
    const resultText = document.getElementById('dreamResultText');
    const copyBtn = document.getElementById('copyDreamBtn');
    const deliverAgainBtn = document.getElementById('deliverAgainBtn');
    const copyToast = document.getElementById('copySuccessToast');

    if (!form || !nameInput || !resultCard) return;

    const vehiclesAndAdventures = [
      "ride a toasted marshmallow whale over a warm pancake sea",
      "drift in an acorn sailboat across a river of melted starlight",
      "float in a teacup balloon past strawberry milk clouds",
      "leap across floating sponge cakes to high-five the smiling moon",
      "sail a glowing origami swan through slumbering lavender valleys",
      "curl up in a dandelion hammock while friendly comets whisper lullabies",
      "dance with luminescent jellyfish under a velvet midnight aurora",
      "glide on caramel ice skates across a pond of peppermint tea",
      "hop on sleepy bumblebees to harvest spun-sugar stardust",
      "explore an underwater library of glowing bedtime stories with cozy seals"
    ];

    const warmClosings = [
      "guided by Lumo's gentle belly nightlight.",
      "tucked safely under a quilt of velvet stardust.",
      "while peaceful wind chimes sing you to sleep.",
      "with sweet dreams nestled softly against your pillow.",
      "wrapped in warm lullabies and happy morning hopes."
    ];

    let currentDreamText = "";

    function generateDream(rawName) {
      let cleanName = rawName.replace(/[<>'"`/\\&]/g, '').trim().slice(0, 20);
      if (!cleanName) cleanName = "Sweet Dreamer";

      const adventure = vehiclesAndAdventures[Math.floor(Math.random() * vehiclesAndAdventures.length)];
      const closing = warmClosings[Math.floor(Math.random() * warmClosings.length)];

      currentDreamText = `${cleanName}, tonight you ${adventure}, ${closing} Sleep tight! 🌙✨`;

      // Animate boat folding for 750ms
      foldingLoader.style.display = 'flex';
      resultCard.style.display = 'none';
      if (copyToast) copyToast.style.display = 'none';

      AudioEngine.playChime(659.25);

      setTimeout(() => {
        foldingLoader.style.display = 'none';
        resultCard.style.display = 'block';

        resultText.innerHTML = `<span class="recipient-highlight">${cleanName}</span>, tonight you ${adventure}, ${closing} Sleep tight! 🌙✨`;

        AudioEngine.playTownArrival();
        incrementOdometer();
      }, 750);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      AudioEngine.playClick();
      generateDream(nameInput.value);
    });

    if (deliverAgainBtn) {
      deliverAgainBtn.addEventListener('click', () => {
        AudioEngine.playClick();
        generateDream(nameInput.value || "Dreamer");
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        AudioEngine.playClick();
        if (!currentDreamText) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(currentDreamText).then(() => {
            showCopyToast();
          }).catch(() => fallbackCopy(currentDreamText));
        } else {
          fallbackCopy(currentDreamText);
        }
      });
    }

    function fallbackCopy(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showCopyToast();
      } catch (err) {
        console.warn('Copy fallback failed', err);
      }
      document.body.removeChild(textarea);
    }

    function showCopyToast() {
      if (!copyToast) return;
      copyToast.style.display = 'block';
      AudioEngine.playChime(1046.5);
      setTimeout(() => {
        copyToast.style.display = 'none';
      }, 2400);
    }
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

    // Webring interactive buttons (real navigation & fun actions)
    const webringPrev = document.getElementById('webringPrev');
    const webringRandom = document.getElementById('webringRandom');
    const webringNext = document.getElementById('webringNext');
    const navSections = ['hero', 'about', 'story', 'work', 'map', 'footer'];

    function showWebringToast(msg) {
      let toast = document.getElementById('webringToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'webringToast';
        toast.className = 'idle-hint-bubble visible';
        toast.style.zIndex = '950';
        toast.style.bottom = '32px';
        document.body.appendChild(toast);
      }
      toast.innerHTML = `<span class="idle-text">${msg}</span>`;
      toast.classList.add('visible');
      setTimeout(() => toast.classList.remove('visible'), 2600);
    }

    if (webringPrev) {
      webringPrev.addEventListener('click', () => {
        AudioEngine.playClick();
        window.scrollBy({ top: -window.innerHeight * 0.7, behavior: 'smooth' });
        showWebringToast("« Sailing back toward previous starlight! ✨");
        AudioEngine.playChime(659);
      });
    }

    if (webringNext) {
      webringNext.addEventListener('click', () => {
        AudioEngine.playClick();
        window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' });
        showWebringToast("Next Star on the horizon! » 🌙");
        AudioEngine.playChime(784);
      });
    }

    if (webringRandom) {
      webringRandom.addEventListener('click', () => {
        AudioEngine.playClick();
        const randId = navSections[Math.floor(Math.random() * navSections.length)];
        const target = document.getElementById(randId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          showWebringToast(`✦ Teleported to the ${randId.toUpperCase()} realm! ⛵`);
          AudioEngine.playChime(987);
        }
      });
    }
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

  // 5. Lumo Companion (Step 5: Immersion Peeking Character)
  function setupLumoCompanion() {
    const companion = document.getElementById('lumoCompanion');
    const avatarBtn = document.getElementById('companionAvatarBtn');
    const bubble = document.getElementById('companionBubble');

    if (!companion || !avatarBtn || !bubble) return;

    const sectionEmojis = {
      hero: "💤",
      about: "💛",
      story: "✨",
      work: "🥞",
      map: "⛵",
      footer: "📝"
    };

    let activeSectionId = "hero";
    let isTemporarilyTalking = false;

    const sections = document.querySelectorAll('section, footer');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            activeSectionId = entry.target.id;
            if (!isTemporarilyTalking) {
              bubble.textContent = sectionEmojis[activeSectionId] || "✨";
            }
          }
        });
      }, { threshold: 0.3 });

      sections.forEach(sec => observer.observe(sec));
    }

    const playfulGreetings = ["🥰 Hi!", "✨ Giggle!", "💛 Hehe!", "🌙 Boop!"];
    avatarBtn.addEventListener('click', () => {
      AudioEngine.playGiggle();
      companion.classList.remove('wiggling');
      void companion.offsetWidth;
      companion.classList.add('wiggling');

      isTemporarilyTalking = true;
      const greeting = playfulGreetings[Math.floor(Math.random() * playfulGreetings.length)];
      bubble.textContent = greeting;

      setTimeout(() => {
        isTemporarilyTalking = false;
        bubble.textContent = sectionEmojis[activeSectionId] || "✨";
      }, 1600);
    });
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
    setupCustomDreamDelivery();
    setupGuestbook();
    setupResponsiveChaosMode();
    setupSparkleTrail();
    setupLumoCompanion();
  });

})();

