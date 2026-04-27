import { useState, useEffect, useRef } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Quicksand:wght@400;500;600;700&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg: #f0f7ff;
  --white: #ffffff;
  --blue0: #e8f4ff;
  --blue1: #c8e6ff;
  --blue2: #90caff;
  --blue3: #5aabf5;
  --blue4: #2e86de;
  --pink0: #fff0f6;
  --pink1: #ffd6ea;
  --pink2: #ffb3d1;
  --pink3: #ff85b3;
  --text: #2a4a6b;
  --text2: #5b82a8;
  --shadow: rgba(90,171,245,0.15);
}

body {
  font-family: 'Nunito', sans-serif;
  background: var(--bg);
  min-height: 100vh;
  overflow-x: hidden;
}

@keyframes floatY {
  0%,100% { transform: translateY(0px) rotate(-1deg); }
  50%      { transform: translateY(-12px) rotate(1deg); }
}
@keyframes pop {
  0%   { transform: scale(0) rotate(-8deg); opacity:0; }
  70%  { transform: scale(1.12) rotate(2deg); opacity:1; }
  100% { transform: scale(1) rotate(0deg); opacity:1; }
}
@keyframes fadeSlideUp {
  from { opacity:0; transform:translateY(22px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes confettiFall {
  0%   { transform: translateY(-20px) rotate(0deg); opacity:1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity:0; }
}
@keyframes heartbeat {
  0%,100% { transform: scale(1); }
  50%      { transform: scale(1.08); }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes blink {
  0%,88%,100% { transform: scaleY(1); }
  93%         { transform: scaleY(0.06); }
}
@keyframes earWiggle {
  0%,100% { transform: rotate(0deg); transform-origin: bottom center; }
  30%      { transform: rotate(-6deg); transform-origin: bottom center; }
  70%      { transform: rotate(4deg); transform-origin: bottom center; }
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
  filter: blur(70px);
  pointer-events: none;
  z-index: 0;
  opacity: 0.4;
}

.header {
  text-align: center;
  margin-bottom: 1.8rem;
  position: relative;
  z-index: 2;
  animation: fadeSlideUp .8s ease both;
}
.header-title {
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 900;
  background: linear-gradient(120deg, var(--blue4), var(--pink3), var(--blue3), var(--pink2));
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 5s linear infinite;
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
  margin-bottom: 1.6rem;
  animation: floatY 3.5s ease-in-out infinite;
}

.card {
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(18px);
  border-radius: 28px;
  padding: 1.8rem 2rem;
  max-width: 500px;
  width: 100%;
  border: 2px solid var(--blue1);
  box-shadow: 0 8px 40px var(--shadow);
  position: relative;
  z-index: 2;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: .5rem;
}

/* ── star game ── */
.game-area {
  width: 100%;
  height: 200px;
  background: linear-gradient(160deg, var(--blue0) 0%, #dff0ff 50%, var(--pink0) 100%);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  cursor: crosshair;
  border: 2px solid var(--blue1);
  user-select: none;
}
.game-star {
  position: absolute;
  font-size: 26px;
  cursor: pointer;
  animation: floatY 2s ease-in-out infinite;
  user-select: none;
  transition: transform .1s;
}
.game-star:hover { transform: scale(1.35) !important; }
.score-badge {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  background: var(--blue1);
  border-radius: 50px;
  padding: .35rem .9rem;
  font-size: .88rem;
  font-weight: 800;
  color: var(--blue4);
  margin-top: .8rem;
}

/* ── memory ── */
.memory-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 9px;
}
.mem-card {
  aspect-ratio: 1;
  border-radius: 14px;
  border: 2.5px solid var(--blue1);
  background: var(--blue0);
  font-size: 1.55rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform .2s, box-shadow .2s;
  user-select: none;
  box-shadow: 0 2px 8px var(--shadow);
}
.mem-card:hover { transform: scale(1.07); }
.mem-card.flipped { background: #fff8e1; border-color: #ffe082; animation: pop .3s ease; }
.mem-card.matched { background: var(--pink0); border-color: var(--pink2); }

/* ── paint ── */
.paint-area {
  width: 100%;
  border-radius: 16px;
  border: 2px solid var(--blue1);
  cursor: crosshair;
  display: block;
  background: white;
  touch-action: none;
}
.paint-colors {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: .8rem;
  align-items: center;
}
.color-dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
  transition: transform .15s, border-color .15s;
  box-shadow: 0 2px 6px rgba(0,0,0,.1);
}
.color-dot:hover { transform: scale(1.22); }
.color-dot.active { border-color: var(--text); transform: scale(1.18); }
.paint-btns { display: flex; gap: 8px; margin-top: .8rem; }
.btn-sm {
  font-family: 'Nunito', sans-serif;
  font-size: .8rem;
  font-weight: 700;
  padding: .4rem 1rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform .15s;
}
.btn-sm:hover { transform: translateY(-2px); }
.btn-blue { background: var(--blue1); color: var(--text); }
.btn-pink { background: var(--pink1); color: #a0456a; }

/* ── tabs ── */
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
  border: 2.5px solid var(--blue1);
  background: white;
  color: var(--text2);
  cursor: pointer;
  transition: all .2s;
}
.tab.active {
  background: linear-gradient(135deg, var(--blue3), var(--pink3));
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 16px rgba(90,171,245,0.35);
  transform: translateY(-2px);
}

/* ── letter ── */
.letter-box {
  background: linear-gradient(135deg, var(--blue0) 0%, var(--pink0) 100%);
  border-radius: 20px;
  padding: 1.6rem;
  text-align: center;
  font-family: 'Quicksand', sans-serif;
  font-size: 1rem;
  line-height: 1.85;
  color: var(--text);
  font-weight: 600;
  border: 2px dashed var(--blue2);
}
.letter-box .big {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--blue4);
  display: block;
  margin-bottom: .7rem;
}

/* ── confetti ── */
.confetti-piece {
  position: fixed;
  font-size: 16px;
  pointer-events: none;
  z-index: 999;
  animation: confettiFall linear forwards;
}

/* ── hug btn ── */
.hug-btn {
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  padding: .85rem 2.2rem;
  border: none;
  border-radius: 50px;
  background: linear-gradient(135deg, var(--blue3), var(--pink3));
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 22px rgba(90,171,245,0.4);
  transition: transform .15s, box-shadow .15s;
  display: block;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  animation: heartbeat 2.8s ease-in-out infinite;
  letter-spacing: .3px;
}
.hug-btn:hover {
  transform: scale(1.06);
  box-shadow: 0 8px 30px rgba(90,171,245,0.5);
}

.deco {
  position: fixed;
  pointer-events: none;
  z-index: 0;
  opacity: .28;
}
`;

/* ── CONFETTI (pink/white/blue only) ── */
const CONFETTI_ITEMS = ["🩷","🤍","🩵","💗","💙","🫧","🌸","💕"];

function Confetti({ pieces }) {
  return <>
    {pieces.map(p => (
      <span key={p.id} className="confetti-piece" style={{
        left: p.x + "vw", top: "-30px",
        animationDuration: p.dur + "s",
        animationDelay: p.delay + "s",
      }}>{p.emoji}</span>
    ))}
  </>;
}

function makeConfetti(n = 32) {
  return Array.from({ length: n }, (_, i) => ({
    id: Date.now() + i,
    x: Math.random() * 100,
    emoji: CONFETTI_ITEMS[Math.floor(Math.random() * CONFETTI_ITEMS.length)],
    dur: 2.2 + Math.random() * 2,
    delay: Math.random() * .8,
  }));
}

/* ── CINNAMOROLL SVG ── */
function Cinnamoroll() {
  return (
    <img
      src="/cin.webp"
      alt="Cinnamoroll"
      width={170}
      style={{
        filter: "drop-shadow(0 10px 28px rgba(90,171,245,0.28))",
        userSelect: "none",
        pointerEvents: "none",
      }}
    />
  );
}

/* ── STAR GAME ── */
const STAR_ITEMS = ["🩷","🤍","🩵","💗","💙","🫧","🌸","💕"];

function StarGame() {
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState([]);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const timerRef = useRef(null);
  const spawnRef = useRef(null);

  const start = () => { setScore(0); setStars([]); setRunning(true); setTimeLeft(20); };

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          clearInterval(spawnRef.current);
          setRunning(false); setStars([]);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    spawnRef.current = setInterval(() => {
      const id = Date.now() + Math.random();
      const x = 5 + Math.random() * 80;
      const y = 5 + Math.random() * 70;
      const emoji = STAR_ITEMS[Math.floor(Math.random() * STAR_ITEMS.length)];
      setStars(s => [...s.slice(-12), { id, x, y, emoji }]);
    }, 650);
    return () => { clearInterval(timerRef.current); clearInterval(spawnRef.current); };
  }, [running]);

  const catchIt = (id, e) => {
    e.stopPropagation();
    setStars(s => s.filter(st => st.id !== id));
    setScore(s => s + 1);
  };

  return (
    <div>
      <div className="section-title">pega os corações!</div>
      <div className="game-area" onClick={!running ? start : undefined}>
        {!running && timeLeft === 20 && (
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
            <span style={{fontSize:"2.2rem"}}>🩵</span>
            <span style={{fontWeight:800,color:"#5b82a8",fontSize:"1rem"}}>toca pra começar!</span>
          </div>
        )}
        {!running && timeLeft === 0 && (
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,cursor:"pointer"}} onClick={start}>
            <span style={{fontWeight:900,color:"#2e86de",fontSize:"1.1rem"}}>você pegou {score}!</span>
            <span style={{fontWeight:700,color:"#5b82a8",fontSize:".85rem"}}>jogar de novo?</span>
          </div>
        )}
        {running && (
          <div style={{position:"absolute",top:8,right:12,fontWeight:800,color:"#5b82a8",fontSize:".85rem"}}>
            {timeLeft}s
          </div>
        )}
        {stars.map(st => (
          <span key={st.id} className="game-star"
            style={{left:`${st.x}%`,top:`${st.y}%`}}
            onClick={e => catchIt(st.id, e)}
          >{st.emoji}</span>
        ))}
      </div>
      {running && <div className="score-badge">🩷 {score} corações</div>}
    </div>
  );
}

/* ── MEMORY GAME ── */
const MEM_EMOJIS = ["🩷","🩵","🌸","🫧","💙","🤍","💗","🌷"];
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
            setTimeout(() => setConfetti([]), 4500);
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
    setSelected([]); setMoves(0); setWon(false); setConfetti([]);
  };

  return (
    <div>
      <Confetti pieces={confetti}/>
      <div className="section-title">jogo da memória</div>
      {won ? (
        <div style={{textAlign:"center",padding:"1rem 0"}}>
          <div style={{fontSize:"2.2rem",marginBottom:".5rem"}}>🩵</div>
          <div style={{fontWeight:900,color:"#2e86de",fontSize:"1.1rem",marginBottom:".3rem"}}>
            você completou em {moves} jogadas!
          </div>
          <div style={{color:"#5b82a8",fontSize:".9rem",marginBottom:"1rem"}}>incrível, Olivia!</div>
          <button className="btn-sm btn-blue" onClick={reset}>jogar de novo</button>
        </div>
      ) : (
        <>
          <div className="memory-grid">
            {cards.map(c => (
              <div key={c.id}
                className={`mem-card${c.flipped?" flipped":""}${c.matched?" matched":""}`}
                onClick={() => flip(c.id)}
              >
                {c.flipped || c.matched ? c.emoji : "🩵"}
              </div>
            ))}
          </div>
          <div style={{marginTop:".7rem",color:"#5b82a8",fontSize:".85rem",fontWeight:700}}>
            {moves} jogadas
          </div>
        </>
      )}
    </div>
  );
}

/* ── PAINT ── */
const COLORS = [
  "#ff85b3","#ffb3d1","#ffffff","#90caff","#5aabf5",
  "#2e86de","#c9a8f7","#ffd6ea","#b5d8f7","#2a4a6b"
];

function PaintGame() {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [color, setColor] = useState("#ff85b3");
  const [size, setSize] = useState(9);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  };

  const startDraw = (e) => {
    drawing.current = true;
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath(); ctx.moveTo(x, y);
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
      <div className="section-title">quadro de pintura</div>
      <canvas ref={canvasRef} className="paint-area" width={440} height={280}
        onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
        onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        style={{maxWidth:"100%"}}
      />
      <div className="paint-colors">
        {COLORS.map(c => (
          <div key={c} className={`color-dot${color===c?" active":""}`}
            style={{background:c, border: c==="#ffffff" ? "3px solid #c8d8e8" : undefined}}
            onClick={() => setColor(c)}
          />
        ))}
        <input type="range" min="4" max="28" value={size}
          onChange={e => setSize(+e.target.value)}
          style={{width:72,accentColor:"#5aabf5",marginLeft:4}}
        />
      </div>
      <div className="paint-btns">
        <button className="btn-sm btn-blue" onClick={clear}>limpar</button>
        <button className="btn-sm btn-pink" onClick={save}>salvar</button>
      </div>
    </div>
  );
}

/* ── MAIN ── */
function pics() {
  const [tab, setTab] = useState("coracoes");
  const [hugged, setHugged] = useState(false);
  const [confetti, setConfetti] = useState([]);

  const hug = () => {
    setHugged(true);
    setConfetti(makeConfetti(38));
    setTimeout(() => setConfetti([]), 4500);
  };

  const tabs = [
    { id: "coracoes", label: "corações" },
    { id: "memoria",  label: "memória"  },
    { id: "pintura",  label: "pintura"  },
    { id: "carta",    label: "cartinha" },
  ];

  return (
    <>
      <style>{css}</style>
      <Confetti pieces={confetti}/>

      <div className="blob" style={{width:420,height:420,background:"#c8e6ff",top:-110,right:-130}}/>
      <div className="blob" style={{width:360,height:360,background:"#ffd6ea",bottom:-90,left:-110}}/>
      <div className="blob" style={{width:260,height:260,background:"#e8f4ff",top:"38%",left:"4%"}}/>

      {["🩷","🩵","🤍","💗","🌸","🫧"].map((e,i) => (
        <span key={i} className="deco" style={{
          top:`${8+i*14}%`,
          left: i%2===0 ? "2%" : "94%",
          fontSize:"1.3rem",
          animation:`floatY ${3.2+i*.6}s ease-in-out infinite`,
        }}>{e}</span>
      ))}

      <div className="page">
        <div className="header">
          <div className="header-title">Oi Olivia!</div>
          <div className="header-sub">fiz isso pra que voce possa se divertir um pouco</div>
        </div>

        <div className="char-wrap">
          <Cinnamoroll />
        </div>

        <div className="tabs">
          {tabs.map(t => (
            <button key={t.id} className={`tab${tab===t.id?" active":""}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="card">
          {tab === "coracoes" && <StarGame />}
          {tab === "memoria"  && <MemoryGame />}
          {tab === "pintura"  && <PaintGame />}
          {tab === "carta"    && (
            <div className="letter-box">
              <span className="big">Querida Olivia</span>
              Às vezes a vida pesa um pouquinho demais,<br/>
              e tá tudo bem não estar bem.<br/><br/>
              Você é mais forte do que imagina —<br/>
              e mais amada do que percebe.<br/><br/>
              Esse momento vai passar,<br/>
              e quando passar, você vai olhar pra trás<br/>
              e ver o quanto você aguentou.<br/><br/>
              <strong>Você não está sozinha. </strong>
            </div>
          )}
        </div>

        <button className="hug-btn" onClick={hug}>
          {hugged ? "receber carinho" : "receber carinho"}
        </button>
      </div>
    </>
  );
}

export default pics;