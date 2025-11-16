import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="relative p-8 bg-card border-2 border-primary/30 hover:border-primary hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all duration-300 group pixel-corners overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative flex flex-col items-center text-center space-y-4">
        <div className="p-5 pixel-corners bg-primary/10 group-hover:bg-primary/20 transition-all group-hover:scale-110 duration-300 border-2 border-primary/30">
          <Icon className="w-10 h-10 text-primary group-hover:animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-foreground group-hover:mystic-glow transition-all">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      
      <div className="absolute top-2 left-2 w-2 h-2 bg-primary/50 pixel-corners"></div>
      <div className="absolute top-2 right-2 w-2 h-2 bg-primary/50 pixel-corners"></div>
      <div className="absolute bottom-2 left-2 w-2 h-2 bg-secondary/50 pixel-corners"></div>
      <div className="absolute bottom-2 right-2 w-2 h-2 bg-secondary/50 pixel-corners"></div>
    </Card>
  );
};
