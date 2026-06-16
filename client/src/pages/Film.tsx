/*
 * Film Player Page — A1 Homestead Hub
 * Design: Rugged Americana Craft
 * Cinematic player for the SVG prop-library film system.
 * Three named cuts: film (14 scenes), trailer (3), seeds (3).
 * All scene files served from /film/scenes/ (client/public/film/).
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'wouter';
import Navigation from '@/components/Navigation';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, Film as FilmIcon } from 'lucide-react';

// ── Scene manifest ────────────────────────────────────────────────
const CUTS = {
  film: [
    { file: '/film/scenes/BG-001-bg.html',    label: 'BG-001 — Dawn Pasture' },
    { file: '/film/scenes/BG-002-bg.html',    label: 'BG-002 — Tractor Rolls Through' },
    { file: '/film/scenes/BG-003-bg.html',    label: 'BG-003 — Cows Grazing Midday' },
    { file: '/film/scenes/BG-006-bg.html',    label: 'BG-006 — Spring Shower & Accordion Ripple' },
    { file: '/film/scenes/BG-004-bg.html',    label: 'BG-004 — Orchard Breeze' },
    { file: '/film/scenes/BG-009-bg.html',    label: 'BG-009 — Desert Crossing' },
    { file: '/film/scenes/BG-010-bg.html',    label: 'BG-010 — Jungle Canopy' },
    { file: '/film/scenes/BG-011-bg.html',    label: 'BG-011 — Jungle Falls' },
    { file: '/film/scenes/BG-005-bg.html',    label: 'BG-005 — Golden-Hour Flowers' },
    { file: '/film/scenes/BG-012-bg.html',    label: 'BG-012 — Valley of Kings' },
    { file: '/film/scenes/BG-013-bg.html',    label: 'BG-013 — Nativity Night' },
    { file: '/film/scenes/BG-014-bg.html',    label: 'BG-014 — Campfire Night' },
    { file: '/film/scenes/BG-007-bg.html',    label: 'BG-007 — Midnight' },
    { file: '/film/scenes/BG-008-bg.html',    label: 'BG-008 — Midnight Gold' },
  ],
  trailer: [
    { file: '/film/scenes/BG-trailer-001.html', label: 'Trailer 1 — Dawn Pasture / The Hook' },
    { file: '/film/scenes/BG-trailer-002.html', label: 'Trailer 2 — The Work' },
    { file: '/film/scenes/BG-trailer-003.html', label: 'Trailer 3 — The Garden' },
  ],
  seeds: [
    { file: '/film/scenes/BG-seeds-001.html', label: 'Seeds 1 — The Tomato' },
    { file: '/film/scenes/BG-seeds-002.html', label: 'Seeds 2 — The Jar' },
    { file: '/film/scenes/BG-seeds-003.html', label: 'Seeds 3 — The Drying' },
  ],
} as const;

type CutKey = keyof typeof CUTS;

const CUT_META: Record<CutKey, { label: string; desc: string }> = {
  film:    { label: 'The Film',    desc: 'A full day on the homestead — 14 scenes, dawn to midnight' },
  trailer: { label: 'Channel Trailer', desc: '"Why I Built A1 Homestead Hub" — 3 scenes' },
  seeds:   { label: 'Seed Tutorial',   desc: '"How to Save Heirloom Tomato Seeds" — 3 scenes' },
};

const CUT_DURATION = 8000;

export default function Film() {
  const [activeCut, setActiveCut] = useState<CutKey>('film');
  const [sceneIndex, setSceneIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hudVisible, setHudVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hudTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scenes = CUTS[activeCut];
  const currentScene = scenes[sceneIndex];

  const startProgress = useCallback(() => {
    setProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
    const startTime = Date.now();
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / CUT_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100 && progressRef.current) clearInterval(progressRef.current);
    }, 50);
  }, []);

  const advance = useCallback(() => {
    setSceneIndex(i => (i + 1) % CUTS[activeCut].length);
    startProgress();
  }, [activeCut, startProgress]);

  const goBack = useCallback(() => {
    setSceneIndex(i => (i - 1 + CUTS[activeCut].length) % CUTS[activeCut].length);
    startProgress();
  }, [activeCut, startProgress]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (playing) {
      timerRef.current = setInterval(advance, CUT_DURATION);
      startProgress();
    } else {
      if (progressRef.current) clearInterval(progressRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [playing, advance, startProgress]);

  const switchCut = useCallback((cut: CutKey) => {
    setActiveCut(cut);
    setSceneIndex(0);
    setPlaying(true);
    startProgress();
  }, [startProgress]);

  const showHud = useCallback(() => {
    setHudVisible(true);
    if (hudTimeoutRef.current) clearTimeout(hudTimeoutRef.current);
    hudTimeoutRef.current = setTimeout(() => setHudVisible(false), 3500);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ') { e.preventDefault(); setPlaying(p => !p); }
      if (e.key === 'ArrowRight') advance();
      if (e.key === 'ArrowLeft') goBack();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [advance, goBack]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--parchment, #F4EDE1)' }}>
      {/* Site navigation */}
      <Navigation />

      {/* Page header */}
      <div
        className="px-6 py-5 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--parchment-dark, #E9DEC9)', background: 'var(--parchment, #F4EDE1)' }}
      >
        <div className="flex items-center gap-3">
          <FilmIcon size={18} style={{ color: 'var(--earth-brown, #523823)' }} />
          <div>
            <h1
              className="text-xl font-bold leading-tight"
              style={{ fontFamily: "'Playfair Display', serif", color: 'var(--charcoal, #271E12)' }}
            >
              The Film
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--earth-brown, #6B4A2E)' }}>
              SVG cinematic scenes — built from the prop library
            </p>
          </div>
        </div>
        {/* Cut selector */}
        <div className="flex gap-2">
          {(Object.keys(CUT_META) as CutKey[]).map(cut => (
            <button
              key={cut}
              onClick={() => switchCut(cut)}
              className="px-3 py-1.5 rounded text-xs font-medium border transition-all"
              style={{
                fontFamily: "'Source Serif 4', serif",
                background: activeCut === cut ? 'var(--forest-green, #2D4A2D)' : 'transparent',
                color: activeCut === cut ? 'var(--warm-white, #F8F4EE)' : 'var(--earth-brown, #6B4A2E)',
                borderColor: activeCut === cut ? 'var(--forest-green, #2D4A2D)' : 'var(--parchment-dark, #C8B89A)',
              }}
            >
              {CUT_META[cut].label}
            </button>
          ))}
        </div>
      </div>

      {/* Film stage */}
      <div
        className="relative w-full"
        style={{ aspectRatio: '16/9', maxHeight: 'calc(100vh - 200px)', overflow: 'hidden' }}
        onMouseMove={showHud}
        onTouchStart={showHud}
      >
        {/* Scene iframe */}
        <iframe
          key={currentScene.file}
          src={currentScene.file}
          title={currentScene.label}
          className="absolute inset-0 w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
        />

        {/* Progress bar */}
        <div
          className="absolute bottom-0 left-0 h-0.5 z-20 pointer-events-none"
          style={{
            width: `${progress}%`,
            background: 'var(--amber, #D8A24A)',
            transition: 'none',
          }}
        />

        {/* HUD */}
        <div
          className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none"
          style={{ opacity: hudVisible ? 1 : 0, transition: 'opacity 0.4s' }}
        >
          {/* Bottom controls */}
          <div />
          <div
            className="flex items-end justify-between px-5 pb-4 pt-10 pointer-events-auto"
            style={{ background: 'linear-gradient(to top, rgba(39,30,18,0.6) 0%, transparent 100%)' }}
          >
            <div>
              <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(244,237,225,0.6)', fontFamily: "'DM Sans', sans-serif" }}>
                {CUT_META[activeCut].label} · Scene {sceneIndex + 1} of {scenes.length}
              </div>
              <div className="text-sm" style={{ color: 'rgba(244,237,225,0.85)', fontFamily: "'Source Serif 4', serif" }}>
                {currentScene.label}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={goBack}
                className="p-2 rounded border transition-colors"
                style={{ background: 'rgba(39,30,18,0.6)', borderColor: 'rgba(216,162,74,0.3)', color: 'rgba(230,190,126,0.8)' }}
              >
                <SkipBack size={13} />
              </button>
              <button
                onClick={() => setPlaying(p => !p)}
                className="p-2.5 rounded border transition-colors"
                style={{ background: 'rgba(216,162,74,0.2)', borderColor: 'rgba(216,162,74,0.5)', color: '#D8A24A' }}
              >
                {playing ? <Pause size={15} /> : <Play size={15} />}
              </button>
              <button
                onClick={advance}
                className="p-2 rounded border transition-colors"
                style={{ background: 'rgba(39,30,18,0.6)', borderColor: 'rgba(216,162,74,0.3)', color: 'rgba(230,190,126,0.8)' }}
              >
                <SkipForward size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Scene dot strip */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-8 z-10 flex gap-1.5 pointer-events-auto"
          style={{ opacity: hudVisible ? 1 : 0, transition: 'opacity 0.4s' }}
        >
          {scenes.map((s, i) => (
            <button
              key={s.file}
              onClick={() => { setSceneIndex(i); startProgress(); }}
              className="rounded-full transition-all"
              style={{
                width: i === sceneIndex ? '20px' : '6px',
                height: '6px',
                background: i === sceneIndex ? '#D8A24A' : 'rgba(244,237,225,0.4)',
              }}
              title={s.label}
            />
          ))}
        </div>
      </div>

      {/* Cut description strip */}
      <div
        className="px-6 py-4 border-t text-sm"
        style={{
          borderColor: 'var(--parchment-dark, #E9DEC9)',
          color: 'var(--earth-brown, #6B4A2E)',
          fontFamily: "'Source Serif 4', serif",
        }}
      >
        <span className="font-semibold" style={{ color: 'var(--charcoal, #271E12)' }}>
          {CUT_META[activeCut].label}
        </span>
        {' — '}
        {CUT_META[activeCut].desc}
        <span className="ml-4 text-xs" style={{ color: 'var(--muted-foreground, #8C6845)' }}>
          Space to pause · ← → to skip · Hover to show controls
        </span>
      </div>
    </div>
  );
}
