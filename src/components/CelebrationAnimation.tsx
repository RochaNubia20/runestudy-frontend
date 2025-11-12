import { useEffect, useState } from "react";
import { Sparkles, Star, Trophy, Zap } from "lucide-react";

interface CelebrationAnimationProps {
  type: "task" | "skill-level" | "player-level";
  message?: string;
  onComplete: () => void;
}

export const CelebrationAnimation = ({ type, message, onComplete }: CelebrationAnimationProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const duration = type === "player-level" ? 4000 : type === "skill-level" ? 3000 : 2000;
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500);
    }, duration);
    return () => clearTimeout(timer);
  }, [type, onComplete]);

  if (!visible) return null;

  const renderTaskComplete = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 animate-ping">
          <Sparkles className="w-16 h-16 text-primary mx-auto" />
        </div>
        <div className="relative bg-card/95 border-4 border-primary pixel-corners p-6 mystic-border animate-scale-in">
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-3 animate-pulse-glow" />
          <p className="text-lg font-bold text-center text-primary mystic-glow">
            Tarefa Completa!
          </p>
          <p className="text-xs text-muted-foreground text-center mt-2">+XP Ganho</p>
        </div>
      </div>
    </div>
  );

  const renderSkillLevelUp = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none animate-fade-in">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="relative">
        <div className="absolute -inset-8 animate-pulse-glow">
          {[...Array(8)].map((_, i) => (
            <Star
              key={i}
              className="absolute w-6 h-6 text-secondary animate-float"
              style={{
                top: `${Math.sin((i * Math.PI * 2) / 8) * 60 + 50}%`,
                left: `${Math.cos((i * Math.PI * 2) / 8) * 60 + 50}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
        <div className="relative bg-card border-4 border-secondary pixel-corners p-8 purple-glow animate-scale-in">
          <Trophy className="w-16 h-16 text-secondary mx-auto mb-4 animate-pulse-glow" />
          <p className="text-2xl font-bold text-center text-secondary mystic-glow mb-2">
            LEVEL UP!
          </p>
          <p className="text-sm text-center text-foreground">{message}</p>
        </div>
      </div>
    </div>
  );

  const renderPlayerLevelUp = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-secondary/30 to-background/80 backdrop-blur-md" />
      <div className="relative">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-gradient-radial from-primary/50 via-secondary/30 to-transparent animate-pulse-glow" />
        </div>

        <div className="relative bg-card/95 border-8 border-primary pixel-corners p-12 mystic-border shadow-[0_0_50px_rgba(74,222,128,0.8)]">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Zap className="w-12 h-12 text-primary animate-pulse-glow" />
            <Trophy className="w-20 h-20 text-secondary animate-float" />
            <Zap className="w-12 h-12 text-primary animate-pulse-glow" />
          </div>
          
          <p className="text-4xl font-bold text-center mb-4">
            <span className="text-primary mystic-glow">NÍVEL</span>{" "}
            <span className="text-secondary mystic-glow">MÁXIMO!</span>
          </p>
          
          <p className="text-lg text-center text-foreground mb-2 font-bold">
            🎉 INCRÍVEL! 🎉
          </p>
          
          <p className="text-sm text-center text-muted-foreground">
            {message || "Você atingiu um novo patamar!"}
          </p>
          
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-6 h-6 text-primary animate-pulse-glow"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {type === "task" && renderTaskComplete()}
      {type === "skill-level" && renderSkillLevelUp()}
      {type === "player-level" && renderPlayerLevelUp()}
    </>
  );
};
