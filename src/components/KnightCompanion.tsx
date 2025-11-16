import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import knightMascot from "@/assets/knight-mascot.png";

const epicMessages = [
  "Guerreiro! Suas conquistas ecoam pelos corredores do conhecimento! ⚔️",
  "Que a sabedoria dos antigos guie seus estudos hoje! 📚✨",
  "Cada tarefa completa é uma vitória no campo de batalha do aprendizado! 🏆",
  "Vejo poder crescente em você, estudante! Continue sua jornada! 🌟",
  "As runas antigas profetizaram sua grandeza. Prove que estão certas! 🔮",
  "Ergue tua espada do conhecimento e conquiste este dia! ⚡",
  "Os mestres do passado observam seus passos com orgulho! 👑",
  "Não há fortaleza que resista ao poder do estudo dedicado! 🏰",
  "Tua jornada apenas começou, mas já mostras coragem de herói! 🛡️",
  "Que o brilho místico das runas ilumine seu caminho hoje! 💫",
];

export const KnightCompanion = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const randomMessage = epicMessages[Math.floor(Math.random() * epicMessages.length)];
    setMessage(randomMessage);
  }, []);

  return (
    <Card className="p-0 bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/30 pixel-corners relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
      
      <div className="relative flex flex-row items-center gap-6 p-6">
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-primary/30 blur-xl animate-pulse-glow" />
          <img 
            src={knightMascot} 
            alt="Knight Companion" 
            className="w-64 h-64 relative z-10 animate-float"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        
        <div className="relative flex-1">
          <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-0 h-0 border-t-[12px] border-b-[12px] border-r-[16px] border-t-transparent border-b-transparent border-r-primary/30" />
          
          <div className="bg-background/95 border-2 border-primary/30 pixel-corners p-4 shadow-lg">
            <div className="flex items-start gap-2 mb-3">
              <span className="text-primary text-lg font-bold mystic-glow">🛡️</span>
              <h3 className="text-sm font-bold text-primary mystic-glow flex-1">
                Cavaleiro Guardião
              </h3>
            </div>
            <p className="text-xs text-foreground leading-relaxed px-1">
              {message}
            </p>
            
            <div className="mt-3 pt-3 border-t border-primary/20 flex justify-center">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                ✨ Mensagem Mística
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
