/**
 * Arnold Portfolio - Core Application Script
 * 100% Native Ultra-Fast Scrolling (0ms lag, 120 FPS)
 * Interactive Screen-Pasted Character with Real-Time Eye & Cursor Tracking
 * Animated Stat Numbers (easeOutCubic)
 */

(function () {
  'use strict';

  /* =========================================================================
     1. 100% NATIVE SMOOTH SCROLL (Zero Lag, Instant 1:1 Hand Follow)
     ========================================================================= */
  // Smooth scroll for anchor links using native browser scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Header background blur on scroll
  const siteHeader = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (siteHeader) {
      if (window.scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  /* =========================================================================
     2. COSMIC DUST CANVAS (Ultra-Lightweight 2D Ambient Starfield)
     ========================================================================= */
  (function initCosmicCanvas() {
    const canvas = document.getElementById('webgl');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const PARTICLE_COUNT = Math.min(65, Math.floor((width * height) / 14000));
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.6,
        alpha: Math.random() * 0.45 + 0.15,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.4 - 0.1,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);
      const mxOffset = (mouseX / width - 0.5) * 16;
      const myOffset = (mouseY / height - 0.5) * 16;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.phase += p.pulseSpeed;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const dynAlpha = Math.max(0.1, p.alpha + Math.sin(p.phase) * 0.18);
        ctx.fillStyle = `rgba(245, 166, 35, ${dynAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x + mxOffset, p.y + myOffset, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(renderParticles);
    }
    requestAnimationFrame(renderParticles);
  })();

  /* =========================================================================
     3. SCREEN-PASTED INTERACTIVE CHARACTER (veee.app style)
     Directly on screen, tracks cursor & touch, blinking eyes, section poses
     ========================================================================= */
  (function initScreenCharacter() {
    const stage = document.getElementById('characterStage');
    const figure = document.getElementById('characterFigure');
    const pupilL = document.getElementById('trackPupilL');
    const pupilR = document.getElementById('trackPupilR');
    const blinkLayer = document.getElementById('blinkLayer');
    const speechText = document.getElementById('charSpeechText');

    if (!stage || !figure) return;

    let targetTiltX = 0;
    let targetTiltY = 0;
    let curTiltX = 0;
    let curTiltY = 0;

    let targetPupilX = 0;
    let targetPupilY = 0;
    let curPupilX = 0;
    let curPupilY = 0;

    function handlePointer(x, y) {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Normalized coordinates from -1 to 1
      const normX = (x / w) * 2 - 1;
      const normY = (y / h) * 2 - 1;

      targetTiltX = Math.max(-1, Math.min(1, normX));
      targetTiltY = Math.max(-1, Math.min(1, normY));

      // Pupil offset max ~9px
      targetPupilX = targetTiltX * 9;
      targetPupilY = targetTiltY * 7;
    }

    window.addEventListener('mousemove', (e) => {
      handlePointer(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    // Smooth animation loop for 3D tilt and pupil tracking
    function animLoop() {
      curTiltX += (targetTiltX - curTiltX) * 0.1;
      curTiltY += (targetTiltY - curTiltY) * 0.1;

      curPupilX += (targetPupilX - curPupilX) * 0.12;
      curPupilY += (targetPupilY - curPupilY) * 0.12;

      // 3D head and body tilt
      const rotY = curTiltX * 22;
      const rotX = -curTiltY * 18;
      const transX = curTiltX * 16;
      const transY = curTiltY * 14;

      figure.style.transform = `perspective(1000px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) translate3d(${transX.toFixed(2)}px, ${transY.toFixed(2)}px, 0)`;

      // Move pupils to follow cursor / finger
      if (pupilL && pupilR) {
        const pupilTransform = `translate(calc(-50% + ${curPupilX.toFixed(1)}px), calc(-50% + ${curPupilY.toFixed(1)}px))`;
        pupilL.style.transform = pupilTransform;
        pupilR.style.transform = pupilTransform;
      }

      requestAnimationFrame(animLoop);
    }
    requestAnimationFrame(animLoop);

    // Natural Eye Blinking Cycle
    function triggerBlink() {
      if (!blinkLayer) return;
      blinkLayer.classList.add('blinking');
      setTimeout(() => {
        blinkLayer.classList.remove('blinking');
        const next = Math.random() * 3200 + 2800;
        setTimeout(triggerBlink, next);
      }, 120);
    }
    setTimeout(triggerBlink, 2500);

    // Contextual Section Speech & Poses
    const sectionData = {
      hero: {
        cls: 'sec-hero',
        msg: "Hey! I'm Arnold 👋 Building products that convert."
      },
      about: {
        cls: 'sec-about',
        msg: "Product Developer • Frontend & Mobile Engineer."
      },
      focus: {
        cls: 'sec-focus',
        msg: "React, React Native, TypeScript & modern UI/UX."
      },
      highlights: {
        cls: 'sec-highlights',
        msg: "Real metrics: 2+ platforms • 5+ live client sites!"
      },
      apps: {
        cls: 'sec-apps',
        msg: "Featured: Lumis Web OS & Nestie mobile app!"
      },
      work: {
        cls: 'sec-work',
        msg: "5 live production client websites deployed."
      },
      connect: {
        cls: 'sec-connect',
        msg: "Let's build something crazy! davidonyekaonwu565@gmail.com"
      }
    };

    let activeSection = 'hero';
    let isUserTapped = false;

    function setSpeech(msg, isCustom = false) {
      if (!speechText) return;
      isUserTapped = isCustom;
      speechText.classList.add('fading');
      setTimeout(() => {
        speechText.textContent = msg;
        speechText.classList.remove('fading');
      }, 160);
    }

    // Tap/Click Reaction
    const tapQuotes = [
      "I'm following your hand right on screen! 👁️✨",
      "Need a fast digital product? Arnold writes clean code.",
      "Lumis OS & Nestie mobile app are featured below!",
      "Touch-first 120fps scrolling on every phone ⚡",
      "Hit Connect or copy my email to build together!"
    ];
    let tapIdx = 0;

    figure.addEventListener('click', (e) => {
      e.stopPropagation();
      figure.classList.remove('clicked');
      void figure.offsetWidth;
      figure.classList.add('clicked');

      const quote = tapQuotes[tapIdx % tapQuotes.length];
      tapIdx++;
      setSpeech(quote, true);

      clearTimeout(figure._timer);
      figure._timer = setTimeout(() => {
        if (sectionData[activeSection]) {
          setSpeech(sectionData[activeSection].msg, false);
        }
      }, 4000);
    });

    // Section Observer for Character Position Poses & Speech
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-item');

    const secObserver = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const id = en.target.id;
          activeSection = id;

          // Update active navigation item
          navLinks.forEach((link) => {
            if (link.getAttribute('data-sec') === id || link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });

          // Transition character stage class
          if (sectionData[id]) {
            stage.className = `screen-character-stage ${sectionData[id].cls}`;
            if (!isUserTapped) {
              setSpeech(sectionData[id].msg);
            }
          }
        }
      });
    }, { threshold: 0.25, rootMargin: '-10% 0px -40% 0px' });

    sections.forEach((sec) => secObserver.observe(sec));
  })();

  /* =========================================================================
     4. ANIMATED STAT COUNTERS (veee.app easeOutCubic)
     ========================================================================= */
  (function initStatCounters() {
    const nums = document.querySelectorAll('.stat-num[data-count]');
    if (!nums.length) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function runCounter(el) {
      if (el._hasAnimated) return;
      el._hasAnimated = true;

      const target = parseFloat(el.getAttribute('data-count')) || 0;
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';

      if (reduceMotion) {
        el.textContent = `${prefix}${target}${suffix}`;
        return;
      }

      const duration = 1500;
      let startTime = null;

      function step(now) {
        if (!startTime) startTime = now;
        const progress = Math.min((now - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease out
        const currentVal = Math.round(target * easeOut);

        el.textContent = `${prefix}${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = `${prefix}${target}${suffix}`;
        }
      }

      requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    nums.forEach((el) => observer.observe(el));

    // Fallback: Check visible elements on load
    setTimeout(() => {
      nums.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          runCounter(el);
        }
      });
    }, 500);
  })();

  /* =========================================================================
     5. EMAIL CLIPBOARD COPY WITH TOAST
     ========================================================================= */
  (function initClipboardCopy() {
    const toast = document.getElementById('toastNotice');
    const copyButtons = document.querySelectorAll('[data-copy]');
    if (!copyButtons.length) return;

    function showToast(message) {
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add('show');
      clearTimeout(toast._timer);
      toast._timer = setTimeout(() => {
        toast.classList.remove('show');
      }, 2400);
    }

    copyButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const textToCopy = btn.getAttribute('data-copy');
        if (!textToCopy) return;

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('Email copied to clipboard! 📋');
          }).catch(() => {
            fallbackCopy(textToCopy);
          });
        } else {
          fallbackCopy(textToCopy);
        }
      });
    });

    function fallbackCopy(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showToast('Email copied to clipboard! 📋');
      } catch (err) {
        showToast(`Email: ${text}`);
      }
      document.body.removeChild(textarea);
    }
  })();

  /* =========================================================================
     6. MOBILE NAVIGATION DRAWER
     ========================================================================= */
  (function initMobileDrawer() {
    const toggle = document.getElementById('mobileToggle');
    const drawer = document.getElementById('mobileDrawer');
    if (!toggle || !drawer) return;

    toggle.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('active');
      toggle.classList.toggle('active');
      document.body.classList.toggle('mobile-open', isOpen);
    });

    drawer.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        drawer.classList.remove('active');
        toggle.classList.remove('active');
        document.body.classList.remove('mobile-open');
      });
    });
  })();

})();
