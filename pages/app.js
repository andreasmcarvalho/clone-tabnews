import React, { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    const heartInterval = setInterval(() => {
      const heart = document.createElement("div");
      heart.className = "heart";
      heart.style.left = Math.random() * 100 + "vw";
      heart.style.bottom = "-30px";
      heart.style.animationDuration = Math.random() * 3 + 4 + "s";
      heart.style.animationDelay = Math.random() * 2 + "s";
      document.body.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 7000);
    }, 500);

    const sparkleInterval = setInterval(() => {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.left = Math.random() * 100 + "vw";
      sparkle.style.top = Math.random() * 100 + "vh";
      sparkle.style.animationDelay = Math.random() + "s";
      document.body.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, 1500);
    }, 300);

    return () => {
      clearInterval(heartInterval);
      clearInterval(sparkleInterval);
    };
  }, []);

  return (
    <div className="container">
      <h1>Isadora Eu Te Amo</h1>
    </div>
  );
}

export default App;
