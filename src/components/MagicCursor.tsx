import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

interface Explosion {
  id: number;
  x: number;
  y: number;
}

export const MagicCursor = () => {
  const [trail, setTrail] = useState<Particle[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newParticle: Particle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      };

      setTrail((prev) => [...prev.slice(-20), newParticle]);
    };

    const handleClick = (e: MouseEvent) => {
      const newExplosion: Explosion = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };

      setExplosions((prev) => [...prev, newExplosion]);

      setTimeout(() => {
        setExplosions((prev) => prev.filter((exp) => exp.id !== newExplosion.id));
      }, 800);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    const interval = setInterval(() => {
      const now = Date.now();
      setTrail((prev) => prev.filter((p) => now - p.timestamp < 500));
    }, 50);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {trail.map((particle, index) => {
        const age = Date.now() - particle.timestamp;
        const opacity = Math.max(0, 1 - age / 500);
        const scale = Math.max(0.3, 1 - age / 500);

        return (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full transition-opacity duration-100"
            style={{
              left: particle.x,
              top: particle.y,
              opacity: opacity * 0.6,
              transform: `translate(-50%, -50%) scale(${scale})`,
              background: `radial-gradient(circle, hsl(142 76% 50% / ${opacity}), hsl(271 76% 63% / ${opacity * 0.5}))`,
              boxShadow: `0 0 ${8 * scale}px hsl(142 76% 50% / ${opacity * 0.8})`,
            }}
          />
        );
      })}

      {explosions.map((explosion) => (
        <div
          key={explosion.id}
          className="absolute"
          style={{
            left: explosion.x,
            top: explosion.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="absolute inset-0 animate-ping">
            <div className="w-8 h-8 rounded-full border-2 border-primary" />
          </div>
          
          {[...Array(8)].map((_, i) => {
            const angle = (i * Math.PI * 2) / 8;
            const distance = 30;
            
            return (
              <div
                key={i}
                className="absolute w-1 h-1 bg-primary rounded-full animate-fade-out"
                style={{
                  left: Math.cos(angle) * distance,
                  top: Math.sin(angle) * distance,
                  animationDelay: `${i * 0.05}s`,
                  boxShadow: "0 0 4px hsl(var(--primary))",
                }}
              />
            );
          })}
          
          <div className="absolute w-4 h-4 -translate-x-2 -translate-y-2 rounded-full bg-primary/50 animate-scale-out blur-sm" />
        </div>
      ))}
    </div>
  );
};
