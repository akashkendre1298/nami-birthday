/**
 * BGMI 673-Day Milestone & Birthday Celebration
 * Interactive Logic, Particle Engines, Web Audio Synthesizer, & Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Audio Synthesizer using Web Audio API (No external MP3 files needed)
  // -------------------------------------------------------------------------
  let audioCtx = null;
  let bgmPlaying = false;
  let bgmInterval = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Tactical UI Click Sound
  function playUiClick() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // Cute Squeak for Teal Buddies
  function playBuddySqueak() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 0.12);
      osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.22);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      console.warn(e);
    }
  }

  // Party Popper Bomb Sound (Punchy air burst + festive chord)
  function playPartyPopperSound() {
    try {
      const ctx = getAudioContext();
      
      // 1. Noise burst (Popper blast)
      const bufferSize = ctx.sampleRate * 0.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.18);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.6, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      whiteNoise.start();

      // 2. Celebratory Chimes (Happy Birthday fanfare chord)
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + 0.05 + idx * 0.06);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + 0.05 + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7 + idx * 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + 0.05 + idx * 0.06);
        osc.stop(ctx.currentTime + 0.75 + idx * 0.06);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // Ambient BGMI Celebration Melody (Soft arpeggiated loop)
  function toggleBgm() {
    const ctx = getAudioContext();
    const btn = document.getElementById('bgmToggleBtn');
    const text = document.getElementById('bgmText');
    const icon = document.getElementById('bgmIcon');

    if (!bgmPlaying) {
      bgmPlaying = true;
      text.innerText = 'BGM: ON';
      icon.innerText = '🎶';
      btn.style.borderColor = '#ffc83b';
      btn.style.boxShadow = '0 0 15px rgba(255, 200, 59, 0.6)';

      const melody = [392, 440, 523.25, 587.33, 659.25, 783.99]; // G4, A4, C5, D5, E5, G5
      let step = 0;

      bgmInterval = setInterval(() => {
        if (!bgmPlaying) return;
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(melody[step % melody.length], ctx.currentTime);

          gain.gain.setValueAtTime(0.06, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.42);

          step++;
        } catch (e) {
          console.warn(e);
        }
      }, 350);
    } else {
      bgmPlaying = false;
      clearInterval(bgmInterval);
      text.innerText = 'BGM: OFF';
      icon.innerText = '🎵';
      btn.style.borderColor = '#00e5ff';
      btn.style.boxShadow = '0 0 10px rgba(0, 229, 255, 0.3)';
    }
  }

  document.getElementById('bgmToggleBtn').addEventListener('click', () => {
    playUiClick();
    toggleBgm();
  });

  // -------------------------------------------------------------------------
  // 2. Real-Time Dynamic Milestone Clock & Sept 25 Birthday Lock
  // -------------------------------------------------------------------------
  // Birthday Target: 25th Sept 2026 at 12:00 AM Midnight (Marks 679 Days Together!)
  const unlockDate = new Date('2026-09-25T00:00:00+05:30');

  // Calculated start date so on 25th Sept 00:00:00 it equals exactly 679 days
  // (which makes today, 23rd Sept, exactly 677 days!)
  const startDate = new Date(unlockDate.getTime() - (679 * 24 * 60 * 60 * 1000));
  
  const countdownLockScreen = document.getElementById('countdownLockScreen');
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');

  // Clear any existing preview bypass flag so lock is strictly enforced
  sessionStorage.removeItem('shinigami_preview');

  let isUnlocked = false;

  function checkUnlockStatus() {
    const isTimeReached = new Date() >= unlockDate;

    if (isTimeReached && !isUnlocked) {
      isUnlocked = true;
      if (countdownLockScreen) {
        countdownLockScreen.classList.add('unlocked');
        setTimeout(() => {
          countdownLockScreen.style.display = 'none';
        }, 650);
      }
    }
  }

  function updateClock() {
    const current = new Date();

    // 1. Update Header Milestone Counter (Dynamic: 677 on 23rd, 678 on 24th, 679 on 25th Sept...)
    const elapsedDiff = current - startDate;
    const days = Math.floor(elapsedDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((elapsedDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((elapsedDiff / (1000 * 60)) % 60);
    const seconds = Math.floor((elapsedDiff / 1000) % 60);

    const pad = (n) => String(Math.max(0, n)).padStart(2, '0');
    const clockEl = document.getElementById('liveClock');
    const daysEl = document.getElementById('daysCount');

    if (clockEl) {
      clockEl.innerText = `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    }
    if (daysEl) {
      daysEl.innerText = days;
    }

    // Keep page title synchronized with current day count
    document.title = `BGMI - ${days} Days Together | Happy Birthday Ñami!`;

    // Keep all day mentions across letters, banners, and modals dynamic
    document.querySelectorAll('.dynamic-days-count').forEach((el) => {
      if (el.textContent !== String(days)) {
        el.textContent = days;
      }
    });

    // 2. Update Countdown Timer to 25th Sept Midnight (Unlocks ONLY when timer hits 0)
    const remainingDiff = unlockDate - current;

    if (remainingDiff <= 0) {
      if (cdDays) cdDays.innerText = '00';
      if (cdHours) cdHours.innerText = '00';
      if (cdMinutes) cdMinutes.innerText = '00';
      if (cdSeconds) cdSeconds.innerText = '00';

      // Countdown Reached 0: Trigger celebration fanfare & dissolve lock screen
      if (!isUnlocked) {
        checkUnlockStatus();
        triggerPartyPoppers();
      }
    } else {
      const cdD = Math.floor(remainingDiff / (1000 * 60 * 60 * 24));
      const cdH = Math.floor((remainingDiff / (1000 * 60 * 60)) % 24);
      const cdM = Math.floor((remainingDiff / (1000 * 60)) % 60);
      const cdS = Math.floor((remainingDiff / 1000) % 60);

      if (cdDays) cdDays.innerText = pad(cdD);
      if (cdHours) cdHours.innerText = pad(cdH);
      if (cdMinutes) cdMinutes.innerText = pad(cdM);
      if (cdSeconds) cdSeconds.innerText = pad(cdS);
    }
  }

  checkUnlockStatus();
  setInterval(updateClock, 1000);
  updateClock();

  // -------------------------------------------------------------------------
  // 3. Canvas-Based Particle Engine: Party Popper Bombs & Confetti
  // -------------------------------------------------------------------------
  const popperCanvas = document.getElementById('popperCanvas');
  const pCtx = popperCanvas.getContext('2d');
  let confettiParticles = [];
  let popperAnimFrame = null;

  function resizeCanvas() {
    popperCanvas.width = window.innerWidth;
    popperCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const confettiColors = ['#ff0055', '#00e5ff', '#ffc83b', '#ff6a00', '#00ffc4', '#a855f7', '#ffffff'];

  class ConfettiParticle {
    constructor(x, y, angle, speed, isRibbon = false) {
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.speed = speed;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.size = Math.random() * 8 + 6;
      this.isRibbon = isRibbon;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 12;
      this.gravity = 0.22;
      this.drag = 0.985;
      this.alpha = 1;
      this.decay = Math.random() * 0.006 + 0.004;
    }

    update() {
      this.vx *= this.drag;
      this.vy = this.vy * this.drag + this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      this.alpha -= this.decay;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;

      if (this.isRibbon) {
        ctx.fillRect(-this.size / 2, -this.size * 2, this.size, this.size * 3.5);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Burst Party Popper Bombs
  function triggerPartyPoppers() {
    playPartyPopperSound();

    const w = window.innerWidth;
    const h = window.innerHeight;

    // Left Popper (shoots up-right)
    for (let i = 0; i < 90; i++) {
      const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.8;
      const speed = Math.random() * 22 + 10;
      confettiParticles.push(new ConfettiParticle(w * 0.08, h * 0.92, angle, speed, Math.random() > 0.5));
    }

    // Right Popper (shoots up-left)
    for (let i = 0; i < 90; i++) {
      const angle = (-3 * Math.PI) / 4 + (Math.random() - 0.5) * 0.8;
      const speed = Math.random() * 22 + 10;
      confettiParticles.push(new ConfettiParticle(w * 0.92, h * 0.92, angle, speed, Math.random() > 0.5));
    }

    // Center START button burst
    for (let i = 0; i < 80; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
      const speed = Math.random() * 20 + 8;
      confettiParticles.push(new ConfettiParticle(w * 0.5, h * 0.88, angle, speed, Math.random() > 0.4));
    }

    if (!popperAnimFrame) {
      animateConfetti();
    }
  }

  function animateConfetti() {
    pCtx.clearRect(0, 0, popperCanvas.width, popperCanvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.update();
      p.draw(pCtx);
      if (p.alpha <= 0 || p.y > popperCanvas.height + 50) {
        confettiParticles.splice(i, 1);
      }
    }

    if (confettiParticles.length > 0) {
      popperAnimFrame = requestAnimationFrame(animateConfetti);
    } else {
      popperAnimFrame = null;
    }
  }

  // -------------------------------------------------------------------------
  // 4. Ambient Sparkles & Floating Particles Canvas
  // -------------------------------------------------------------------------
  const ambientCanvas = document.getElementById('ambientCanvas');
  const aCtx = ambientCanvas.getContext('2d');
  let ambientParticles = [];

  function resizeAmbient() {
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeAmbient);
  resizeAmbient();

  for (let i = 0; i < 35; i++) {
    ambientParticles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      vy: -(Math.random() * 0.5 + 0.2),
      vx: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      color: Math.random() > 0.5 ? '#00e5ff' : '#ffc83b'
    });
  }

  function renderAmbient() {
    aCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
    ambientParticles.forEach(p => {
      p.y += p.vy;
      p.x += p.vx;
      if (p.y < -10) {
        p.y = ambientCanvas.height + 10;
        p.x = Math.random() * ambientCanvas.width;
      }
      aCtx.save();
      aCtx.globalAlpha = p.alpha;
      aCtx.fillStyle = p.color;
      aCtx.shadowBlur = 8;
      aCtx.shadowColor = p.color;
      aCtx.beginPath();
      aCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      aCtx.fill();
      aCtx.restore();
    });
    requestAnimationFrame(renderAmbient);
  }
  renderAmbient();

  // -------------------------------------------------------------------------
  // 5. START Button Birthday Action & Modal Controller
  // -------------------------------------------------------------------------
  const startBtn = document.getElementById('startBtn');
  const celebrationOverlay = document.getElementById('celebrationOverlay');
  const closeCelebrationBtn = document.getElementById('closeCelebrationBtn');

  startBtn.addEventListener('click', () => {
    triggerPartyPoppers();
    setTimeout(() => {
      celebrationOverlay.classList.add('active');
    }, 400);
  });

  closeCelebrationBtn.addEventListener('click', () => {
    playUiClick();
    celebrationOverlay.classList.remove('active');
  });

  // -------------------------------------------------------------------------
  // 6. Birthday Messages Modal: Tabs & Controller
  // -------------------------------------------------------------------------
  const messagesModal = document.getElementById('messagesModal');
  const hotspotBoard = document.getElementById('hotspotBoard');
  const openLetterBtn = document.getElementById('openLetterBtn');
  const closeMessagesBtn = document.getElementById('closeMessagesBtn');
  const messagesBackdrop = document.getElementById('messagesBackdrop');

  function openMessagesModal() {
    playUiClick();
    messagesModal.classList.add('active');
  }

  function closeMessagesModal() {
    playUiClick();
    messagesModal.classList.remove('active');
  }

  hotspotBoard.addEventListener('click', openMessagesModal);
  openLetterBtn.addEventListener('click', openMessagesModal);
  closeMessagesBtn.addEventListener('click', closeMessagesModal);
  messagesBackdrop.addEventListener('click', closeMessagesModal);

  // Message Tabs Switcher
  const msgTabs = document.querySelectorAll('.msg-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  msgTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playUiClick();
      const target = tab.getAttribute('data-tab');

      msgTabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetContent = document.getElementById(`tab-${target}`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // Custom Birthday Note Submission & LocalStorage
  const customNoteInput = document.getElementById('customNoteInput');
  const addNoteBtn = document.getElementById('addNoteBtn');
  const customNotesList = document.getElementById('customNotesList');

  function loadCustomNotes() {
    const saved = JSON.parse(localStorage.getItem('bgmi_birthday_notes') || '[]');
    customNotesList.innerHTML = '';
    saved.forEach(note => {
      const item = document.createElement('div');
      item.className = 'custom-note-item';
      item.innerText = `💬 "${note}"`;
      customNotesList.appendChild(item);
    });
  }

  addNoteBtn.addEventListener('click', () => {
    const text = customNoteInput.value.trim();
    if (!text) return;
    playUiClick();
    const saved = JSON.parse(localStorage.getItem('bgmi_birthday_notes') || '[]');
    saved.push(text);
    localStorage.setItem('bgmi_birthday_notes', JSON.stringify(saved));
    customNoteInput.value = '';
    loadCustomNotes();
  });

  customNoteInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addNoteBtn.click();
  });

  loadCustomNotes();

  // -------------------------------------------------------------------------
  // 7. Dedicated Memories Gallery Modal & Lightbox
  // -------------------------------------------------------------------------
  const memoriesModal = document.getElementById('memoriesModal');
  const openMemoriesBtn = document.getElementById('openMemoriesBtn');
  const closeMemoriesBtn = document.getElementById('closeMemoriesBtn');
  const memoriesBackdrop = document.getElementById('memoriesBackdrop');

  function openMemoriesModal() {
    playUiClick();
    memoriesModal.classList.add('active');
  }

  function closeMemoriesModal() {
    playUiClick();
    memoriesModal.classList.remove('active');
  }

  openMemoriesBtn.addEventListener('click', openMemoriesModal);
  closeMemoriesBtn.addEventListener('click', closeMemoriesModal);
  memoriesBackdrop.addEventListener('click', closeMemoriesModal);

  // Lightbox Data & Logic
  const memoryItems = [
    {
      img: 'memory1.jpg',
      badge: 'Moments 🌿',
      title: 'A Happier Version of Me',
      desc: 'Waterfalls, green trails, and pure carefree happiness.'
    },
    {
      img: 'memory2.jpg',
      badge: 'Golden Hour 🌅',
      title: 'Moments That Make Me Me',
      desc: 'Golden sunset skies and warm, unforgettable memories.'
    },
    {
      img: 'memory3.jpg',
      badge: 'Elegance 🥻',
      title: 'Grace in Turquoise',
      desc: 'Traditional, breathtaking, and radiating pure beauty.'
    },
    {
      img: 'memory4.jpg',
      badge: 'Sunshine 🌸',
      title: 'Garden Bloom',
      desc: 'Peaceful moments surrounded by flowers and sunny days.'
    },
    {
      img: 'memory5.jpg',
      badge: 'Style ✨',
      title: 'Chic & Casual',
      desc: 'Effortlessly fashionable on shopping day.'
    },
    {
      img: 'memory6.jpg',
      badge: 'Friendship 💕',
      title: 'Sweet Smiles & Besties',
      desc: 'Bright smiles and joyful moments with best friends.'
    },
    {
      img: 'memory7.jpg',
      badge: 'Timeless 🤍',
      title: 'Sweetest Hugs',
      desc: 'Unconditional warmth and memories kept forever.'
    },
    {
      img: 'memory8.jpg',
      badge: 'Fun Times 🛍️',
      title: 'Mall Days & Smiles',
      desc: 'Laughter, shopping runs, and cherished memories.'
    }
  ];

  const photoLightboxModal = document.getElementById('photoLightboxModal');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');
  const prevPhotoBtn = document.getElementById('prevPhotoBtn');
  const nextPhotoBtn = document.getElementById('nextPhotoBtn');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxBadge = document.getElementById('lightboxBadge');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxCounter = document.getElementById('lightboxCounter');

  let currentPhotoIndex = 0;

  function showLightboxPhoto(index) {
    if (index < 0) index = memoryItems.length - 1;
    if (index >= memoryItems.length) index = 0;
    currentPhotoIndex = index;
    const item = memoryItems[index];
    if (lightboxImg) lightboxImg.src = item.img;
    if (lightboxBadge) lightboxBadge.textContent = item.badge;
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxDesc) lightboxDesc.textContent = item.desc;
    if (lightboxCounter) lightboxCounter.textContent = `${index + 1} / ${memoryItems.length}`;
  }

  function openLightbox(index) {
    playUiClick();
    showLightboxPhoto(index);
    if (photoLightboxModal) photoLightboxModal.classList.add('active');
  }

  function closeLightbox() {
    playUiClick();
    if (photoLightboxModal) photoLightboxModal.classList.remove('active');
  }

  // Open Lightbox on card click / tap
  const photoGrid = document.querySelector('.photo-cards-grid');
  if (photoGrid) {
    photoGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.polaroid-card');
      if (card) {
        const idx = parseInt(card.getAttribute('data-index') || '0', 10);
        openLightbox(idx);
      }
    });

    // Support keyboard Enter on focused card
    photoGrid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.polaroid-card');
        if (card) {
          e.preventDefault();
          const idx = parseInt(card.getAttribute('data-index') || '0', 10);
          openLightbox(idx);
        }
      }
    });
  }

  // Prevent clicks inside lightbox viewer from closing it
  const lightboxViewer = document.querySelector('.lightbox-viewer');
  if (lightboxViewer) {
    lightboxViewer.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Close handlers
  if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (photoLightboxModal) {
    photoLightboxModal.addEventListener('click', (e) => {
      if (e.target === photoLightboxModal) closeLightbox();
    });
  }

  // Prev / Next button handlers
  if (prevPhotoBtn) {
    prevPhotoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playUiClick();
      showLightboxPhoto(currentPhotoIndex - 1);
    });
  }
  if (nextPhotoBtn) {
    nextPhotoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playUiClick();
      showLightboxPhoto(currentPhotoIndex + 1);
    });
  }

  // Touch Swipe Gesture for Mobile
  let touchStartX = 0;
  let touchStartY = 0;

  if (lightboxViewer) {
    lightboxViewer.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    lightboxViewer.addEventListener('touchend', (e) => {
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const diffX = e.changedTouches[0].clientX - touchStartX;
      const diffY = e.changedTouches[0].clientY - touchStartY;
      // If horizontal swipe is greater than vertical swipe and threshold is met
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          // Swiped right -> prev photo
          playUiClick();
          showLightboxPhoto(currentPhotoIndex - 1);
        } else {
          // Swiped left -> next photo
          playUiClick();
          showLightboxPhoto(currentPhotoIndex + 1);
        }
      }
    }, { passive: true });
  }

  // Keyboard navigation for lightbox
  window.addEventListener('keydown', (e) => {
    if (!photoLightboxModal || !photoLightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') {
      playUiClick();
      showLightboxPhoto(currentPhotoIndex - 1);
    } else if (e.key === 'ArrowRight') {
      playUiClick();
      showLightboxPhoto(currentPhotoIndex + 1);
    }
  });

  // -------------------------------------------------------------------------
  // 8. Helicopter Airdrop Modal
  // -------------------------------------------------------------------------
  const airdropModal = document.getElementById('airdropModal');
  const hotspotHeli = document.getElementById('hotspotHeli');
  const closeAirdropBtn = document.getElementById('closeAirdropBtn');
  const airdropBackdrop = document.getElementById('airdropBackdrop');
  const claimAirdropBtn = document.getElementById('claimAirdropBtn');

  function openAirdrop() {
    playUiClick();
    airdropModal.classList.add('active');
  }

  function closeAirdrop() {
    playUiClick();
    airdropModal.classList.remove('active');
  }

  hotspotHeli.addEventListener('click', openAirdrop);
  closeAirdropBtn.addEventListener('click', closeAirdrop);
  airdropBackdrop.addEventListener('click', closeAirdrop);
  claimAirdropBtn.addEventListener('click', () => {
    playPartyPopperSound();
    triggerPartyPoppers();
    closeAirdrop();
  });

  // -------------------------------------------------------------------------
  // 9. Full-Screen Falling Hearts Shower Engine (Top to Bottom)
  // -------------------------------------------------------------------------
  const heartsCanvas = document.getElementById('heartsCanvas');
  const hCtx = heartsCanvas.getContext('2d');
  let heartParticles = [];
  let heartsAnimFrame = null;

  function resizeHeartsCanvas() {
    heartsCanvas.width = window.innerWidth;
    heartsCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeHeartsCanvas);
  resizeHeartsCanvas();

  const heartColors = ['#ff1744', '#f50057', '#ff4081', '#ff80ab', '#ffffff', '#ff69b4', '#e040fb'];

  class FallingHeart {
    constructor(startX, startY) {
      this.x = startX !== undefined ? startX : Math.random() * window.innerWidth;
      this.y = startY !== undefined ? startY : -20 - Math.random() * 200;
      this.size = Math.random() * 18 + 12;
      this.speed = Math.random() * 2.5 + 2.0;
      this.sway = Math.random() * 2 + 1;
      this.swaySpeed = Math.random() * 0.04 + 0.02;
      this.swayAngle = Math.random() * Math.PI * 2;
      this.rotation = (Math.random() - 0.5) * 0.5;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.color = heartColors[Math.floor(Math.random() * heartColors.length)];
      this.alpha = Math.random() * 0.4 + 0.6;
    }

    update() {
      this.y += this.speed;
      this.swayAngle += this.swaySpeed;
      this.x += Math.sin(this.swayAngle) * this.sway;
      this.rotation += this.rotSpeed;
      if (this.y > window.innerHeight - 100) {
        this.alpha -= 0.012;
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;

      // Draw heart path
      const s = this.size;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s * 0.5, -s * 0.2, -s, s * 0.3, 0, s);
      ctx.bezierCurveTo(s, s * 0.3, s * 0.5, -s * 0.2, 0, s * 0.3);
      ctx.fill();
      ctx.restore();
    }
  }

  function triggerHeartsShower() {
    playBuddySqueak();

    // Spawn 85 falling hearts across the entire screen width
    for (let i = 0; i < 85; i++) {
      const x = Math.random() * window.innerWidth;
      const y = -20 - Math.random() * (window.innerHeight * 0.6);
      heartParticles.push(new FallingHeart(x, y));
    }

    if (!heartsAnimFrame) {
      animateHearts();
    }
  }

  function animateHearts() {
    hCtx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);

    for (let i = heartParticles.length - 1; i >= 0; i--) {
      const h = heartParticles[i];
      h.update();
      h.draw(hCtx);
      if (h.alpha <= 0 || h.y > heartsCanvas.height + 40) {
        heartParticles.splice(i, 1);
      }
    }

    if (heartParticles.length > 0) {
      heartsAnimFrame = requestAnimationFrame(animateHearts);
    } else {
      heartsAnimFrame = null;
    }
  }

  // -------------------------------------------------------------------------
  // 10. Interactive Hotspots: Duo Characters, Teal Buddies & Emote Button
  // -------------------------------------------------------------------------
  const hotspotDuo = document.getElementById('hotspotDuo');
  const petLeft = document.getElementById('petLeft');
  const petRight = document.getElementById('petRight');
  const openEmoteBtn = document.getElementById('openEmoteBtn');

  hotspotDuo.addEventListener('click', () => {
    triggerHeartsShower();
  });

  openEmoteBtn.addEventListener('click', () => {
    playUiClick();
    triggerHeartsShower();
  });

  [petLeft, petRight].forEach(pet => {
    pet.addEventListener('click', (e) => {
      e.stopPropagation();
      playBuddySqueak();
      triggerHeartsShower();
      setTimeout(() => {
        pet.style.transform = '';
      }, 250);
    });
  });

  // -------------------------------------------------------------------------
  // 11. Mobile Landscape & Fullscreen Controller
  // -------------------------------------------------------------------------
  const rotateFullscreenBtn = document.getElementById('rotateFullscreenBtn');
  
  async function requestLandscapeFullscreen() {
    playUiClick();
    try {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen();
      } else if (docEl.msRequestFullscreen) {
        await docEl.msRequestFullscreen();
      }

      // Attempt screen orientation lock to landscape
      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock('landscape').catch(() => {
          // Orientation lock may fail if unsupported on iOS Safari, which is fine
        });
      }
    } catch (err) {
      console.log('Fullscreen/Orientation request:', err);
    }
  }

  if (rotateFullscreenBtn) {
    rotateFullscreenBtn.addEventListener('click', requestLandscapeFullscreen);
  }

  // Handle window resize / orientation change for canvases
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      resizeCanvas();
      resizeAmbient();
      resizeHeartsCanvas();
    }, 200);
  });
});
