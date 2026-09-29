'use client';

import React, { useEffect, useRef, useState } from 'react';

// ============================================================================
// ARPIT CONSTRUCTION COMPANY — HIGH-END EDITORIAL ARCHITECTURAL EXPERIENCE
// Modern, Minimalist, Apple-esque Architecture Firm Experience
// Preserved: 126-Frame 3D Canvas Scroll Engine & Milestone Synchronization
// Redesigned: Alabaster Editorial System, Floating Glass Pill, Asymmetrical Flow
// ============================================================================

const TOTAL_FRAMES = 126;
const WHATSAPP_NUMBER = '917879531920';

interface SectionRange {
  id: string;
  name: string;
  index: string;
  start: number;
  end: number;
}

const SECTIONS: SectionRange[] = [
  { id: 'hero', name: 'Overview', index: '01', start: 0, end: 0.20 },
  { id: 'pillars', name: 'Philosophy', index: '02', start: 0.24, end: 0.46 },
  { id: 'services', name: 'Disciplines', index: '03', start: 0.49, end: 0.70 },
  { id: 'portfolio', name: 'Works', index: '04', start: 0.72, end: 0.86 },
  { id: 'inquiry', name: 'Consultation', index: '05', start: 0.88, end: 1.00 },
];

export default function ArchitecturalExperience() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollTrackRef = useRef<HTMLDivElement | null>(null);

  const [activeSection, setActiveSection] = useState<string>('hero');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: 'Luxury Residential Villa',
    area: '',
    location: '',
    message: '',
  });
  const [formFeedback, setFormFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Frame Cache & Animation State Refs
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES + 1).fill(null));
  const loadedRef = useRef<boolean[]>(new Array(TOTAL_FRAMES + 1).fill(false));
  const currentRenderedIndex = useRef<number>(-1);
  const currentFrame = useRef<number>(1);
  const targetFrame = useRef<number>(1);

  // --------------------------------------------------------------------------
  // 1. FRAME RENDERING & COVER PROPORTION LOGIC (PRESERVED)
  // --------------------------------------------------------------------------
  const getFramePath = (index: number) => {
    const padded = String(index).padStart(6, '0');
    return `/frames/frame_${padded}.webp`;
  };

  const drawCover = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement) => {
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
  };

  const getBestFrame = (index: number) => {
    const clamped = Math.max(1, Math.min(TOTAL_FRAMES, index));
    if (loadedRef.current[clamped] && imagesRef.current[clamped]) {
      return imagesRef.current[clamped];
    }
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = clamped - offset;
      if (prev >= 1 && loadedRef.current[prev] && imagesRef.current[prev]) {
        return imagesRef.current[prev];
      }
      const next = clamped + offset;
      if (next <= TOTAL_FRAMES && loadedRef.current[next] && imagesRef.current[next]) {
        return imagesRef.current[next];
      }
    }
    return imagesRef.current[1] || null;
  };

  const renderFrame = (index: number) => {
    if (!canvasRef.current || index === currentRenderedIndex.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const img = getBestFrame(index);
    if (img) {
      drawCover(ctx, canvas, img);
      currentRenderedIndex.current = index;
    }
  };

  // --------------------------------------------------------------------------
  // 2. SCROLL & ANIMATION HOOKS (PRESERVED)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    const track = scrollTrackRef.current;
    if (!canvas || !track) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      currentRenderedIndex.current = -1;
      renderFrame(Math.round(currentFrame.current));
    };

    const loadSingleFrame = (idx: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = getFramePath(idx);
        const onDone = () => {
          imagesRef.current[idx] = img;
          loadedRef.current[idx] = true;
          if (Math.round(currentFrame.current) === idx || currentRenderedIndex.current === -1) {
            renderFrame(Math.round(currentFrame.current));
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
    };

    const preloadFrames = async () => {
      await loadSingleFrame(1);
      renderFrame(1);

      const queued = new Set<number>([1]);
      const order: number[] = [];

      for (let i = 10; i <= TOTAL_FRAMES; i += 10) {
        if (!queued.has(i)) { order.push(i); queued.add(i); }
      }
      if (!queued.has(TOTAL_FRAMES)) { order.push(TOTAL_FRAMES); queued.add(TOTAL_FRAMES); }
      for (let i = 1; i <= TOTAL_FRAMES; i += 3) {
        if (!queued.has(i)) { order.push(i); queued.add(i); }
      }
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        if (!queued.has(i)) { order.push(i); queued.add(i); }
      }

      let pointer = 0;
      const worker = async () => {
        while (pointer < order.length) {
          const next = order[pointer++];
          await loadSingleFrame(next);
        }
      };
      await Promise.all([worker(), worker(), worker(), worker(), worker(), worker()]);
    };

    const onScroll = () => {
      const trackHeight = track.offsetHeight - window.innerHeight;
      if (trackHeight <= 0) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / trackHeight));

      targetFrame.current = 1 + progress * (TOTAL_FRAMES - 1);

      // Synchronize active section triggers
      for (const sec of SECTIONS) {
        if (progress >= sec.start && progress <= sec.end) {
          setActiveSection(sec.id);
          break;
        }
      }
    };

    let animationFrameId: number;
    const loop = () => {
      const diff = targetFrame.current - currentFrame.current;
      if (Math.abs(diff) > 0.001) {
        currentFrame.current += diff * 0.22;
      } else {
        currentFrame.current = targetFrame.current;
      }
      renderFrame(Math.round(currentFrame.current));
      animationFrameId = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    preloadFrames();
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Smooth Scroll Trigger to Target Milestone
  const scrollToTarget = (targetId: string) => {
    if (!scrollTrackRef.current) return;
    const trackHeight = scrollTrackRef.current.offsetHeight - window.innerHeight;
    const targets: Record<string, number> = {
      hero: 0,
      pillars: trackHeight * 0.35,
      services: trackHeight * 0.59,
      portfolio: trackHeight * 0.79,
      inquiry: trackHeight * 0.94,
    };
    window.scrollTo({
      top: targets[targetId] ?? 0,
      behavior: 'smooth',
    });
  };

  // WhatsApp Form Submission Handler
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormFeedback({ text: 'Please enter your full name.', type: 'error' });
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setFormFeedback({ text: 'Please enter a valid 10-digit WhatsApp number.', type: 'error' });
      return;
    }

    const message = `🏗️ *NEW INQUIRY - ARPIT CONSTRUCTION COMPANY*
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Client Name:* ${formData.name}
📞 *Mobile / WhatsApp:* ${formData.phone}
🏛️ *Project Category:* ${formData.type}
📐 *Plot / Built-up Area:* ${formData.area || 'Not specified'}
📍 *Project Location:* ${formData.location || 'Guna / Nearby'}

📝 *Requirements & Scope:*
${formData.message || 'Looking for project estimation and architectural consultation.'}
━━━━━━━━━━━━━━━━━━━━━━━━━
_Dispatched via arpitconstruction.com Editorial Suite_`;

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    setFormFeedback({ text: 'Generating your official project brief... Opening WhatsApp!', type: 'success' });

    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 300);
  };

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] text-[#111111] font-sans antialiased selection:bg-[#B38F48] selection:text-white">
      
      {/* ======================================================================
          1. NAVIGATION: SLEEK FLOATING GLASSMORPHIC PILL + SEPARATED CTA
          ====================================================================== */}
      <header className="fixed top-4 md:top-6 left-0 w-full z-50 px-4 md:px-8 pointer-events-none transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Frosted Glass Pill */}
          <div className="pointer-events-auto flex items-center gap-4 py-2 px-3 md:px-5 bg-white/85 backdrop-blur-xl border border-black/[0.08] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_14px_36px_rgba(0,0,0,0.09)]">
            <button 
              onClick={() => scrollToTarget('hero')}
              className="flex items-center gap-3 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden border border-[#B38F48] flex-shrink-0">
                <img src="/assets/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-sm tracking-wider text-[#111111] leading-none">ARPIT CONSTRUCTION</span>
                <span className="text-[10px] tracking-widest text-[#B38F48] font-semibold uppercase mt-0.5">COMPANY • GUNA</span>
              </div>
            </button>

            <div className="hidden md:block w-px h-5 bg-black/10 mx-1" aria-hidden="true" />

            <nav className="hidden md:flex items-center gap-1">
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToTarget(sec.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeSection === sec.id
                      ? 'bg-[#111111] text-white shadow-sm font-semibold'
                      : 'text-[#64646C] hover:text-[#111111] hover:bg-black/[0.04]'
                  }`}
                >
                  {sec.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Visually Separated High-Contrast Tactile Actions */}
          <div className="pointer-events-auto flex items-center gap-2.5">
            <a
              href="tel:7879531920"
              className="hidden sm:flex items-center gap-2 py-2 px-4 bg-white/85 backdrop-blur-xl border border-black/[0.08] rounded-full text-xs font-semibold text-[#111111] shadow-sm hover:bg-white hover:border-[#B38F48] transition-all"
            >
              <svg className="w-3.5 h-3.5 text-[#B38F48]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>7879531920</span>
            </a>

            <button
              onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
              className="flex items-center gap-2 py-2 px-5 bg-[#111111] text-white text-xs font-semibold rounded-full shadow-md hover:bg-[#25D366] hover:shadow-[0_6px_20px_rgba(37,211,102,0.35)] transition-all duration-300"
            >
              <svg className="w-3.5 h-3.5 text-[#25D366] group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.163 8.163 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.31 3.8.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1 1.6-.1 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/>
              </svg>
              <span>WhatsApp Us</span>
            </button>
          </div>

        </div>
      </header>

      {/* ======================================================================
          2. RIGHT-HAND HUD CHAPTER INDICATORS
          ====================================================================== */}
      <aside className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-4">
        {SECTIONS.map((sec) => (
          <button
            key={sec.id}
            onClick={() => scrollToTarget(sec.id)}
            className="group flex items-center justify-end gap-3 text-right focus:outline-none"
          >
            <span className="hidden group-hover:block px-3 py-1 bg-white/90 backdrop-blur-md border border-black/[0.08] text-xs font-semibold text-[#111111] rounded-full shadow-sm">
              {sec.name}
            </span>
            <span className={`font-serif text-xs font-bold tracking-wider transition-colors ${
              activeSection === sec.id ? 'text-[#111111] text-sm' : 'text-[#8E8E93] group-hover:text-[#111111]'
            }`}>
              {sec.index}
            </span>
          </button>
        ))}
      </aside>

      {/* ======================================================================
          3. SCROLL TRACK & 3D CANVAS VIEWPORT (UNHINDERED DAYLIGHT VILLA)
          ====================================================================== */}
      <main ref={scrollTrackRef} className="relative w-full h-[520vh]">
        <div className="sticky top-0 left-0 w-screen h-screen overflow-hidden bg-[#FAF9F6]">
          {/* Canvas Rendering 126 Cinematic Frames */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-10" />

          {/* Airy Radial Vignette for Editorial Contrast (No Muddy Overlays) */}
          <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(250,249,246,0.15)_0%,rgba(250,249,246,0.5)_100%)]" />

          {/* Scrolly Container Layer */}
          <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center p-6 md:p-12">

            {/* ----------------------------------------------------------------
                SECTION 1: HERO (0% - 20%) — MASSIVE BOLD EDITORIAL TYPOGRAPHY
                ---------------------------------------------------------------- */}
            <div className={`absolute inset-0 flex items-center justify-center p-6 transition-all duration-700 ${
              activeSection === 'hero' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
            }`}>
              <div className="max-w-4xl w-full text-center flex flex-col items-center pt-16">
                
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/85 backdrop-blur-md border border-black/[0.08] rounded-full shadow-sm mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B38F48]" />
                  <span className="text-[11px] font-bold tracking-[0.25em] text-[#111111] uppercase">ARCHITECTURAL EXCELLENCE • EST. 2011 • GUNA</span>
                </div>

                <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#111111] leading-[1.05] mb-6">
                  <span className="block">Engineered With</span>
                  <span className="block italic font-normal text-[#1A1A1E]">Precision.</span>
                  <span className="block text-[#B38F48]">Anchored In Trust.</span>
                </h1>

                <p className="text-base sm:text-lg text-[#2C2C30] max-w-xl mx-auto leading-relaxed mb-8">
                  Arpit Construction Company crafts landmark private residences, bespoke villas, and commercial complexes across Madhya Pradesh — defined by seismic structural engineering, material purity, and generational permanence.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
                  <button
                    onClick={() => scrollToTarget('inquiry')}
                    className="flex items-center gap-3.5 pl-6 pr-2 py-2 bg-[#111111] text-white rounded-full font-semibold text-sm shadow-lg hover:bg-black hover:scale-[1.02] transition-all"
                  >
                    <span>Commission Your Project</span>
                    <div className="w-9 h-9 rounded-full bg-[#B38F48] flex items-center justify-center text-white">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </button>

                  <button
                    onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
                    className="flex items-center gap-2.5 px-6 py-3 bg-white/85 backdrop-blur-md border border-black/[0.08] rounded-full font-semibold text-sm text-[#111111] shadow-sm hover:bg-white hover:border-[#B38F48] transition-all"
                  >
                    <svg className="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.163 8.163 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.31 3.8.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1 1.6-.1 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/>
                    </svg>
                    <span>Direct WhatsApp</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 px-6 py-4 bg-white/85 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-sm">
                  <div>
                    <span className="block font-serif font-bold text-2xl text-[#111111]">15+</span>
                    <span className="text-[10px] tracking-wider uppercase text-[#64646C]">Years Legacy</span>
                  </div>
                  <div>
                    <span className="block font-serif font-bold text-2xl text-[#111111]">250+</span>
                    <span className="text-[10px] tracking-wider uppercase text-[#64646C]">Built Estates</span>
                  </div>
                  <div>
                    <span className="block font-serif font-bold text-2xl text-[#111111]">M30</span>
                    <span className="text-[10px] tracking-wider uppercase text-[#64646C]">Seismic Grade</span>
                  </div>
                  <div>
                    <span className="block font-serif font-bold text-2xl text-[#111111]">100%</span>
                    <span className="text-[10px] tracking-wider uppercase text-[#64646C]">On-Time Sanctions</span>
                  </div>
                </div>

              </div>
            </div>

            {/* ----------------------------------------------------------------
                SECTION 2: PILLARS (24% - 46%) — ASYMMETRICAL VERTICAL FLOW (NO 2x2 GRID!)
                ---------------------------------------------------------------- */}
            <div className={`absolute inset-0 flex items-center justify-center p-6 md:p-12 transition-all duration-700 ${
              activeSection === 'pillars' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
            }`}>
              <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-8 lg:gap-14 items-start">
                
                {/* Left Anchored Editorial Narrative */}
                <div className="bg-white/90 backdrop-blur-2xl border border-black/[0.08] p-8 md:p-10 rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#8C6D3B] uppercase mb-4">
                    <span className="text-[#B38F48] font-serif text-sm">02</span>
                    <span>/</span>
                    <span>CORE PHILOSOPHY</span>
                  </div>
                  
                  <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111] leading-tight mb-5">
                    The Principles of <br/><span className="italic font-normal text-[#B38F48]">Permanent</span> Architecture.
                  </h2>

                  <p className="text-sm md:text-base text-[#64646C] leading-relaxed mb-6">
                    We reject compromises in civil integrity, material provenance, and spatial clarity. Every column poured and foundation anchored represents our scientific dedication to generational permanence.
                  </p>

                  <div className="border-t border-black/10 pt-5">
                    <div className="w-8 h-0.5 bg-[#B38F48] mb-3" />
                    <p className="font-serif text-xs font-semibold tracking-wider text-[#111111]">
                      "WE BUILD MORE THAN STRUCTURES. WE BUILD TRUST."
                    </p>
                  </div>
                </div>

                {/* Right Asymmetrical Flow (NO BOXES, NO BORDERS, PURE BREATHABLE TYPOGRAPHY) */}
                <div className="flex flex-col gap-4">
                  {[
                    {
                      num: '01',
                      title: 'Seismic Structural Purity',
                      desc: 'Certified M25/M30 concrete with Fe-550D primary TMT reinforcement, advanced seismic damping ratios, and certified geological soil profiling for lifetime safety.',
                    },
                    {
                      num: '02',
                      title: 'Spatial & Light Harmony',
                      desc: 'Double-height volumes, panoramic acoustic glass, and climate-responsive thermal envelopes harmonized with contemporary living and Vaastu geometry.',
                    },
                    {
                      num: '03',
                      title: 'Milestone-Gated Precision',
                      desc: 'Disciplined stage-by-stage execution with digital video and photographic progress logs delivered to clients—eliminating project delays or surprise expenditures.',
                    },
                    {
                      num: '04',
                      title: 'Turnkey Master Craftsmanship',
                      desc: 'Comprehensive end-to-end execution: municipal approvals, deep structural casting, concealed MEP wiring, through to book-matched Italian marble polishing.',
                    },
                  ].map((pillar) => (
                    <div 
                      key={pillar.num}
                      className="group grid grid-cols-[60px_1fr] sm:grid-cols-[70px_1fr] gap-5 p-6 bg-white/85 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-sm hover:bg-white hover:border-[#B38F48]/40 hover:shadow-md hover:translate-x-2 transition-all duration-300"
                    >
                      <span className="font-serif text-3xl sm:text-4xl font-light text-[#B38F48] leading-none">
                        {pillar.num}
                      </span>
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#111111] mb-1.5">
                          {pillar.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#64646C] leading-relaxed">
                          {pillar.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* ----------------------------------------------------------------
                SECTION 3: SERVICES (49% - 70%) — TYPOGRAPHIC DISCIPLINES
                ---------------------------------------------------------------- */}
            <div className={`absolute inset-0 flex items-center justify-center p-6 md:p-12 transition-all duration-700 ${
              activeSection === 'services' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
            }`}>
              <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-8 lg:gap-14 items-start">
                
                <div className="bg-white/90 backdrop-blur-2xl border border-black/[0.08] p-8 md:p-10 rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#8C6D3B] uppercase mb-4">
                    <span className="text-[#B38F48] font-serif text-sm">03</span>
                    <span>/</span>
                    <span>DISCIPLINES</span>
                  </div>
                  
                  <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111] leading-tight mb-5">
                    End-to-End <br/><span className="italic font-normal text-[#B38F48]">Turnkey</span> Solutions.
                  </h2>

                  <p className="text-sm md:text-base text-[#64646C] leading-relaxed mb-6">
                    From Greenfield land surveying and structural blueprint engineering to bespoke interior millwork, our multidisciplinary team coordinates every phase of execution.
                  </p>

                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#B38F48]/10 rounded-full text-xs font-semibold text-[#8C6D3B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B38F48]" />
                    <span>Direct Site Supervision by Senior Civil Engineers</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {[
                    {
                      idx: '01',
                      name: 'Luxury Residential Villas',
                      desc: 'Custom multi-level modern duplexes, contemporary farmhouses, and private gated residences tailored to your lifestyle and architectural aspirations.',
                      tags: ['Turnkey Civil', 'Cantilevered Spans', 'Vaastu Compliant'],
                    },
                    {
                      idx: '02',
                      name: 'Commercial Hubs & Showrooms',
                      desc: 'Multi-story shopping complexes, high-load retail showrooms, and corporate headquarters engineered for heavy footfall and iconic roadside presence.',
                      tags: ['Heavy Column Spacing', 'Curtain Walls', 'Fire Safety'],
                    },
                    {
                      idx: '03',
                      name: 'Architectural 3D BIM & Elevations',
                      desc: 'Photorealistic spatial walkthroughs, comprehensive structural engineering blueprints, load calculations, and municipal sanction documentation.',
                      tags: ['3D Walkthrough', 'Structural CAD', 'Government Sanctions'],
                    },
                    {
                      idx: '04',
                      name: 'Interiors & Structural Restoration',
                      desc: 'Imported Italian marble flooring, bespoke acoustic woodwork, architectural lighting layouts, and complete structural modernizations.',
                      tags: ['Italian Marble', 'False Ceilings', 'Acoustic Joinery'],
                    },
                  ].map((service) => (
                    <div 
                      key={service.idx}
                      className="group p-6 bg-white/85 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-sm hover:bg-white hover:border-[#B38F48]/40 hover:shadow-md hover:translate-x-2 transition-all duration-300"
                    >
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="font-serif font-bold text-sm text-[#B38F48]">{service.idx}</span>
                        <h3 className="font-serif text-lg font-bold text-[#111111]">{service.name}</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-[#64646C] leading-relaxed mb-3">{service.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {service.tags.map((tag) => (
                          <span key={tag} className="px-2.5 py-0.5 bg-black/[0.04] border border-black/[0.05] rounded-full text-[11px] font-medium text-[#64646C]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* ----------------------------------------------------------------
                SECTION 4: PORTFOLIO (72% - 86%) — SELECTED WORKS
                ---------------------------------------------------------------- */}
            <div className={`absolute inset-0 flex items-center justify-center p-6 md:p-12 transition-all duration-700 ${
              activeSection === 'portfolio' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
            }`}>
              <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-8 lg:gap-14 items-start">
                
                <div className="bg-white/90 backdrop-blur-2xl border border-black/[0.08] p-8 md:p-10 rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#8C6D3B] uppercase mb-4">
                    <span className="text-[#B38F48] font-serif text-sm">04</span>
                    <span>/</span>
                    <span>SELECTED WORKS</span>
                  </div>
                  
                  <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111] leading-tight mb-5">
                    Landmarks of <br/><span className="italic font-normal text-[#B38F48]">Distinction</span> Across MP.
                  </h2>

                  <p className="text-sm md:text-base text-[#64646C] leading-relaxed mb-6">
                    Every structure we build is a permanent testament to architectural innovation, precision civil execution, and client trust in Guna and Central India.
                  </p>

                  <div className="flex items-center gap-3 border-t border-black/10 pt-5">
                    <span className="font-serif font-bold text-2xl text-[#B38F48]">100%</span>
                    <span className="text-xs font-medium text-[#64646C]">Structural Warranty on Reinforced Concrete Framing</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {[
                    {
                      tag: 'LUXURY RESIDENCE',
                      scale: '4,800 Sq.Ft • Cantt Road, Guna',
                      title: 'The Glass Horizon Villa',
                      desc: 'Two-story contemporary private residence with double-height panoramic glass facade, integrated light court, and custom climate-responsive louvers.',
                    },
                    {
                      tag: 'COMMERCIAL TOWER',
                      scale: '12,000 Sq.Ft • A.B. Road, Guna',
                      title: 'Arpit Central Commercial Complex',
                      desc: 'Four-story flagship commercial development featuring post-tensioned wide span slab framing, thermal reflective glass facade, and high-speed elevator wells.',
                    },
                    {
                      tag: 'PREMIUM DUPLEX',
                      scale: '3,200 Sq.Ft • Shubham Colony, Guna',
                      title: 'The Royal Orchid Residences',
                      desc: 'Harmonious fusion of natural Burmese teak cladding, cantilevered private balconies, and book-matched imported Statuario marble flooring.',
                    },
                  ].map((work) => (
                    <article 
                      key={work.title}
                      className="group p-6 bg-white/85 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-sm hover:bg-white hover:border-[#B38F48]/40 hover:shadow-md hover:translate-x-2 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 bg-[#B38F48]/10 rounded-full text-[10px] font-bold tracking-wider text-[#8C6D3B]">
                          {work.tag}
                        </span>
                        <span className="text-xs text-[#8E8E93] font-medium">{work.scale}</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-[#111111] mb-1.5">{work.title}</h3>
                      <p className="text-xs sm:text-sm text-[#64646C] leading-relaxed">{work.desc}</p>
                    </article>
                  ))}
                </div>

              </div>
            </div>

            {/* ----------------------------------------------------------------
                SECTION 5: INQUIRY (88% - 100%) — ALABASTER CONSULTATION SUITE
                ---------------------------------------------------------------- */}
            <div className={`absolute inset-0 flex items-center justify-center p-6 md:p-12 transition-all duration-700 ${
              activeSection === 'inquiry' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
            }`}>
              <div className="max-w-2xl w-full bg-[#FDFDFA]/95 backdrop-blur-2xl border border-black/[0.08] p-8 md:p-12 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
                
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#8C6D3B] uppercase mb-2">
                    <span className="text-[#B38F48] font-serif text-sm">05</span>
                    <span>/</span>
                    <span>COMMISSION & CONSULTATION</span>
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#111111] mb-2">
                    Ready To Build Your Landmark?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64646C]">
                    Submit your parameters below. Our system will generate a verified project brief routed directly to our Principal Engineer on WhatsApp (<strong className="text-[#111111]">+91 7879531920</strong>).
                  </p>
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2.5 bg-white border border-black/10 rounded-xl text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-black/10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                        WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 7879531920"
                        className="w-full px-3.5 py-2.5 bg-white border border-black/10 rounded-xl text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-black/10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                        Project Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-black/10 rounded-xl text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-black/10"
                      >
                        <option value="Luxury Residential Villa">Luxury Residential Villa Construction</option>
                        <option value="Commercial Complex / Showroom">Commercial Complex / Showroom</option>
                        <option value="Architectural 3D Elevation & Planning">Architectural 3D Elevation & Planning</option>
                        <option value="Complete Home Renovation & Interiors">Complete Home Renovation & Interiors</option>
                        <option value="Structural Engineering Consultation">Structural Engineering Consultation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                        Plot / Built-up Size
                      </label>
                      <input
                        type="text"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        placeholder="e.g. 2,400 Sq.Ft / 30x50 plot"
                        className="w-full px-3.5 py-2.5 bg-white border border-black/10 rounded-xl text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-black/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                      Location in Guna / Madhya Pradesh
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Cantt Road, Guna / Nearby"
                      className="w-full px-3.5 py-2.5 bg-white border border-black/10 rounded-xl text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                      Project Notes / Scope Requirements
                    </label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your vision, timeline, preferred materials, or special architectural requirements..."
                      className="w-full px-3.5 py-2.5 bg-white border border-black/10 rounded-xl text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 bg-[#111111] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-3 shadow-md hover:bg-[#25D366] hover:shadow-[0_8px_24px_rgba(37,211,102,0.35)] transition-all duration-300"
                  >
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.163 8.163 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.31 3.8.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1 1.6-.1 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/>
                    </svg>
                    <span>Dispatch Project Brief Via WhatsApp</span>
                  </button>

                  {formFeedback && (
                    <div className={`p-3 rounded-xl text-center text-xs font-semibold ${
                      formFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {formFeedback.text}
                    </div>
                  )}
                </form>

                <div className="mt-6 pt-5 border-t border-black/10 flex items-center justify-between text-xs text-[#64646C]">
                  <span>Direct Senior Structural Engineer line:</span>
                  <a href="tel:7879531920" className="font-bold text-[#111111] hover:text-[#B38F48] transition-colors">
                    +91 7879531920
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ======================================================================
          4. SIGNATURE DEVELOPMENTS (HORIZONTAL GALLERY)
          ====================================================================== */}
      <section className="relative z-10 bg-[#FAF9F6] py-24 px-6 border-t border-black/[0.08]">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#8C6D3B] uppercase mb-2">
            <span className="text-[#B38F48] font-serif text-sm">06</span>
            <span>/</span>
            <span>INTERIOR MASTERPIECES</span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#111111] mb-3">
            Signature Craftsmanship
          </h2>
          <p className="text-sm md:text-base text-[#64646C] max-w-xl mx-auto">
            A visual portfolio of custom millwork, Italian marble execution, and double-height architectural volumes designed for discerning clients.
          </p>
        </div>

        <div className="flex gap-8 overflow-x-auto px-8 py-4 snap-x snap-mandatory scrollbar-none">
          {['project1.jpg', 'project2.jpg', 'project3.jpg', 'project4.jpg', 'project5.jpg'].map((img, i) => (
            <div key={img} className="flex-shrink-0 snap-center rounded-2xl overflow-hidden shadow-lg border border-black/10 hover:scale-[1.02] transition-transform duration-300">
              <img src={`/assets/${img}`} alt={`Signature Project ${i + 1}`} className="max-h-[60vh] max-w-[75vw] w-auto h-auto object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================================
          5. CERTIFICATE OF ACCREDITATION
          ====================================================================== */}
      <section className="relative z-10 bg-[#FAF9F6] py-20 px-6 border-t border-black/[0.08]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#8C6D3B] uppercase mb-2">
            <span className="text-[#B38F48] font-serif text-sm">07</span>
            <span>/</span>
            <span>ACCREDITATION</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#111111] mb-8">
            Certified Engineering Mastery
          </h2>
          <div className="max-w-2xl mx-auto p-2 bg-white rounded-2xl border border-black/10 shadow-xl hover:scale-[1.01] transition-transform">
            <img src="/assets/certificate.jpg" alt="Certificate of Completion" className="w-full h-auto rounded-xl" />
          </div>
        </div>
      </section>

      {/* ======================================================================
          6. FOOTER: ARCHITECTURAL EDITORIAL FINALE
          ====================================================================== */}
      <footer className="relative z-10 bg-white border-t border-black/[0.08] py-20 px-6 md:px-12 text-[#2C2C30]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-black/[0.08]">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#B38F48]">
                <img src="/assets/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#111111]">ARPIT CONSTRUCTION</h3>
                <span className="text-[10px] tracking-wider text-[#B38F48] font-semibold">COMPANY • GUNA (M.P.)</span>
              </div>
            </div>
            <p className="font-serif italic text-xs font-medium text-[#111111] border-l-2 border-[#B38F48] pl-3 py-0.5">
              "WE BUILD MORE THAN STRUCTURES. WE BUILD TRUST."
            </p>
            <p className="text-xs text-[#64646C] leading-relaxed">
              Setting the benchmark for architectural distinction, seismic structural engineering, and opulent residential & commercial spaces across Madhya Pradesh.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-bold text-sm text-[#111111] mb-4 tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs text-[#64646C]">
              {SECTIONS.map((sec) => (
                <li key={sec.id}>
                  <button onClick={() => scrollToTarget(sec.id)} className="hover:text-[#111111] transition-colors">
                    {sec.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-sm text-[#111111] mb-4 tracking-wider">Civil Disciplines</h4>
            <ul className="space-y-2 text-xs text-[#64646C]">
              <li>Turnkey Luxury Villas & Duplexes</li>
              <li>Commercial Plazas & Corporate Hubs</li>
              <li>3D Architectural Elevation & CAD</li>
              <li>Seismic RCC Column Framing</li>
              <li>Imported Italian Marble & Ceilings</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#111111] mb-4 tracking-wider">Headquarters</h4>
            <p className="text-xs text-[#64646C]">Guna, Madhya Pradesh, India</p>
            <p className="text-xs">
              <a href="tel:7879531920" className="font-bold text-[#111111] hover:text-[#B38F48]">
                +91 7879531920
              </a>
            </p>
            <button
              onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
              className="inline-block mt-2 px-5 py-2 bg-[#111111] text-white text-xs font-semibold rounded-full hover:bg-[#25D366] transition-colors"
            >
              Direct WhatsApp Chat
            </button>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E8E93]">
          <p>© 2026 Arpit Construction Company. All Rights Reserved.</p>
          <p className="font-serif tracking-widest text-[10px] uppercase">Engineered With Precision. Anchored In Trust.</p>
        </div>
      </footer>

      {/* Floating Quick WhatsApp Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.163 8.163 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.31 3.8.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1 1.6-.1 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/>
          </svg>
        </a>
      </div>

    </div>
  );
}
