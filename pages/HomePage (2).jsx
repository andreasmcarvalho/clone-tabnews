import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

/* ============================================================
   PARA GABRIELA
   1. Frases — uma por vez, no centro
   2. Espiral de flores — do centro pra fora
   3. Blackout total
   4. Página longa, revelando por scroll
   ============================================================ */

const PHRASES = [
  'Dear Gabriela,',
  'my life used to be kind of empty',
  "I'm not gonna lie",
  'but since you joined,',
  'my world became — how can I say —',
];

const FINAL_WORD = 'colorful';

const DEFAULT_TRACKS = [
  { id: 't1', title: 'Nossa primeira', note: 'a que tocou quando tudo começou', url: '' },
  { id: 't2', title: 'A do carro', note: 'volume alto, janela aberta', url: '' },
  { id: 't3', title: 'A que virou nossa', note: 'sem motivo, só virou', url: '' },
  { id: 't4', title: 'A da madrugada', note: 'duas da manhã, sem sono', url: '' },
];

const STORAGE_KEY = 'paraGabriela.v1';

const PETAL_PALETTE = [
  '#FFFFFF', '#FFF6FA', '#FFD9E8', '#F7B7D3',
  '#E9A6F0', '#C9B6F7', '#A8C8FF', '#FFE2A8',
  '#FFC1A8', '#B8F0D8',
];

const CENTER_PALETTE = ['#FFD86B', '#FFC247', '#FFE9A8', '#F7F0D8'];

function seededRandom(seed) {
  let currentSeed = seed % 2147483647;
  if (currentSeed <= 0) currentSeed += 2147483646;
  return () => {
    currentSeed = (currentSeed * 16807) % 2147483647;
    return (currentSeed - 1) / 2147483646;
  };
}

/* ---------- Persistência local ---------- */

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* modo privado ou storage cheio — segue sem salvar */
  }
}

/* ---------- Estilos globais ---------- */

const GLOBAL_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Inter:wght@200;300;400;500&display=swap');

html, body, #root { background: #000; }
body { margin: 0; font-family: 'Inter', system-ui, sans-serif; }

.font-display { font-family: 'Cormorant Garamond', Georgia, serif; }

.gradient-word {
  background: linear-gradient(100deg,#FFD9E8,#F7B7D3,#C9B6F7,#A8C8FF,#B8F0D8,#FFE2A8,#FFD9E8);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: hueShift 6s linear infinite;
}
@keyframes hueShift { to { background-position: 300% 0; } }

.field {
  width: 100%;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 2px;
  padding: .6rem .8rem;
  color: #fff;
  font-size: .875rem;
  outline: none;
  transition: border-color .3s;
}
.field:focus { border-color: rgba(255,255,255,.55); }
.field::placeholder { color: rgba(255,255,255,.32); }

.btn-solid {
  background: #fff; color: #000;
  padding: .5rem 1.1rem; border: none; border-radius: 2px;
  font-size: .75rem; letter-spacing: .12em; text-transform: uppercase;
  cursor: pointer; transition: opacity .3s;
}
.btn-solid:hover { opacity: .82; }

.btn-ghost {
  background: transparent;
  border: 1px solid rgba(255,255,255,.3);
  color: rgba(255,255,255,.7);
  padding: .5rem 1.1rem; border-radius: 2px;
  font-size: .75rem; letter-spacing: .12em; text-transform: uppercase;
  cursor: pointer; transition: all .3s;
}
.btn-ghost:hover { border-color: #fff; color: #fff; }

/* pixel art sem suavização */
.pixel-art {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

*:focus-visible { outline: 2px solid rgba(255,255,255,.8); outline-offset: 2px; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
`;

/* ---------- Flor SVG procedural ---------- */

function Flower({ size = 40, petalColor, centerColor, petalCount = 6, rotation = 0, opacity = 1 }) {
  const petals = [];
  const rx = size * 0.18;
  const ry = size * 0.37;
  const dist = size * 0.26;

  for (let i = 0; i < petalCount; i += 1) {
    petals.push(
      <ellipse
        key={i}
        cx="0"
        cy={-dist}
        rx={rx}
        ry={ry}
        fill={petalColor}
        transform={`rotate(${(360 / petalCount) * i})`}
        opacity="0.93"
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
      style={{ opacity, transform: `rotate(${rotation}deg)`, display: 'block' }}
    >
      {petals}
      <circle cx="0" cy="0" r={size * 0.13} fill={centerColor} />
      <circle cx="0" cy="0" r={size * 0.07} fill="rgba(0,0,0,0.12)" />
    </svg>
  );
}

function RoseOutline({ size = 46, color = 'rgba(255,255,255,0.5)', strokeWidth = 1.1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <g stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
        <path d="M50 38c-5 0-9 4-9 9s4 9 9 9 9-4 9-9" />
        <path d="M50 30c-9 0-16 7-16 16s7 17 16 17 17-7 17-17" />
        <path d="M50 22c-13 0-24 10-24 24s11 25 24 25 24-11 24-25" />
        <path d="M50 71v18" />
        <path d="M50 79c-7 0-12-4-14-9 7-1 12 2 14 9z" />
        <path d="M50 85c7 0 12-4 14-9-7-1-12 2-14 9z" />
      </g>
    </svg>
  );
}

/* ---------- Reveal por scroll ---------- */

function Reveal({ children, delay = 0, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 0.7, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   FASE 1 — Frases
   ============================================================ */

const PHRASE_HOLD = 2700;
const FINAL_HOLD = 2800;

function PhraseStage({ onDone }) {
  const [index, setIndex] = useState(0);
  const showFinal = index >= PHRASES.length;

  useEffect(() => {
    if (showFinal) {
      const timer = setTimeout(onDone, FINAL_HOLD);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setIndex((i) => i + 1), PHRASE_HOLD);
    return () => clearTimeout(timer);
  }, [index, showFinal, onDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black px-8">
      <div className="w-full max-w-3xl text-center">
        <AnimatePresence mode="wait">
          {!showFinal ? (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -18, filter: 'blur(10px)' }}
              transition={{ duration: 0.9, ease: [0.22, 0.7, 0.3, 1] }}
              className="font-display font-light text-white/90"
              style={{ fontSize: 'clamp(1.6rem, 5vw, 3.2rem)', lineHeight: 1.4 }}
            >
              {PHRASES[index]}
            </motion.p>
          ) : (
            <motion.p
              key="final"
              initial={{ opacity: 0, scale: 0.84, filter: 'blur(16px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, ease: [0.16, 0.9, 0.3, 1] }}
              className="gradient-word font-display font-semibold"
              style={{ fontSize: 'clamp(3rem, 13vw, 9rem)', lineHeight: 1 }}
            >
              {FINAL_WORD}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================
   FASE 2 — Espiral de Arquimedes + blackout
   ============================================================ */

const SPIRAL_STEP_MS = 9;
const HOLD_AFTER_SPIRAL = 700;
const BLACKOUT_MS = 1500;

function SpiralStage({ onDone }) {
  const [dims, setDims] = useState({ w: 1200, h: 800 });
  const [blackout, setBlackout] = useState(false);

  useEffect(() => {
    const update = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const { flowers, totalMs } = useMemo(() => {
    const rand = seededRandom(20260723);
    const cx = dims.w / 2;
    const cy = dims.h / 2;
    const maxR = Math.hypot(dims.w, dims.h) / 2 + 90;

    const turns = 5;
    const maxTheta = turns * Math.PI * 2;
    const a = maxR / maxTheta;
    const arcSpacing = 46;

    const out = [];
    let theta = 0.5;
    let count = 0;

    while (count < 900) {
      const r = a * theta;
      if (r > maxR) break;

      const progress = r / maxR;

      out.push({
        id: count,
        x: cx + Math.cos(theta) * r,
        y: cy + Math.sin(theta) * r,
        size: 34 + progress * 54 + rand() * 20,
        petalColor:
          rand() < 0.4
            ? PETAL_PALETTE[Math.floor(rand() * 2)]
            : PETAL_PALETTE[2 + Math.floor(rand() * (PETAL_PALETTE.length - 2))],
        centerColor: CENTER_PALETTE[Math.floor(rand() * CENTER_PALETTE.length)],
        petalCount: rand() < 0.3 ? 5 : rand() < 0.78 ? 6 : 8,
        rotation: (theta * 180) / Math.PI + rand() * 40,
        delay: (count * SPIRAL_STEP_MS) / 1000,
      });

      theta += arcSpacing / (a * theta);
      count += 1;
    }

    return { flowers: out, totalMs: count * SPIRAL_STEP_MS + 520 };
  }, [dims]);

  useEffect(() => {
    const blackTimer = setTimeout(() => setBlackout(true), totalMs + HOLD_AFTER_SPIRAL);
    const doneTimer = setTimeout(onDone, totalMs + HOLD_AFTER_SPIRAL + BLACKOUT_MS + 200);
    return () => {
      clearTimeout(blackTimer);
      clearTimeout(doneTimer);
    };
  }, [totalMs, onDone]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black">
      {flowers.map((flower) => (
        <motion.div
          key={flower.id}
          className="absolute"
          style={{
            left: flower.x,
            top: flower.y,
            marginLeft: -flower.size / 2,
            marginTop: -flower.size / 2,
          }}
          initial={{ opacity: 0, scale: 0, rotate: -120 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.52, delay: flower.delay, ease: [0.2, 0.85, 0.3, 1.1] }}
        >
          <Flower
            size={flower.size}
            petalColor={flower.petalColor}
            centerColor={flower.centerColor}
            petalCount={flower.petalCount}
            rotation={flower.rotation}
          />
        </motion.div>
      ))}

      <motion.div
        className="pointer-events-none absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: blackout ? 1 : 0 }}
        transition={{ duration: BLACKOUT_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  );
}

/* ---------- Flores ambiente ---------- */

function AmbientGarden({ density = 40 }) {
  const flowers = useMemo(() => {
    const rand = seededRandom(880123);
    return Array.from({ length: density }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      size: 14 + rand() * 30,
      petalColor:
        rand() < 0.55
          ? PETAL_PALETTE[Math.floor(rand() * 2)]
          : PETAL_PALETTE[2 + Math.floor(rand() * (PETAL_PALETTE.length - 2))],
      centerColor: CENTER_PALETTE[Math.floor(rand() * CENTER_PALETTE.length)],
      rotation: rand() * 360,
      duration: 9 + rand() * 11,
      delay: rand() * 8,
      opacity: 0.14 + rand() * 0.24,
    }));
  }, [density]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {flowers.map((flower) => (
        <motion.div
          key={flower.id}
          className="absolute"
          style={{ left: `${flower.left}%`, top: `${flower.top}%` }}
          animate={{ y: [0, -16, 0], rotate: [0, 7, 0] }}
          transition={{
            duration: flower.duration,
            delay: flower.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Flower
            size={flower.size}
            petalColor={flower.petalColor}
            centerColor={flower.centerColor}
            rotation={flower.rotation}
            opacity={flower.opacity}
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- Spotify ---------- */

function spotifyEmbedUrl(raw) {
  if (!raw) return null;
  const match = raw.trim().match(/track[/:]([A-Za-z0-9]{22})/);
  return match
    ? `https://open.spotify.com/embed/track/${match[1]}?utm_source=generator&theme=0`
    : null;
}

/* ---------- Cartão de música ---------- */

function TrackCard({ track, onChange, onRemove }) {
  const [editing, setEditing] = useState(!track.url);
  const [draft, setDraft] = useState(track);
  const embed = spotifyEmbedUrl(track.url);

  const handleSave = () => {
    onChange(draft);
    setEditing(false);
  };

  return (
    <motion.article
      className="group relative"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4, ease: [0.22, 0.7, 0.3, 1] }}
    >
      <div className="pointer-events-none absolute -left-4 -top-4 opacity-55 transition-opacity duration-500 group-hover:opacity-100">
        <RoseOutline size={44} />
      </div>
      <div className="pointer-events-none absolute -bottom-4 -right-4 rotate-180 opacity-55 transition-opacity duration-500 group-hover:opacity-100">
        <RoseOutline size={44} />
      </div>

      <div className="relative rounded-sm border border-white/25 bg-black/70 p-5 backdrop-blur-sm">
        {editing ? (
          <div className="space-y-3">
            <input
              className="field"
              placeholder="Nome da música"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
            <input
              className="field"
              placeholder="Uma lembrança curta"
              value={draft.note}
              onChange={(e) => setDraft({ ...draft, note: e.target.value })}
            />
            <input
              className="field"
              placeholder="Cole o link do Spotify"
              value={draft.url}
              onChange={(e) => setDraft({ ...draft, url: e.target.value })}
            />
            <div className="flex gap-2 pt-1">
              <button type="button" className="btn-solid" onClick={handleSave}>Salvar</button>
              <button type="button" className="btn-ghost" onClick={() => onRemove(track.id)}>Remover</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-display text-xl text-white">{track.title}</h3>
              {track.note && <p className="mt-1 text-sm italic text-white/55">{track.note}</p>}
            </div>

            {embed ? (
              <div className="overflow-hidden rounded-sm border border-white/15 grayscale-[0.85] transition-all duration-500 hover:grayscale-0">
                <iframe
                  title={track.title}
                  src={embed}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            ) : (
              <p className="rounded-sm border border-dashed border-white/25 px-3 py-4 text-center text-xs text-white/45">
                Cole um link de faixa do Spotify
              </p>
            )}

            <button type="button" className="btn-ghost" onClick={() => setEditing(true)}>Editar</button>
          </div>
        )}
      </div>
    </motion.article>
  );
}

/* ---------- Barra de progresso ---------- */

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed left-0 top-0 z-40 h-[2px] w-full origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg,#FFD9E8,#C9B6F7,#A8C8FF,#B8F0D8)',
      }}
    />
  );
}

/* ---------- Indicador de scroll ---------- */

function ScrollHint() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 60) setGone(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed bottom-8 left-1/2 z-20 -translate-x-1/2 text-center"
      animate={{ opacity: gone ? 0 : 1 }}
      transition={{ duration: 0.7 }}
    >
      <p className="mb-3 text-[0.65rem] uppercase tracking-[0.4em] text-white/35">desce</p>
      <motion.div
        className="mx-auto h-10 w-px origin-top bg-gradient-to-b from-white/50 to-transparent"
        animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}

/* ---------- Retrato pixel art ---------- */

function PixelPortrait() {
  return (
    <div className="relative flex flex-col items-center">
      {/* brilho suave por trás */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 'min(90vw, 620px)',
          height: 'min(90vw, 620px)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(247,183,211,0.13) 0%, rgba(201,182,247,0.08) 40%, transparent 70%)',
        }}
      />

      <motion.img
        src="/nos.png"
        alt="Nós dois e os gatos, em pixel art"
        className="pixel-art w-full max-w-md select-none"
        draggable="false"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

/* ============================================================
   Página longa
   ============================================================ */

function LongPage() {
  const saved = useMemo(() => loadState(), []);
  const [tracks, setTracks] = useState(saved?.tracks ?? DEFAULT_TRACKS);
  const [letter, setLetter] = useState(saved?.letter ?? '');
  const [letterEditing, setLetterEditing] = useState(false);

  useEffect(() => {
    saveState({ tracks, letter });
  }, [tracks, letter]);

  const updateTrack = useCallback((next) => {
    setTracks((prev) => prev.map((t) => (t.id === next.id ? next : t)));
  }, []);

  const removeTrack = useCallback((id) => {
    setTracks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addTrack = useCallback(() => {
    setTracks((prev) => [
      ...prev,
      { id: `t${Date.now()}`, title: 'Nova música', note: '', url: '' },
    ]);
  }, []);

  return (
    <div className="relative bg-black text-white">
      <ScrollProgress />
      <AmbientGarden density={40} />
      <ScrollHint />

      {/* Abertura */}
      <section className="relative flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <Reveal>
            <p className="text-[0.65rem] uppercase tracking-[0.5em] text-white/35">para</p>
          </Reveal>
          <Reveal delay={0.15}>
            <h1
              className="font-display mt-6 leading-[0.9]"
              style={{ fontSize: 'clamp(3.5rem, 15vw, 11rem)' }}
            >
              Gabriela
            </h1>
          </Reveal>
          <Reveal delay={0.32}>
            <div className="mx-auto mt-10 h-px w-20 bg-white/25" />
          </Reveal>
        </div>
      </section>

      {/* Respiro */}
      <section className="relative flex min-h-[70vh] items-center justify-center px-8">
        <Reveal>
          <p
            className="font-display max-w-2xl text-center text-white/80"
            style={{ fontSize: 'clamp(1.4rem, 4vw, 2.6rem)', lineHeight: 1.5 }}
          >
            Não vou escrever nada muito grande aqui.
            <br />
            Só juntei as coisas que me lembram você.
          </p>
        </Reveal>
      </section>

      {/* Músicas */}
      <section className="relative mx-auto max-w-5xl px-6 py-32">
        <Reveal>
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-white/35">as músicas</p>
          <h2 className="font-display mt-3" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>
            Cada uma tem um dia colado nela
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 sm:grid-cols-2">
          {tracks.map((track, i) => (
            <Reveal key={track.id} delay={(i % 2) * 0.12}>
              <TrackCard track={track} onChange={updateTrack} onRemove={removeTrack} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <button type="button" className="btn-ghost mt-12" onClick={addTrack}>
            Adicionar música
          </button>
        </Reveal>
      </section>

      {/* Separador */}
      <section className="relative flex items-center justify-center py-24">
        <Reveal>
          <div className="flex items-center gap-6 opacity-60">
            <Flower size={26} petalColor="#FFFFFF" centerColor="#FFD86B" />
            <Flower size={38} petalColor="#F7B7D3" centerColor="#FFE9A8" petalCount={8} />
            <Flower size={26} petalColor="#A8C8FF" centerColor="#FFC247" petalCount={5} />
          </div>
        </Reveal>
      </section>

      {/* Carta */}
      <section className="relative mx-auto max-w-3xl px-6 py-32">
        <Reveal>
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-white/35">o resto</p>
        </Reveal>
        <Reveal delay={0.12}>
          {letterEditing ? (
            <div className="mt-8 space-y-3">
              <textarea
                className="field font-display min-h-64 resize-y text-lg leading-relaxed"
                placeholder="Escreva aqui."
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
              />
              <button type="button" className="btn-solid" onClick={() => setLetterEditing(false)}>
                Salvar
              </button>
            </div>
          ) : (
            <div
              role="button"
              tabIndex={0}
              className="mt-8 cursor-text rounded-sm border border-white/15 bg-black/60 p-10 backdrop-blur-sm"
              onClick={() => setLetterEditing(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setLetterEditing(true);
              }}
            >
              {letter ? (
                <p className="font-display whitespace-pre-wrap text-xl leading-relaxed text-white/85">
                  {letter}
                </p>
              ) : (
                <p className="text-sm text-white/40">Clique para escrever.</p>
              )}
            </div>
          )}
        </Reveal>
      </section>

      {/* Nós */}
      <section className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-24">
        <Reveal>
          <p className="mb-14 text-center text-[0.65rem] uppercase tracking-[0.4em] text-white/35">
            nós
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <PixelPortrait />
        </Reveal>
      </section>

      {/* Fecho */}
      <section className="relative flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <Reveal>
            <div className="mx-auto mb-12 h-px w-16 bg-white/20" />
          </Reveal>
          <Reveal delay={0.15}>
            <p
              className="gradient-word font-display font-semibold"
              style={{ fontSize: 'clamp(2.5rem, 11vw, 7rem)', lineHeight: 1 }}
            >
              colorful
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

/* ---------- Página ---------- */

export default function HomePage() {
  const [stage, setStage] = useState('phrases');

  useEffect(() => {
    document.title = 'Para Gabriela';
  }, []);

  useEffect(() => {
    if (stage === 'page') {
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [stage]);

  const goSpiral = useCallback(() => setStage('spiral'), []);
  const goPage = useCallback(() => setStage('page'), []);

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <div className="bg-black">
        {stage === 'phrases' && <PhraseStage onDone={goSpiral} />}
        {stage === 'spiral' && <SpiralStage onDone={goPage} />}
        {stage === 'page' && <LongPage />}
      </div>
    </>
  );
}
