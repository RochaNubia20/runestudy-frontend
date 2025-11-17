import { Button } from "@/components/ui/button";
import { RuneLogo } from "@/components/RuneLogo";
import { FeatureCard } from "@/components/FeatureCard";
import { AuthForm } from "@/components/AuthForm";
import { Sparkles, Trophy, Target, Coins, TrendingUp, Award, Scroll, Swords, Shield } from "lucide-react";
import { getEmoji } from "@/constants/emojiMap";

import heroKnight from "@/assets/hero-knight.png";
import heroBg from "@/assets/hero-bg.png";
const Index = () => {
  return <div className="min-h-screen bg-background">
    {/* Header */}
    <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <RuneLogo />

        <Button variant="mystic" size="sm" className="text-xs px-2 h-7" onClick={() => document.getElementById('auth')?.scrollIntoView({
          behavior: 'smooth'
        })}>
          Login/Cadastro
        </Button>
      </nav>
    </header>

    {/* Hero Section */}
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background"></div>

      <div className="container relative mx-auto px-6 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 border-2 border-primary/40 rounded-lg bg-primary/10 mb-4 pixel-corners">
              <span className="text-sm mystic-glow">{getEmoji('knight')} Sua Saga Acadêmica Começa Aqui</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="mystic-glow">Transforme seus estudos</span>
              <br />
              <span className="text-foreground">em uma jornada épica!</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {getEmoji('gaming')} Gamifique sua rotina de estudos, ganhe XP, evolua suas habilidades e desbloqueie recompensas enquanto conquista seus objetivos acadêmicos como um verdadeiro herói RPG!
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                variant="mystic"
                size="lg"
                className="text-base group hover:scale-105 transition-transform"
                onClick={() => document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Scroll className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Comece sua Aventura
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base group hover:scale-105 transition-transform"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Shield className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Explorar Recursos
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-lg blur-3xl animate-pulse"></div>
            <div className="relative pixel-corners overflow-hidden bg-background">
              <img
                src={heroKnight}
                alt="Hero Knight - RuneStudy Mascot"
                className="w-full h-full object-contain animate-float"
              />
            </div>

            {/* Floating stats */}
            <div className="absolute -top-4 -right-4 bg-card border-2 border-primary/50 rounded-lg p-3 pixel-corners shadow-lg animate-bounce">
              <div className="text-center">
                <Trophy className="w-6 h-6 text-primary mx-auto mb-1" />
                <p className="text-xs font-bold mystic-glow">+100 XP</p>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-card border-2 border-secondary/50 rounded-lg p-3 pixel-corners shadow-lg animate-bounce delay-300">
              <div className="text-center">
                <Coins className="w-6 h-6 text-secondary mx-auto mb-1" />
                <p className="text-xs font-bold text-secondary">+50 Moedas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="features" className="container mx-auto px-6 py-16 md:py-24">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold">
          <span className="mystic-glow">Sua jornada épica para se tornar um mestre começa aqui!</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Cada tarefa concluída te aproxima de seus objetivos com recompensas reais
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <FeatureCard icon={Scroll} title={`${getEmoji('knight')} Crie Missões`} description="Transforme suas tarefas em missões épicas e ganhe recompensas enquanto progride nos seus estudos como um verdadeiro aventureiro!" />
        <FeatureCard icon={TrendingUp} title="📈 Ganhe XP" description="Acumule pontos de experiência por cada missão completa e suba de nível, tornando-se um mestre em suas áreas de estudo!" />
        <FeatureCard icon={Swords} title="🛡️ Evolua Habilidades" description="Melhore suas habilidades especiais conforme avança na sua jornada acadêmica e desbloqueie novos poderes!" />
      </div>

      {/*Highlights */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-card border-2 border-primary/20 rounded-lg p-8 text-center hover:border-primary/50 transition-all">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-foreground">Sistema de XP</h3>
          <p className="text-muted-foreground">
            Acumule pontos e veja seu nível geral aumentar conforme completa tarefas
          </p>
        </div>

        <div className="bg-card border-2 border-secondary/20 rounded-lg p-8 text-center hover:border-secondary/50 transition-all">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
            <Award className="w-8 h-8 text-secondary" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-foreground">Pontos de Habilidade</h3>
          <p className="text-muted-foreground">
            Evolua em áreas específicas do conhecimento com pontos dedicados por tema
          </p>
        </div>

        <div className="bg-card border-2 border-primary/20 rounded-lg p-8 text-center hover:border-primary/50 transition-all">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Coins className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-foreground">Moedas & Recompensas</h3>
          <p className="text-muted-foreground">
            Ganhe moedas virtuais e desbloqueie suas próprias recompensas personalizadas
          </p>
        </div>
      </div>
    </section>

    {/* Auth Section */}
    <section id="auth" className="container mx-auto px-6 py-16 md:py-24">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="text-center space-y-4 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold mystic-glow">
            Cadastro/Login
          </h2>
          <p className="text-xl text-muted-foreground">
            Entre agora e comece sua jornada épica de estudos!
          </p>
        </div>

        <AuthForm />
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-border/50 py-4 mt-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <RuneLogo size="sm" />
          <p className="text-xs text-muted-foreground">
            © 2025 RuneStudy. Transformando estudos em aventuras.
          </p>
        </div>
      </div>
    </footer>
  </div>;
};
export default Index;