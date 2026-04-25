import { useState, useEffect } from "react";

const heartsEmojis = ["💗", "💖", "💝", "💕", "💓", "🌸", "✨", "🌷"];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #fff0f5;
    min-height: 100vh;
    overflow-x: hidden;
  }

  @keyframes floatUp {
    0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
    80%  { opacity: 1; }
    100% { transform: translateY(-100vh) rotate(20deg); opacity: 0; }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.08); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
  }

  .card {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(12px);
    border-radius: 32px;
    padding: 3.5rem 3rem;
    max-width: 520px;
    width: 100%;
    text-align: center;
    border: 1.5px solid rgba(255, 180, 200, 0.35);
    box-shadow: 0 8px 48px rgba(255, 100, 140, 0.1);
    animation: fadeIn 1s ease both;
  }

  .heart-icon {
    font-size: 64px;
    display: block;
    margin-bottom: 1.5rem;
    animation: pulse 2s ease-in-out infinite;
  }

  .eyebrow {
    font-family: 'Lato', sans-serif;
    font-weight: 300;
    font-size: 13px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #e87fa0;
    margin-bottom: 1rem;
    animation: fadeIn 1s 0.2s ease both;
    opacity: 0;
  }

  .title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.6rem, 8vw, 4rem);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 0.4rem;
    background: linear-gradient(120deg, #d4527a, #e891b0, #d4527a);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: fadeIn 1s 0.4s ease both, shimmer 3s linear infinite;
    opacity: 0;
  }

  .subtitle {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: clamp(1.3rem, 4vw, 1.8rem);
    color: #c76a8c;
    margin-bottom: 2.5rem;
    animation: fadeIn 1s 0.6s ease both;
    opacity: 0;
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0 auto 2rem;
    max-width: 240px;
    animation: fadeIn 1s 0.8s ease both;
    opacity: 0;
  }

  .divider-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, #f0a0be);
  }
  .divider-line.right {
    background: linear-gradient(to left, transparent, #f0a0be);
  }

  .message {
    font-family: 'Lato', sans-serif;
    font-weight: 300;
    font-size: 1rem;
    line-height: 1.85;
    color: #9c6070;
    margin-bottom: 2.5rem;
    animation: fadeIn 1s 1s ease both;
    opacity: 0;
  }

  .btn {
    background: linear-gradient(135deg, #e87fa0, #d45c82);
    color: white;
    border: none;
    border-radius: 50px;
    padding: 0.85rem 2.4rem;
    font-family: 'Lato', sans-serif;
    font-size: 0.95rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 20px rgba(212, 92, 130, 0.35);
    animation: fadeIn 1s 1.2s ease both;
    opacity: 0;
  }

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(212, 92, 130, 0.45);
  }

  .btn:active {
    transform: scale(0.97);
  }

  .bg-deco {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }

  .deco-circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.12;
  }
`;

function FloatingHeart({ id, onDone }) {
  const left = Math.random() * 90 + 5;
  const duration = 3 + Math.random() * 2;
  const emoji = heartsEmojis[Math.floor(Math.random() * heartsEmojis.length)];
  const size = 16 + Math.floor(Math.random() * 20);

  useEffect(() => {
    const t = setTimeout(onDone, duration * 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <span
      style={{
        position: "fixed",
        left: `${left}%`,
        bottom: "-10px",
        fontSize: `${size}px`,
        animation: `floatUp ${duration}s ease-in forwards`,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {emoji}
    </span>
  );
}

function pics() {
  const [floatingHearts, setFloatingHearts] = useState([]);

  const spawnHearts = () => {
    const newHearts = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
    }));
    setFloatingHearts((prev) => [...prev, ...newHearts]);
  };

  const removeHeart = (id) => {
    setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <>
      <style>{styles}</style>

      <div className="bg-deco">
        <div className="deco-circle" style={{ width: 400, height: 400, background: "#f8a0c0", top: -100, right: -100 }} />
        <div className="deco-circle" style={{ width: 300, height: 300, background: "#f4c0d8", bottom: -80, left: -80 }} />
        <div className="deco-circle" style={{ width: 200, height: 200, background: "#ffd6e7", top: "40%", left: "10%" }} />
      </div>

      {floatingHearts.map((h) => (
        <FloatingHeart key={h.id} id={h.id} onDone={() => removeHeart(h.id)} />
      ))}

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="card">
          <span className="heart-icon">💗</span>
          <p className="eyebrow">para sempre e sempre</p>
          <h1 className="title">Luiza,</h1>
          <p className="subtitle">eu te amo pra sempre.</p>

          <div className="divider">
            <div className="divider-line" />
            <span style={{ fontSize: 16 }}>🌸</span>
            <div className="divider-line right" />
          </div>

          <p className="message">
            Cada dia ao seu lado é um presente que eu nunca vou cansar de receber.
            Você é minha pessoa favorita nesse mundo inteiro.
          </p>

          <button className="btn" onClick={spawnHearts}>
            Manda amor 💖
          </button>
        </div>
      </div>
    </>
  );
}

export default pics;