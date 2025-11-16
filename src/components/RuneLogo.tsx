import runeStudyLogo from "@/assets/runestudy-logo.png";

export const RuneLogo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-12 h-12",
    lg: "w-20 h-20"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-base",
    lg: "text-2xl"
  };

  return (
    <div className="flex items-center gap-2">
      <img 
        src={runeStudyLogo} 
        alt="RuneStudy - Transforme seus estudos em aventura" 
        className={`${sizeClasses[size]} drop-shadow-[0_0_15px_hsl(var(--primary)/0.8)] animate-float pixel-corners`}
        style={{ imageRendering: 'pixelated' }}
      />
      <span className={`${textSizeClasses[size]} font-bold mystic-glow tracking-wider`}>RuneStudy</span>
    </div>
  );
};
