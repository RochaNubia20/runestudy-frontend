import { useState } from "react";
import cosmeticsImage from "@/assets/cosmetics-items.png";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trophy, Target, Coins, Zap, Book, Award, ShoppingBag, Sparkles, User } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { KnightCompanion } from "@/components/KnightCompanion";

const Dashboard = () => {
  const [selectedAvatar, setSelectedAvatar] = useState("🧙");
  const [userCoins, setUserCoins] = useState(250);
  const [ownedCosmetics, setOwnedCosmetics] = useState<string[]>(["🧙"]);
  const [equippedCosmetic, setEquippedCosmetic] = useState("🧙");

  const cosmetics = [
    { id: "wizard", emoji: "🧙", name: "Mago Sábio", cost: 0, owned: true },
    { id: "crown", emoji: "👑", name: "Coroa Real", cost: 100, owned: false },
    { id: "knight", emoji: "⚔️", name: "Cavaleiro", cost: 150, owned: false },
    { id: "shield", emoji: "🛡️", name: "Escudeiro", cost: 150, owned: false },
    { id: "archer", emoji: "🏹", name: "Arqueiro", cost: 200, owned: false },
    { id: "sword", emoji: "🗡️", name: "Espadachim", cost: 200, owned: false },
    { id: "magic", emoji: "🔮", name: "Místico", cost: 250, owned: false },
    { id: "thunder", emoji: "⚡", name: "Trovão", cost: 300, owned: false },
    { id: "star", emoji: "🌟", name: "Estrelar", cost: 350, owned: false },
    { id: "dragon", emoji: "🐉", name: "Domador de Dragões", cost: 500, owned: false },
  ];

  const handleBuyCosmetic = (cosmetic: typeof cosmetics[0]) => {
    if (userCoins >= cosmetic.cost && !ownedCosmetics.includes(cosmetic.emoji)) {
      setUserCoins(userCoins - cosmetic.cost);
      setOwnedCosmetics([...ownedCosmetics, cosmetic.emoji]);
      toast.success(`${cosmetic.name} adquirido!`);
    } else if (ownedCosmetics.includes(cosmetic.emoji)) {
      toast.info("Você já possui este cosmético!");
    } else {
      toast.error("Moedas insuficientes!");
    }
  };

  const handleEquipCosmetic = (emoji: string) => {
    if (ownedCosmetics.includes(emoji)) {
      setEquippedCosmetic(emoji);
      toast.success("Cosmético equipado!");
    }
  };

  // Mock data - será substituído por dados reais da API
  const user = {
    nickname: "Aventureiro",
    level: 5,
    xp: 2340,
    xpToNextLevel: 3000,
    coins: 150,
  };

  const recentTasks = [
    { id: 1, title: "Estudar Cálculo I", xp: 50, completed: true },
    { id: 2, title: "Revisar História", xp: 30, completed: true },
    { id: 3, title: "Exercícios de Física", xp: 40, completed: false },
  ];

  const topSkills = [
    { name: "Matemática", points: 450, level: 8 },
    { name: "História", points: 320, level: 6 },
    { name: "Física", points: 280, level: 5 },
  ];

  const xpPercentage = (user.xp / user.xpToNextLevel) * 100;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="mystic-glow">⚔️ Home</span>
          </h2>
          <p className="text-muted-foreground text-xs">Continue sua jornada épica de estudos</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Level Card */}
              <Card className="p-4 bg-card border-2 border-primary/30 hover:border-primary/50 transition-all pixel-corners">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 flex items-center justify-center pixel-corners">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Nível</p>
                    <p className="text-2xl font-bold text-foreground">{user.level}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-muted-foreground">XP</span>
                    <span className="text-foreground font-bold">{user.xp} / {user.xpToNextLevel}</span>
                  </div>
                  <Progress value={xpPercentage} className="h-2" />
                </div>
              </Card>

              {/* XP Card */}
              <Card className="p-4 bg-card border-2 border-secondary/30 hover:border-secondary/50 transition-all pixel-corners">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary/20 flex items-center justify-center pixel-corners">
                    <Zap className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total XP</p>
                    <p className="text-2xl font-bold text-foreground">{user.xp}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  <span className="text-secondary font-bold">-{user.xpToNextLevel - user.xp} XP</span> próx. nível
                </p>
              </Card>

              {/* Coins Card */}
              <Card className="p-4 bg-card border-2 border-primary/30 hover:border-primary/50 transition-all pixel-corners">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 flex items-center justify-center pixel-corners">
                    <Coins className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Moedas</p>
                    <p className="text-2xl font-bold text-foreground">{user.coins}</p>
                  </div>
                </div>
                <Link to="/rewards">
                  <Button variant="outline" className="w-full mt-3 text-xs" size="sm">
                    Ver Recompensas
                  </Button>
                </Link>
              </Card>
            </div>

            {/* Recent Tasks & Skills */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Recent Tasks */}
              <Card className="p-4 bg-card border-2 border-border/50 pixel-corners">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <Book className="w-4 h-4 text-primary" />
                    Tarefas
                  </h3>
                  <Link to="/tasks">
                    <Button variant="ghost" size="sm" className="text-xs h-6">Ver</Button>
                  </Link>
                </div>
                <div className="space-y-2">
                  {recentTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-2 bg-background/50 border border-border/30 pixel-corners"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 border-2 flex items-center justify-center pixel-corners ${
                          task.completed ? 'bg-primary border-primary' : 'border-border'
                        }`}>
                          {task.completed && <span className="text-primary-foreground text-[8px]">✓</span>}
                        </div>
                        <span className={`text-xs ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {task.title.length > 20 ? task.title.substring(0, 20) + '...' : task.title}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-secondary">+{task.xp}</span>
                    </div>
                  ))}
                </div>
                <Link to="/tasks">
                  <Button variant="mystic" className="w-full mt-3 text-xs" size="sm">
                    Nova Tarefa
                  </Button>
                </Link>
              </Card>

              {/* Top Skills */}
              <Card className="p-4 bg-card border-2 border-border/50 pixel-corners">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <Target className="w-4 h-4 text-secondary" />
                    Skills
                  </h3>
                  <Link to="/skills">
                    <Button variant="ghost" size="sm" className="text-xs h-6">Ver</Button>
                  </Link>
                </div>
                <div className="space-y-2">
                  {topSkills.slice(0, 3).map((skill, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{skill.name}</span>
                        <span className="text-xs text-muted-foreground">Lv {skill.level}</span>
                      </div>
                      <Progress value={(skill.points / 500) * 100} className="h-1" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <KnightCompanion />
          </div>

          {/* Avatar & Cosmetics (1/3) */}
          <div className="space-y-4">
            {/* Avatar Display */}
            <Card className="p-4 bg-card border-2 border-primary/30 text-center pixel-corners relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
              <h3 className="text-sm font-bold mb-3 text-foreground relative">👤 Seu Avatar</h3>
              <div className="relative w-24 h-24 mx-auto mb-3 text-6xl flex items-center justify-center border-4 border-primary/40 pixel-corners bg-primary/10 hover:scale-110 transition-transform">
                {equippedCosmetic}
              </div>
              <p className="text-xs text-muted-foreground mb-2 relative">Aventureiro Nível {user.level}</p>
              <Badge variant="secondary" className="text-xs relative">
                <Coins className="w-3 h-3 mr-1" />
                {userCoins} Moedas
              </Badge>
            </Card>

            {/* Cosmetics */}
            <Card className="p-4 bg-card border-2 border-border/50 pixel-corners">
              <h3 className="text-sm font-bold mb-3 text-foreground">🎨 Meus Cosméticos</h3>
              <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                {cosmetics
                  .filter(c => ownedCosmetics.includes(c.emoji))
                  .map((cosmetic) => (
                    <button
                      key={cosmetic.id}
                      onClick={() => handleEquipCosmetic(cosmetic.emoji)}
                      className={`p-3 text-3xl border-2 pixel-corners transition-all hover:scale-110 ${
                        equippedCosmetic === cosmetic.emoji 
                          ? 'border-primary bg-primary/20 animate-pulse' 
                          : 'border-border/30 hover:border-primary/50'
                      }`}
                      title={cosmetic.name}
                    >
                      {cosmetic.emoji}
                    </button>
                  ))}
              </div>
            </Card>

            {/* Cosmetic Store */}
            <Card className="relative p-4 bg-card border-2 border-secondary/30 pixel-corners overflow-hidden">
              <div 
                className="absolute top-0 right-0 w-20 h-20 opacity-10 bg-contain bg-no-repeat"
                style={{ backgroundImage: `url(${cosmeticsImage})` }}
              />
              <h3 className="text-sm font-bold mb-3 text-secondary relative">🏪 Loja de Cosméticos</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto relative">
                {cosmetics.map((cosmetic) => {
                  const isOwned = ownedCosmetics.includes(cosmetic.emoji);
                  return (
                    <div 
                      key={cosmetic.id}
                      className={`flex items-center justify-between p-2 pixel-corners border transition-all ${
                        isOwned 
                          ? 'bg-primary/10 border-primary/30' 
                          : 'bg-background/50 border-border/30 hover:border-secondary/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{cosmetic.emoji}</span>
                        <div>
                          <p className="text-xs font-bold text-foreground">{cosmetic.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {isOwned ? '✅ Adquirido' : `${cosmetic.cost} moedas`}
                          </p>
                        </div>
                      </div>
                      {!isOwned && (
                        <Button 
                          size="sm" 
                          variant={userCoins >= cosmetic.cost ? "mystic" : "outline"}
                          className="text-xs h-7"
                          onClick={() => handleBuyCosmetic(cosmetic)}
                          disabled={userCoins < cosmetic.cost}
                        >
                          Comprar
                        </Button>
                      )}
                      {isOwned && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs h-7"
                          onClick={() => handleEquipCosmetic(cosmetic.emoji)}
                        >
                          Equipar
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
