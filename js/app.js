/**
 * Arnold Portfolio - Core Application Script
 * Ultra-Clean Minimalist Architecture (100% Native 120 FPS Scrolling)
 * Cosmic Ambient Dust Canvas & Precision Animated Counters (easeOutCubic)
 */

(function () {
  'use strict';

  /* =========================================================================
     1. 100% NATIVE SMOOTH SCROLL & ANCHORS (Zero Lag, Instant 1:1 Response)
     ========================================================================= */
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
     2. ACTIVE SECTION NAV TRACKER
     ========================================================================= */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-item');

  const secObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        const id = en.target.id;
        navLinks.forEach((link) => {
          if (link.getAttribute('data-sec') === id || link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach((sec) => secObserver.observe(sec));

  /* =========================================================================
     3. COSMIC DUST CANVAS (Lightweight 2D Ambient Starfield)
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

    const PARTICLE_COUNT = Math.min(75, Math.floor((width * height) / 12000));
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
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
