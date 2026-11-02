/**
 * Arnold Portfolio - Core Application Script
 * Powered by Lenis Momentum Scroll, Interactive Avatar Companion (Option B),
 * Cosmic Dust Canvas Engine, and High-Precision Counter Easing.
 */

(function () {
  'use strict';

  /* =========================================================================
     1. INLINED LENIS SMOOTH MOMENTUM SCROLL (Exact veee.app engine)
     ========================================================================= */
  class Lenis {
    constructor({ lerp = 0.09, wheelMultiplier = 1, smoothWheel = true } = {}) {
      this.lerp = lerp;
      this.wheelMultiplier = wheelMultiplier;
      this.smoothWheel = smoothWheel;
      this.targetScroll = window.scrollY;
      this.actualScroll = window.scrollY;
      this.isScrolling = false;
      this.callbacks = [];

      this.onWheel = this.onWheel.bind(this);
      this.onScroll = this.onScroll.bind(this);
      this.raf = this.raf.bind(this);

      window.addEventListener('wheel', this.onWheel, { passive: false });
      window.addEventListener('scroll', this.onScroll, { passive: true });
      requestAnimationFrame(this.raf);
    }

    onWheel(e) {
      if (!this.smoothWheel) return;
      if (document.body.classList.contains('mobile-open')) return;
      e.preventDefault();
      const delta = e.deltaY * this.wheelMultiplier;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      this.targetScroll = Math.max(0, Math.min(this.targetScroll + delta, maxScroll));
      this.isScrolling = true;
    }

    onScroll() {
      if (!this.isScrolling) {
        this.targetScroll = window.scrollY;
        this.actualScroll = window.scrollY;
      }
    }

    raf() {
      if (Math.abs(this.targetScroll - this.actualScroll) > 0.5) {
        this.actualScroll += (this.targetScroll - this.actualScroll) * this.lerp;
        window.scrollTo(0, this.actualScroll);
        this.emit();
      } else if (this.isScrolling) {
        this.actualScroll = this.targetScroll;
        this.isScrolling = false;
        this.emit();
      }
      requestAnimationFrame(this.raf);
    }

    on(cb) {
      this.callbacks.push(cb);
    }

    emit() {
      for (let i = 0; i < this.callbacks.length; i++) {
        this.callbacks[i]({ scroll: this.actualScroll });
      }
    }

    scrollTo(targetY) {
      this.targetScroll = targetY;
      this.isScrolling = true;
    }
  }

  // Initialize Lenis
  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });

  // Connect Lenis with GSAP ScrollTrigger if present
  if (window.ScrollTrigger) {
    lenis.on(() => ScrollTrigger.update());
    ScrollTrigger.scrollerProxy(window, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value);
        }
        return window.scrollY;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      }
    });
  }

  // Smooth anchor links with Lenis
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY;
        lenis.scrollTo(top);
      }
    });
  });

  /* =========================================================================
     2. COSMIC DUST CANVAS ENGINE (Ultra-lightweight 2D Canvas ambient field)
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

    const PARTICLE_COUNT = Math.min(85, Math.floor((width * height) / 12000));
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.6,
        alpha: Math.random() * 0.5 + 0.15,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: -Math.random() * 0.45 - 0.1,
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

    function renderCanvas(now) {
      ctx.clearRect(0, 0, width, height);

      const mxOffset = (mouseX / width - 0.5) * 20;
      const myOffset = (mouseY / height - 0.5) * 20;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.phase += p.pulseSpeed;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const dynamicAlpha = Math.max(0.1, p.alpha + Math.sin(p.phase) * 0.2);

        ctx.fillStyle = `rgba(245, 166, 35, ${dynamicAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x + mxOffset * (p.radius * 0.5), p.y + myOffset * (p.radius * 0.5), p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(renderCanvas);
    }
    requestAnimationFrame(renderCanvas);
  })();

  /* =========================================================================
     3. INTERACTIVE MAKIMA AVATAR COMPANION (Option B)
     Real-time cursor & touch tracking, eye gaze shift, dynamic speech bubbles,
     natural blinking, and interactive tap reactions.
     ========================================================================= */
  (function initAvatarCompanion() {
    const hud = document.getElementById('avatarHud');
    if (!hud) return;

    const portraitWrap = hud.querySelector('.avatar-portrait-wrap');
    const avatarImg = document.getElementById('hudAvatarImg');
    const irisShimmer = hud.querySelector('.eye-iris-shimmer');
    const speechBubble = document.getElementById('avatarSpeech');
    const speechText = document.getElementById('speechText');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    // Track Cursor or Touch
    function updatePointer(x, y) {
      mouseX = x;
      mouseY = y;
      if (!portraitWrap) return;
      const rect = portraitWrap.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (x - centerX) / (window.innerWidth / 2);
      const deltaY = (y - centerY) / (window.innerHeight / 2);

      targetTiltX = Math.max(-1, Math.min(1, deltaX));
      targetTiltY = Math.max(-1, Math.min(1, deltaY));
    }

    window.addEventListener('mousemove', (e) => {
      updatePointer(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    // Smooth tracking loop for head tilt & iris follow
    function animLoop() {
      currentTiltX += (targetTiltX - currentTiltX) * 0.08;
      currentTiltY += (targetTiltY - currentTiltY) * 0.08;

      if (portraitWrap) {
        const rotY = currentTiltX * 18;
        const rotX = -currentTiltY * 18;
        const transX = currentTiltX * 8;
        const transY = currentTiltY * 8;
        portraitWrap.style.transform = `rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) translate3d(${transX.toFixed(2)}px, ${transY.toFixed(2)}px, 0)`;
      }

      if (avatarImg) {
        avatarImg.style.transform = `scale(1.12) translate(${(-currentTiltX * 6).toFixed(2)}px, ${(-currentTiltY * 6).toFixed(2)}px)`;
      }

      if (irisShimmer) {
        const eyeX = 50 + currentTiltX * 22;
        const eyeY = 45 + currentTiltY * 22;
        irisShimmer.style.setProperty('--eye-x', `${eyeX.toFixed(1)}%`);
        irisShimmer.style.setProperty('--eye-y', `${eyeY.toFixed(1)}%`);
      }

      requestAnimationFrame(animLoop);
    }
    requestAnimationFrame(animLoop);

    // Natural Eye Blinking
    function triggerBlink() {
      if (!portraitWrap) return;
      portraitWrap.classList.add('blinking');
      setTimeout(() => {
        portraitWrap.classList.remove('blinking');
        const nextBlink = Math.random() * 3500 + 3000;
        setTimeout(triggerBlink, nextBlink);
      }, 120);
    }
    setTimeout(triggerBlink, 3000);

    // Contextual Section Speech Map
    const sectionMessages = {
      hero: "Hey! I'm Arnold 👋 Building products people love.",
      about: "Product Developer • Frontend & Mobile Engineer.",
      focus: "React, React Native, TypeScript & UI/UX systems.",
      highlights: "2+ core platforms • 5+ live client sites active!",
      apps: "Explore Lumis OS & Nestie mobile creator app.",
      work: "5 live client builds deployed and active.",
      connect: "Let's collaborate! davidonyekaonwu565@gmail.com"
    };

    let currentSection = 'hero';
    let isCustomMessage = false;

    function setSpeech(msg, isCustom = false) {
      if (!speechText) return;
      isCustomMessage = isCustom;
      speechText.classList.add('fading');
      setTimeout(() => {
        speechText.textContent = msg;
        speechText.classList.remove('fading');
      }, 180);
    }

    // Interactive Tap / Click Dialogue Cycle
    const interactiveQuips = [
      "Watching your screen! 👁️✨",
      "Need a high-converting web or mobile product? Arnold builds fast.",
      "Check out Lumis OS & Nestie mobile app featured below!",
      "Touch-first architecture & sub-second loading speeds ⚡",
      "Hit Connect or copy my email to build something crazy!",
      "Clean code, zero bloat, shipped to production."
    ];
    let quipIndex = 0;

    function handleAvatarTap(e) {
      e.stopPropagation();
      if (!portraitWrap) return;
      portraitWrap.classList.remove('clicked');
      void portraitWrap.offsetWidth; // trigger reflow
      portraitWrap.classList.add('clicked');

      const quip = interactiveQuips[quipIndex % interactiveQuips.length];
      quipIndex++;
      setSpeech(quip, true);

      // Reset to section message after 4.5s
      clearTimeout(portraitWrap._resetTimer);
      portraitWrap._resetTimer = setTimeout(() => {
        if (sectionMessages[currentSection]) {
          setSpeech(sectionMessages[currentSection], false);
        }
      }, 4500);
    }

    if (portraitWrap) portraitWrap.addEventListener('click', handleAvatarTap);
    if (speechBubble) speechBubble.addEventListener('click', handleAvatarTap);

    // Section Observer for Dynamic Speech & Active Nav Links
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-item');

    const secObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          currentSection = id;

          // Update active navigation state
          navLinks.forEach((link) => {
            if (link.getAttribute('data-sec') === id || link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });

          // Update speech if not displaying a custom user-tapped quote
          if (!isCustomMessage && sectionMessages[id]) {
            setSpeech(sectionMessages[id]);
          }
        }
      });
    }, { threshold: 0.25, rootMargin: '-10% 0px -40% 0px' });

    sections.forEach((sec) => secObserver.observe(sec));
  })();

  /* =========================================================================
     4. ANIMATED STAT COUNTERS (Exact veee.app smooth easeOutCubic)
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

      const duration = 1600;
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
    }, { threshold: 0.3 });

    nums.forEach((el) => observer.observe(el));

    // Fallback: Check visible elements on load
    setTimeout(() => {
      nums.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          runCounter(el);
        }
      });
    }, 600);
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
