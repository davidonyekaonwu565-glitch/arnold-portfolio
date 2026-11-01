/**
 * =========================================================================
 * ARNOLD — INTERACTIVE 3D & MOBILE ENGINE
 * Lightweight Three.js Character + Touch Swipe + Eye Tracking
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileDrawer();
  initEyeTracking();
  initThreeCharacter();
  initScrollSpy();
  initCopyActions();
});

/* 1. Header scroll effect */
function initHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* 2. Mobile Drawer Navigation */
function initMobileDrawer() {
  const toggle = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  if (!toggle || !drawer) return;

  const toggleDrawer = () => {
    const isActive = drawer.classList.toggle('active');
    toggle.classList.toggle('active');
    toggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    document.body.style.overflow = isActive ? 'hidden' : '';
  };

  toggle.addEventListener('click', toggleDrawer);

  drawer.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('active');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* 3. Makima Framing Eye Tracking (Cursor & Mobile Touch) */
function initEyeTracking() {
  const avatarCard = document.getElementById('heroAvatarCard');
  const avatarImg = document.getElementById('avatarImg');
  if (!avatarCard || !avatarImg) return;

  const onMove = (e) => {
    const rect = avatarCard.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y = (clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    const clampX = Math.max(-1, Math.min(1, x));
    const clampY = Math.max(-1, Math.min(1, y));

    // Subtle 3D card tilt & inner gaze perspective
    avatarCard.style.transform = `perspective(800px) rotateY(${clampX * 6}deg) rotateX(${-clampY * 6}deg)`;
    avatarImg.style.transform = `scale(1.04) translate(${clampX * 4}px, ${clampY * 4}px)`;
  };

  const onLeave = () => {
    avatarCard.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
    avatarImg.style.transform = 'scale(1) translate(0px, 0px)';
  };

  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('mouseleave', onLeave);
}

/* 4. Three.js 3D Background Scene (Character + Orbit Dust) */
function initThreeCharacter() {
  const canvas = document.getElementById('webglCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.4, 5.8);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: !window.matchMedia('(max-width: 768px)').matches,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

  // Lighting
  const ambient = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
  dirLight.position.set(4, 8, 4);
  scene.add(dirLight);

  const violetLight = new THREE.PointLight(0xa855f7, 2.5, 10);
  violetLight.position.set(-3, 2, 2);
  scene.add(violetLight);

  // Floating Stardust Particles
  const dustCount = window.matchMedia('(max-width: 768px)').matches ? 40 : 90;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 12;
    dustPos[i * 3 + 1] = Math.random() * 6 - 1;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    size: 0.035,
    color: 0x8fd8ff,
    transparent: true,
    opacity: 0.45
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  // 3D Character Model Loader
  let mixer = null;
  let model = null;
  let actions = {};
  let currentAction = null;
  let headBone = null;

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const onCursor = (e) => {
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    mouse.tx = (cx / window.innerWidth) * 2 - 1;
    mouse.ty = -(cy / window.innerHeight) * 2 + 1;
  };
  window.addEventListener('mousemove', onCursor, { passive: true });
  window.addEventListener('touchmove', onCursor, { passive: true });

  if (typeof THREE.GLTFLoader !== 'undefined') {
    const loader = new THREE.GLTFLoader();
    loader.load('assets/models/character.glb', (gltf) => {
      model = gltf.scene;
      model.traverse(o => {
        if (o.isMesh && o.material) {
          o.material.metalness = 0.35;
          o.material.roughness = 0.55;
        }
        if (!headBone && o.isBone && o.name.toLowerCase().includes('head')) {
          headBone = o;
        }
      });

      const box = new THREE.Box3().setFromObject(model);
      const h = box.max.y - box.min.y;
      const s = 1.85 / (h || 1);
      model.scale.setScalar(s);
      model.position.set(1.4, 0.1, 0);

      // On mobile, position slightly centered/higher
      if (window.innerWidth < 800) {
        model.position.set(0, 0.4, -0.5);
        model.scale.setScalar(s * 0.85);
      }

      scene.add(model);

      if (gltf.animations && gltf.animations.length) {
        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach(clip => {
          actions[clip.name] = mixer.clipAction(clip);
        });

        // Default hero animation: Wave
        const wave = actions['Wave'] || actions[Object.keys(actions)[0]];
        if (wave) {
          wave.play();
          currentAction = wave;
        }
      }
    }, undefined, (err) => {
      console.log('Using ambient stardust mode:', err);
    });
  }

  // Section Animation Map
  window.switchCharacterSection = (secId) => {
    if (!mixer) return;
    const map = {
      hero: 'Wave',
      about: 'Idle',
      focus: 'Yes',
      apps: 'Dance',
      work: 'Walking',
      philosophy: 'Sitting',
      connect: 'Wave'
    };
    const targetName = map[secId] || 'Idle';
    const next = actions[targetName];
    if (next && next !== currentAction) {
      if (currentAction) currentAction.fadeOut(0.4);
      next.reset().fadeIn(0.4).play();
      currentAction = next;
    }
  };

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (model && window.innerWidth < 800) {
      model.position.set(0, 0.4, -0.5);
    } else if (model) {
      model.position.set(1.4, 0.1, 0);
    }
  }, { passive: true });

  // Animation Loop
  const clock = new THREE.Clock();
  const render = () => {
    requestAnimationFrame(render);
    const delta = clock.getDelta();

    if (mixer) mixer.update(delta);

    mouse.x += (mouse.tx - mouse.x) * 0.08;
    mouse.y += (mouse.ty - mouse.y) * 0.08;

    if (headBone) {
      headBone.rotation.y = mouse.x * 0.45;
      headBone.rotation.x = -mouse.y * 0.35;
    }

    if (dust) {
      dust.rotation.y += 0.0008;
      dust.rotation.x += 0.0004;
    }

    renderer.render(scene, camera);
  };
  render();
}

/* 5. ScrollSpy & Dynamic Section Triggers */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item');
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
        if (window.switchCharacterSection) {
          window.switchCharacterSection(id);
        }
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}

/* 6. One-Click Copy Actions & Toast Notice */
function initCopyActions() {
  const toast = document.getElementById('toastNotice');
  const copyBtns = document.querySelectorAll('[data-copy]');

  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  };

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const val = btn.getAttribute('data-copy');
      if (!val) return;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(val).then(() => {
          showToast('Copied to clipboard! 📋');
        }).catch(() => fallback(val));
      } else {
        fallback(val);
      }
    });
  });

  function fallback(text) {
    const input = document.createElement('textarea');
    input.value = text;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand('copy');
      showToast('Copied to clipboard! 📋');
    } catch (e) {
      showToast(`Copied: ${text}`);
    }
    document.body.removeChild(input);
  }
}
