import { useState, useEffect, useRef } from "react";

/* ─── CSS ─────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Quicksand:wght@400;500;600;700&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --white: #fffbff;
  --pink0: #fff0f6;
  --pink1: #ffd6ea;
  --pink2: #ffb3d1;
  --pink3: #ff85b3;
  --pink4: #e05585;
  --lilac: #e8d5ff;
  --lilac2: #c9a8f7;
  --mint: #d4f5ec;
  --mint2: #8ee3c8;
  --yellow: #fff3b0;
  --yellow2: #ffd966;
  --text: #5a3550;
  --text2: #8a5878;
  --shadow: rgba(220,130,170,0.18);
}

body {
  font-family: 'Nunito', sans-serif;
  background: var(--pink0);
  min-height: 100vh;
  overflow-x: hidden;
}

@keyframes floatY {
  0%,100% { transform: translateY(0px) rotate(-2deg); }
  50%      { transform: translateY(-10px) rotate(2deg); }
}
@keyframes pop {
  0%   { transform: scale(0) rotate(-10deg); opacity:0; }
  70%  { transform: scale(1.15) rotate(3deg); opacity:1; }
  100% { transform: scale(1) rotate(0deg); opacity:1; }
}
@keyframes fadeSlideUp {
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes confettiFall {
  0%   { transform: translateY(-20px) rotate(0deg); opacity:1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity:0; }
}
@keyframes heartbeat {
  0%,100% { transform: scale(1); }
  50%      { transform: scale(1.12); }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes blink {
  0%,90%,100% { transform: scaleY(1); }
  95%         { transform: scaleY(0.08); }
}

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem 4rem;
  position: relative;
}

.blob {
  position: fixed;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
  opacity: 0.45;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
  animation: fadeSlideUp .8s ease both;
}
.header-title {
  font-size: clamp(2rem, 6vw, 3.2rem);
  font-weight: 900;
  background: linear-gradient(120deg, #e05585, #c9a8f7, #ff85b3, #ffd966);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4s linear infinite;
  line-height: 1.2;
}
.header-sub {
  font-family: 'Quicksand', sans-serif;
  font-size: 1rem;
  color: var(--text2);
  margin-top: .4rem;
  font-weight: 600;
}

.char-wrap {
  position: relative;
  z-index: 2;
  margin-bottom: 1.5rem;
  animation: floatY 3s ease-in-out infinite;
}
.char-svg {
  filter: drop-shadow(0 8px 24px rgba(220,130,170,0.35));
}

.card {
  background: rgba(255,255,255,0.82);
  backdrop-filter: blur(16px);
  border-radius: 28px;
  padding: 1.8rem 2rem;
  max-width: 480px;
  width: 100%;
  border: 2px solid var(--pink1);
  box-shadow: 0 8px 40px var(--shadow);
  position: relative;
  z-index: 2;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: .5rem;
}

.game-area {
  width: 100%;
  height: 220px;
  background: linear-gradient(180deg, #e8f4ff 0%, var(--lilac) 100%);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  cursor: crosshair;
  border: 2px solid var(--lilac2);
  user-select: none;
}
.game-star {
  position: absolute;
  font-size: 28px;
  cursor: pointer;
  animation: floatY 2s ease-in-out infinite;
  user-select: none;
}
.game-star:hover { transform: scale(1.3); }
.score-badge {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  background: var(--pink1);
  border-radius: 50px;
  padding: .35rem .9rem;
  font-size: .9rem;
  font-weight: 800;
  color: var(--pink4);
  margin-top: .8rem;
}

.memory-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.mem-card {
  aspect-ratio: 1;
  border-radius: 14px;
  border: 2.5px solid var(--pink1);
  background: var(--pink0);
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform .2s, box-shadow .2s;
  user-select: none;
  box-shadow: 0 2px 8px var(--shadow);
}
.mem-card:hover { transform: scale(1.07); box-shadow: 0 4px 16px var(--shadow); }
.mem-card.flipped { background: var(--yellow); border-color: var(--yellow2); animation: pop .3s ease; }
.mem-card.matched { background: var(--mint); border-color: var(--mint2); }

.paint-area {
  width: 100%;
  border-radius: 16px;
  border: 2px solid var(--pink1);
  cursor: crosshair;
  display: block;
  background: white;
  touch-action: none;
}
.paint-colors {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: .7rem;
  align-items: center;
}
.color-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
  transition: transform .15s, border-color .15s;
  box-shadow: 0 2px 6px rgba(0,0,0,.12);
}
.color-dot:hover { transform: scale(1.2); }
.color-dot.active { border-color: var(--text); transform: scale(1.15); }
.paint-btns { display: flex; gap: 8px; margin-top: .7rem; }
.btn-sm {
  font-family: 'Nunito', sans-serif;
  font-size: .78rem;
  font-weight: 700;
  padding: .4rem .9rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform .15s;
}
.btn-sm:hover { transform: translateY(-2px); }
.btn-pink { background: var(--pink2); color: var(--text); }
.btn-clear { background: var(--lilac); color: var(--text); }

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 1.5rem;
  z-index: 2;
  position: relative;
  flex-wrap: wrap;
  justify-content: center;
}
.tab {
  font-family: 'Nunito', sans-serif;
  font-size: .85rem;
  font-weight: 800;
  padding: .5rem 1.1rem;
  border-radius: 50px;
  border: 2.5px solid var(--pink2);
  background: white;
  color: var(--text2);
  cursor: pointer;
  transition: all .2s;
}
.tab.active {
  background: linear-gradient(135deg, var(--pink3), var(--lilac2));
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 14px rgba(220,130,170,0.4);
  transform: translateY(-2px);
}

.letter-box {
  background: linear-gradient(135deg, var(--yellow) 0%, var(--pink1) 100%);
  border-radius: 20px;
  padding: 1.6rem;
  text-align: center;
  font-family: 'Quicksand', sans-serif;
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text);
  font-weight: 600;
  border: 2px dashed var(--pink2);
}
.letter-box .big {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--pink4);
  display: block;
  margin-bottom: .6rem;
}

.confetti-piece {
  position: fixed;
  font-size: 18px;
  pointer-events: none;
  z-index: 999;
  animation: confettiFall linear forwards;
}

.hug-btn {
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  padding: .8rem 2rem;
  border: none;
  border-radius: 50px;
  background: linear-gradient(135deg, var(--pink3), var(--lilac2));
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(220,130,170,0.45);
  transition: transform .15s, box-shadow .15s;
  display: block;
  margin: 1.2rem auto 0;
  position: relative;
  z-index: 2;
  animation: heartbeat 2.5s ease-in-out infinite;
}
.hug-btn:hover {
  transform: scale(1.06);
  box-shadow: 0 8px 28px rgba(220,130,170,0.55);
}

.deco {
  position: fixed;
  pointer-events: none;
  z-index: 0;
  font-size: 1.5rem;
  opacity: .3;
}
`;

/* ─── CONFETTI ─────────────────────────────────────────── */
const CONFETTI_EMOJIS = ["🌸", "⭐", "💗", "🍬", "✨", "🎀", "🌷", "🍭", "💕", "🌟"];

function Confetti({ pieces }) {
  return (
    <>
      {pieces.map(p => (
        <span key={p.id} className="confetti-piece" style={{
          left: p.x + "vw",
          top: "-30px",
          animationDuration: p.dur + "s",
          animationDelay: p.delay + "s",
        }}>{p.emoji}</span>
      ))}
    </>
  );
}

function makeConfetti(n = 30) {
  return Array.from({ length: n }, (_, i) => ({
    id: Date.now() + i,
    x: Math.random() * 100,
    emoji: CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)],
    dur: 2 + Math.random() * 2,
    delay: Math.random() * 1,
  }));
}

/* ─── MELODY SVG ────────────────────────────────────────── */
function MyMelody() {
  return (
    <svg className="char-svg" width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="45" rx="18" ry="22" fill="#ffb3d1" />
      <ellipse cx="100" cy="45" rx="18" ry="22" fill="#ffb3d1" />
      <ellipse cx="30" cy="45" rx="11" ry="15" fill="#ff85b3" />
      <ellipse cx="100" cy="45" rx="11" ry="15" fill="#ff85b3" />
      <ellipse cx="65" cy="70" rx="42" ry="38" fill="white" />
      <path d="M23 60 Q65 10 107 60 Q85 45 65 42 Q45 45 23 60Z" fill="#ffb3d1" />
      <ellipse cx="88" cy="38" rx="10" ry="7" fill="#ff5fa0" transform="rotate(-20 88 38)" />
      <ellipse cx="106" cy="32" rx="10" ry="7" fill="#ff5fa0" transform="rotate(20 106 32)" />
      <circle cx="97" cy="35" r="5" fill="#ff85b3" />
      <ellipse cx="52" cy="72" rx="5" ry="6" fill="#5a3550" />
      <ellipse cx="78" cy="72" rx="5" ry="6" fill="#5a3550" />
      <circle cx="54" cy="70" r="2" fill="white" />
      <circle cx="80" cy="70" r="2" fill="white" />
      <ellipse cx="65" cy="80" rx="4" ry="3" fill="#ff85b3" />
      <ellipse cx="42" cy="82" rx="9" ry="6" fill="#ffb3d1" opacity=".6" />
      <ellipse cx="88" cy="82" rx="9" ry="6" fill="#ffb3d1" opacity=".6" />
      <ellipse cx="65" cy="116" rx="28" ry="18" fill="#ffd6ea" />
      <ellipse cx="65" cy="110" rx="22" ry="16" fill="white" />
      <ellipse cx="36" cy="108" rx="10" ry="7" fill="white" transform="rotate(-30 36 108)" />
      <ellipse cx="94" cy="108" rx="10" ry="7" fill="white" transform="rotate(30 94 108)" />
    </svg>
  );
}

/* ─── STAR GAME ─────────────────────────────────────────── */
const STAR_EMOJIS = ["⭐", "🌟", "💫", "✨", "🌸", "💗", "🍬", "🎀"];

function StarGame() {
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState([]);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const timerRef = useRef(null);
  const spawnRef = useRef(null);

  const start = () => {
    setScore(0);
    setStars([]);
    setRunning(true);
    setTimeLeft(20);
  };

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          clearInterval(spawnRef.current);
          setRunning(false);
          setStars([]);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    spawnRef.current = setInterval(() => {
      const id = Date.now() + Math.random();
      const x = 5 + Math.random() * 80;
      const y = 5 + Math.random() * 70;
      const emoji = STAR_EMOJIS[Math.floor(Math.random() * STAR_EMOJIS.length)];
      setStars(s => [...s.slice(-12), { id, x, y, emoji }]);
    }, 700);

    return () => { clearInterval(timerRef.current); clearInterval(spawnRef.current); };
  }, [running]);

  const catchStar = (id, e) => {
    e.stopPropagation();
    setStars(s => s.filter(st => st.id !== id));
    setScore(s => s + 1);
  };

  return (
    <div>
      <div className="section-title">⭐ pega as estrelinhas!</div>
      <div className="game-area" onClick={!running ? start : undefined}>
        {!running && timeLeft === 20 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: "2.5rem" }}>🌟</span>
            <span style={{ fontWeight: 800, color: "#8a5878", fontSize: "1rem" }}>toca pra começar!</span>
          </div>
        )}
        {!running && timeLeft === 0 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }} onClick={start}>
            <span style={{ fontSize: "2rem" }}>🎀</span>
            <span style={{ fontWeight: 900, color: "#e05585", fontSize: "1.1rem" }}>você pegou {score}!</span>
            <span style={{ fontWeight: 700, color: "#8a5878", fontSize: ".85rem" }}>jogar de novo?</span>
          </div>
        )}
        {running && (
          <div style={{ position: "absolute", top: 8, right: 12, fontWeight: 800, color: "#8a5878", fontSize: ".85rem" }}>
            ⏱ {timeLeft}s
          </div>
        )}
        {stars.map(st => (
          <span key={st.id} className="game-star"
            style={{ left: `${st.x}%`, top: `${st.y}%` }}
            onClick={(e) => catchStar(st.id, e)}
          >{st.emoji}</span>
        ))}
      </div>
      {running && <div className="score-badge">💗 {score} estrelinhas</div>}
    </div>
  );
}

/* ─── MEMORY GAME ───────────────────────────────────────── */
const MEM_EMOJIS = ["🌸", "🍭", "🎀", "⭐", "🌈", "🍓", "💗", "🦋"];
function shuffle(arr) { return [...arr].sort(() => Math.random() - .5); }

function MemoryGame() {
  const [cards, setCards] = useState(() =>
    shuffle([...MEM_EMOJIS, ...MEM_EMOJIS].map((e, i) => ({
      id: i, emoji: e, flipped: false, matched: false
    })))
  );
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [confetti, setConfetti] = useState([]);

  const flip = (id) => {
    if (selected.length === 2) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;
    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setCards(newCards);
    const newSel = [...selected, id];
    setSelected(newSel);
    if (newSel.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newSel.map(sid => newCards.find(c => c.id === sid));
      setTimeout(() => {
        if (a.emoji === b.emoji) {
          const matched = newCards.map(c =>
            c.id === a.id || c.id === b.id ? { ...c, matched: true } : c
          );
          setCards(matched);
          if (matched.every(c => c.matched)) {
            setWon(true);
            setConfetti(makeConfetti(40));
            setTimeout(() => setConfetti([]), 4000);
          }
        } else {
          setCards(newCards.map(c =>
            c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c
          ));
        }
        setSelected([]);
      }, 800);
    }
  };

  const reset = () => {
    setCards(shuffle([...MEM_EMOJIS, ...MEM_EMOJIS].map((e, i) => ({
      id: i, emoji: e, flipped: false, matched: false
    }))));
    setSelected([]);
    setMoves(0);
    setWon(false);
    setConfetti([]);
  };

  return (
    <div>
      <Confetti pieces={confetti} />
      <div className="section-title">🦋 jogo da memória</div>
      {won ? (
        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: ".5rem" }}>🎉</div>
          <div style={{ fontWeight: 900, color: "#e05585", fontSize: "1.1rem", marginBottom: ".3rem" }}>
            você completou em {moves} jogadas!
          </div>
          <div style={{ color: "#8a5878", fontSize: ".9rem", marginBottom: "1rem" }}>incrível, Olivia! 🌸</div>
          <button className="btn-sm btn-pink" onClick={reset}>jogar de novo 💗</button>
        </div>
      ) : (
        <>
          <div className="memory-grid">
            {cards.map(c => (
              <div key={c.id}
                className={`mem-card${c.flipped ? " flipped" : ""}${c.matched ? " matched" : ""}`}
                onClick={() => flip(c.id)}
              >
                {c.flipped || c.matched ? c.emoji : "🎀"}
              </div>
            ))}
          </div>
          <div style={{ marginTop: ".7rem", color: "#8a5878", fontSize: ".85rem", fontWeight: 700 }}>
            🌸 {moves} jogadas
          </div>
        </>
      )}
    </div>
  );
}

/* ─── PAINT ─────────────────────────────────────────────── */
const COLORS = ["#ff85b3", "#c9a8f7", "#8ee3c8", "#ffd966", "#ff5fa0", "#74c0fc", "#ff8787", "#ffffff", "#5a3550"];

function PaintGame() {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [color, setColor] = useState("#ff85b3");
  const [size, setSize] = useState(8);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  };

  const startDraw = (e) => {
    drawing.current = true;
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!drawing.current) return;
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const endDraw = () => { drawing.current = false; };

  const clear = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const save = () => {
    const link = document.createElement("a");
    link.download = "olivia-art.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div>
      <div className="section-title">🎨 quadro de pintura</div>
      <canvas ref={canvasRef} className="paint-area" width={400} height={200}
        onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
        onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        style={{ maxWidth: "100%" }}
      />
      <div className="paint-colors">
        {COLORS.map(c => (
          <div key={c} className={`color-dot${color === c ? " active" : ""}`}
            style={{ background: c, border: c === "#ffffff" ? "3px solid #ddd" : undefined }}
            onClick={() => setColor(c)}
          />
        ))}
        <input type="range" min="4" max="24" value={size}
          onChange={e => setSize(+e.target.value)}
          style={{ width: 70, accentColor: "#ff85b3", marginLeft: 4 }}
        />
      </div>
      <div className="paint-btns">
        <button className="btn-sm btn-clear" onClick={clear}>limpar 🗑</button>
        <button className="btn-sm btn-pink" onClick={save}>salvar 💾</button>
      </div>
    </div>
  );
}

/* ─── MAIN ─────────────────────────────────────────────── */
function pics() {
  const [tab, setTab] = useState("estrelas");
  const [hugged, setHugged] = useState(false);
  const [confetti, setConfetti] = useState([]);

  const hug = () => {
    setHugged(true);
    setConfetti(makeConfetti(35));
    setTimeout(() => setConfetti([]), 4000);
  };

  const tabs = [
    { id: "estrelas", label: "⭐ estrelas" },
    { id: "memoria", label: "🦋 memória" },
    { id: "pintura", label: "🎨 pintura" },
    { id: "carta", label: "💌 cartinha" },
  ];

  return (
    <>
      <style>{css}</style>
      <Confetti pieces={confetti} />

      <div className="blob" style={{ width: 400, height: 400, background: "#ffd6ea", top: -100, right: -120 }} />
      <div className="blob" style={{ width: 350, height: 350, background: "#e8d5ff", bottom: -80, left: -100 }} />
      <div className="blob" style={{ width: 250, height: 250, background: "#d4f5ec", top: "40%", left: "5%" }} />

      {["🌸", "💗", "⭐", "🎀", "✨", "🌷"].map((e, i) => (
        <span key={i} className="deco" style={{
          top: `${10 + i * 13}%`,
          left: i % 2 === 0 ? "2%" : "94%",
          fontSize: "1.3rem",
          animation: `floatY ${3 + i * .7}s ease-in-out infinite`,
        }}>{e}</span>
      ))}

      <div className="page">
        <div className="header">
          <div className="header-title">olá, Olivia! 🌸</div>
          <div className="header-sub">esse cantinho foi feito só pra você ✨</div>
        </div>

        <div className="char-wrap">
          <MyMelody />
        </div>

        <div className="tabs">
          {tabs.map(t => (
            <button key={t.id} className={`tab${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="card">
          {tab === "estrelas" && <StarGame />}
          {tab === "memoria" && <MemoryGame />}
          {tab === "pintura" && <PaintGame />}
          {tab === "carta" && (
            <div className="letter-box">
              <span className="big">💌 pra você, Olivia</span>
              Às vezes a vida pesa um pouquinho demais,<br />
              e tá tudo bem não estar bem.<br /><br />
              Você é mais forte do que imagina —<br />
              e mais amada do que percebe. 🌸<br /><br />
              Esse momento vai passar,<br />
              e quando passar, você vai olhar pra trás<br />
              e ver o quanto você aguentou.<br /><br />
              <strong>Você não está sozinha. 💗</strong>
            </div>
          )}
        </div>

        <button className="hug-btn" onClick={hug}>
          {hugged ? "🤗 abraço enviado! 💗" : "me manda um abraço 🤗"}
        </button>
      </div>
    </>
  );
}

export default pics;