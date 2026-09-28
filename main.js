(() => {
  const TOTAL_FRAMES = 126;
  const WHATSAPP_NUMBER = '917879531920';

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const scrollTrack = document.getElementById('scroll-track');
  const storySections = document.querySelectorAll('.story-section');
  const navButtons = document.querySelectorAll('.nav-btn');
  const footerNavButtons = document.querySelectorAll('.footer-nav-btn');

  const chapterDots = document.querySelectorAll('.chapter-dot');

  // Preloading cache
  const images = new Array(TOTAL_FRAMES + 1);
  const loaded = new Array(TOTAL_FRAMES + 1).fill(false);

  let currentRenderedIndex = -1;
  let targetFrame = 1;
  let currentFrame = 1;
  let dpr = 1;
  let activeSectionId = 'hero';

  // Format frame path: frames/frame_000001.png
  function getFramePath(index) {
    const padded = String(index).padStart(6, '0');
    return `frames/frame_${padded}.webp`;
  }

  // Set canvas size for high-DPI displays
  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    currentRenderedIndex = -1; // Force redraw on resize
    render(Math.round(currentFrame));
  }

  // Draw image with 'cover' aspect ratio
  function drawCover(img) {
    if (!img) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    if (!iw || !ih) return;

    const scale = Math.max(cw / iw, ch / ih);
    const dw = Math.ceil(iw * scale);
    const dh = Math.ceil(ih * scale);
    const dx = Math.floor((cw - dw) * 0.5);
    const dy = Math.floor((ch - dh) * 0.5);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  // Get requested image or nearest available loaded frame
  function getBestAvailableFrame(index) {
    const clamped = Math.max(1, Math.min(TOTAL_FRAMES, index));
    if (loaded[clamped] && images[clamped]) {
      return images[clamped];
    }
    // Search outward for the closest loaded frame
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = clamped - offset;
      if (prev >= 1 && loaded[prev] && images[prev]) {
        return images[prev];
      }
      const next = clamped + offset;
      if (next <= TOTAL_FRAMES && loaded[next] && images[next]) {
        return images[next];
      }
    }
    return images[1] || null;
  }

  // Render a specific frame index
  function render(index) {
    if (index === currentRenderedIndex) return;
    const img = getBestAvailableFrame(index);
    if (img) {
      drawCover(img);
      currentRenderedIndex = index;
    }
  }

  // Calculate track progress (0.0 to 1.0)
  function getTrackProgress() {
    const trackHeight = scrollTrack.offsetHeight - window.innerHeight;
    if (trackHeight <= 0) return 0;
    const scrollY = window.scrollY;
    return Math.min(1, Math.max(0, scrollY / trackHeight));
  }

  // Update active story section and header nav state based on scroll progress
  function updateStorySections(progress) {
    let currentId = 'hero';

    storySections.forEach((sec) => {
      const range = sec.getAttribute('data-range').split(',').map(Number);
      const start = range[0];
      const end = range[1];

      // Soft buffer around section boundaries
      if (progress >= start && progress <= end) {
        sec.classList.add('active');
        currentId = sec.id.replace('section-', '');
      } else {
        sec.classList.remove('active');
      }
    });

    if (currentId !== activeSectionId) {
      activeSectionId = currentId;
      navButtons.forEach((btn) => {
        if (btn.getAttribute('data-target') === currentId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      chapterDots.forEach((dot) => {
        if (dot.getAttribute('data-target') === currentId) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  }

  // Update scroll target frame
  function onScroll() {
    const progress = getTrackProgress();
    targetFrame = 1 + progress * (TOTAL_FRAMES - 1);
    updateStorySections(progress);
  }

  // Animation loop with smooth lerping
  function loop() {
    const diff = targetFrame - currentFrame;
    if (Math.abs(diff) > 0.001) {
      currentFrame += diff * 0.22; // Responsive fluid lerp
    } else {
      currentFrame = targetFrame;
    }

    render(Math.round(currentFrame));
    requestAnimationFrame(loop);
  }

  // Load a single frame and decode asynchronously
  function loadSingleFrame(index) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = getFramePath(index);
      
      const onDone = () => {
        images[index] = img;
        loaded[index] = true;
        if (Math.round(currentFrame) === index || currentRenderedIndex === -1) {
          render(Math.round(currentFrame));
        }
        resolve(img);
      };

      if ('decode' in img) {
        img.decode().then(onDone).catch(onDone);
      } else {
        img.onload = onDone;
        img.onerror = onDone;
      }
    });
  }

  // Smart phased preloading:
  // 1. Frame 1 first (instant render)
  // 2. Coarse keyframe milestones every 10 frames
  // 3. Medium milestone frames (every 3 frames)
  // 4. All remaining frames
  async function preloadAllFrames() {
    // Phase 1: Frame 1 immediately
    await loadSingleFrame(1);
    render(Math.round(currentFrame));

    const queued = new Set();
    queued.add(1);

    const order = [];

    // Phase 2: Key milestones
    for (let i = 10; i <= TOTAL_FRAMES; i += 10) {
      if (!queued.has(i)) {
        order.push(i);
        queued.add(i);
      }
    }
    if (!queued.has(TOTAL_FRAMES)) {
      order.push(TOTAL_FRAMES);
      queued.add(TOTAL_FRAMES);
    }

    // Phase 3: Fine milestones
    for (let i = 1; i <= TOTAL_FRAMES; i += 3) {
      if (!queued.has(i)) {
        order.push(i);
        queued.add(i);
      }
    }

    // Phase 4: Remaining frames
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      if (!queued.has(i)) {
        order.push(i);
        queued.add(i);
      }
    }

    // Batch download with concurrency limit of 6
    const CONCURRENCY = 6;
    let idx = 0;

    async function worker() {
      while (idx < order.length) {
        const frameToLoad = order[idx++];
        await loadSingleFrame(frameToLoad);
      }
    }

    const workers = [];
    for (let w = 0; w < CONCURRENCY; w++) {
      workers.push(worker());
    }
    await Promise.all(workers);
  }

  // Navigation Click Handler: Scroll to corresponding section
  function scrollToSection(targetId) {
    const trackHeight = scrollTrack.offsetHeight - window.innerHeight;
    
    const targets = {
      hero: 0,
      pillars: trackHeight * 0.35,
      services: trackHeight * 0.59,
      portfolio: trackHeight * 0.79,
      inquiry: trackHeight * 0.94,
    };

    const targetY = targets[targetId] !== undefined ? targets[targetId] : 0;
    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
  }

  // Bind nav click listeners
  function initNavClicks() {
    document.querySelectorAll('[data-target]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.getAttribute('data-target');
        scrollToSection(target);
      });
    });

    // Brand logo click scrolls to top
    const brandLink = document.getElementById('brand-logo-link');
    if (brandLink) {
      brandLink.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToSection('hero');
      });
    }
  }

  // WhatsApp Inquiry Form Submission
  function initInquiryForm() {
    const form = document.getElementById('whatsapp-inquiry-form');
    const feedback = document.getElementById('form-feedback');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('client-name').value.trim();
      const phone = document.getElementById('client-phone').value.trim();
      const projectType = document.getElementById('project-type').value;
      const area = document.getElementById('plot-area').value.trim() || 'Not specified';
      const location = document.getElementById('project-location').value.trim() || 'Guna / Nearby';
      const message = document.getElementById('project-message').value.trim() || 'Looking for project estimation and consultation.';

      // Validation
      if (!name) {
        showFeedback('Please enter your full name.', 'error');
        document.getElementById('client-name').focus();
        return;
      }

      if (!phone || phone.length < 10) {
        showFeedback('Please enter a valid 10-digit mobile/WhatsApp number.', 'error');
        document.getElementById('client-phone').focus();
        return;
      }

      // Format WhatsApp Pre-filled message
      const text = 
`🏗️ *NEW INQUIRY - ARPIT CONSTRUCTION COMPANY*
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Client Name:* ${name}
📞 *Mobile / WhatsApp:* ${phone}
🏛️ *Project Category:* ${projectType}
📐 *Plot / Built-up Area:* ${area}
📍 *Project Location:* ${location}

📝 *Requirements & Scope:*
${message}
━━━━━━━━━━━━━━━━━━━━━━━━━
_Sent via arpitconstruction.com Inquiry Portal_`;

      const encodedText = encodeURIComponent(text);
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;

      showFeedback('Generating your WhatsApp inquiry... Opening WhatsApp!', 'success');

      // Open WhatsApp in new tab
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 300);
    });

    function showFeedback(msg, type) {
      if (!feedback) return;
      feedback.style.display = 'block';
      feedback.className = `form-feedback ${type}`;
      feedback.textContent = msg;

      if (type === 'success') {
        setTimeout(() => {
          feedback.style.display = 'none';
        }, 6000);
      }
    }
  }

  // Quick WhatsApp Buttons
  function initQuickWhatsAppButtons() {
    const message = encodeURIComponent("Hello Arpit Construction Company, I am interested in discussing a construction project with your team.");
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    const waNavBtn = document.getElementById('btn-quick-wa');
    if (waNavBtn) {
      waNavBtn.addEventListener('click', () => window.open(url, '_blank'));
    }

    const heroWaBtn = document.getElementById('hero-wa-btn');
    if (heroWaBtn) {
      heroWaBtn.addEventListener('click', () => window.open(url, '_blank'));
    }
  }

  // Wheel event listener for smooth scrolling support everywhere
  // High-performance scroll activity tracker for zero-lag compositor rendering
  let isScrollingTimeout = null;
  function handleScrollActivity() {
    if (!document.body.classList.contains('is-scrolling')) {
      document.body.classList.add('is-scrolling');
    }
    clearTimeout(isScrollingTimeout);
    isScrollingTimeout = setTimeout(() => {
      document.body.classList.remove('is-scrolling');
    }, 120);
  }

  window.addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey) return; // Allow pinch-zoom or Ctrl+Wheel zoom

      handleScrollActivity();

      // If wheel is over a scrollable floating card that has scrollable content, allow native card scroll
      const activePanel = document.querySelector('.story-section.active .lux-floating-card');
      if (activePanel && activePanel.contains(e.target)) {
        const canScrollUp = activePanel.scrollTop > 0 && e.deltaY < 0;
        const canScrollDown = activePanel.scrollTop + activePanel.clientHeight < activePanel.scrollHeight && e.deltaY > 0;
        if (canScrollUp || canScrollDown) {
          return; // Let the panel scroll internally
        }
      }

      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 33; // DOM_DELTA_LINE
      else if (e.deltaMode === 2) delta *= window.innerHeight; // DOM_DELTA_PAGE

      window.scrollBy({
        top: delta,
        left: 0,
        behavior: 'instant'
      });
      e.preventDefault();
    },
    { passive: false }
  );

  // 3D Reveal Intersection Observer for professional animations
  function init3DReveal() {
    const revealElements = document.querySelectorAll('.reveal-3d');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active'); // allow repeating animation when scrolling up/down
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px', // Trigger when element is slightly inside viewport
      threshold: 0.1
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // Initialize all subsystems
  window.addEventListener('resize', resizeCanvas, { passive: true });
  window.addEventListener('scroll', () => {
    onScroll();
    handleScrollActivity();
  }, { passive: true });

  resizeCanvas();
  onScroll();
  currentFrame = targetFrame; // Sync immediately
  render(Math.round(currentFrame));
  requestAnimationFrame(loop);
  
  preloadAllFrames();
  initNavClicks();
  initInquiryForm();
  initQuickWhatsAppButtons();
  init3DReveal();
})();
