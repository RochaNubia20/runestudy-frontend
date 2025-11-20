import { useEffect, useState } from "react";
import cosmeticsImage from "@/assets/cosmetics-items.png";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Coins, Zap, Book } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { getEmoji } from "@/constants/emojiMap";
import { buyAvatar } from "@/services/storeService";
import { AvatarResponse } from "@/types/avatar";
import { selectAvatar } from "@/services/userService";
import { UseAuth } from "@/contexts/AuthContext";
import { UseTasks } from "@/contexts/TaskContext";
import { UseSkills } from "@/contexts/SkillContext";
import { UseAvatars } from "@/contexts/AvatarContext";

const Dashboard = () => {
  const { user, token, refreshUser } = UseAuth();
  const { tasks, refreshTasks } = UseTasks();
  const { skills, refreshSkills } = UseSkills();
  const { avatars, refreshAvatars } = UseAvatars();

  const [userAvatar, setUserAvatar] = useState(user.currentAvatarIcon);
  const [ownedAvatars, setOwnedAvatars] = useState<AvatarResponse[]>(avatars.filter(a => a.owned));

  useEffect(() => {
    refreshUser();
    refreshTasks();
    refreshSkills();
    refreshAvatars();
  }, [token]);


  const handleBuyCosmetic = (avatar: typeof avatars[0]) => {
    if (avatar.owned) {
      toast.info("Você já possui este cosmético!");
      return;
    }
    if (user.totalCoins < avatar.price) {
      toast.error("Moedas insuficientes!");
      return;
    }
    try {
      user.totalCoins -= avatar.price;
      avatar.owned = true;
      setOwnedAvatars([...ownedAvatars, avatar]);

      buyAvatar(avatar.id);
      toast.success(`${avatar.title} adquirido!`);
    } catch (error) {
      toast.error("Ocorreu um erro ao comprar avatar.")
      console.log(error);
    }
  };

  const handleEquipCosmetic = (avatar: AvatarResponse) => {
    if (user.currentAvatarName !== avatar.iconName) {
      user.currentAvatarName = avatar.iconName;
      user.currentAvatarIcon = avatar.icon;
      setUserAvatar(user.currentAvatarIcon);

      selectAvatar(avatar.iconName);
      toast.success("Cosmético equipado!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="mystic-glow">{getEmoji('knight')} Home</span>
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
                    <span className="text-foreground font-bold">{user.totalXP} / {user.xpToNextLevel}</span>
                  </div>
                  <Progress value={user.levelPercentage} className="h-2" />
                </div>
              </Card>

              <Card className="p-4 bg-card border-2 border-secondary/30 hover:border-secondary/50 transition-all pixel-corners">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary/20 flex items-center justify-center pixel-corners">
                    <Zap className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total XP</p>
                    <p className="text-2xl font-bold text-foreground">{user.totalXP}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  <span className="text-secondary font-bold">-{user.xpToNextLevel - user.totalXP} XP</span> próx. nível
                </p>
              </Card>

              <Card className="p-4 bg-card border-2 border-primary/30 hover:border-primary/50 transition-all pixel-corners">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 flex items-center justify-center pixel-corners">
                    <Coins className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Moedas</p>
                    <p className="text-2xl font-bold text-foreground">{user.totalCoins}</p>
                  </div>
                </div>
                <Link to="/rewards">
                  <Button variant="outline" className="w-full mt-3 text-xs" size="sm">
                    Ver Recompensas
                  </Button>
                </Link>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
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
                  {tasks.slice(0, 3).map((task) => {
                  const taskCompleted = task.status === 'completed';

                  return (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-2 bg-background/50 border border-border/30 pixel-corners"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 border-2 flex items-center justify-center pixel-corners ${
                          taskCompleted ? 'bg-primary border-primary' : 'border-border'
                        }`}>
                          {taskCompleted && <span className="text-primary-foreground text-[8px]">✓</span>}
                        </div>
                        <span className={`text-xs ${taskCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {task.title.length > 20 ? task.title.substring(0, 20) + '...' : task.title}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-secondary">+{task.taskXP}</span>
                    </div>
                  )})}
                </div>
                <Link to="/tasks">
                  <Button variant="mystic" className="w-full mt-3 text-xs" size="sm">
                    Nova Tarefa
                  </Button>
                </Link>
              </Card>

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
                  {skills.slice(0, 3).map((skill, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{skill.name}</span>
                        <span className="text-xs text-muted-foreground">Lv {skill.level}</span>
                      </div>
                      <Progress value={skill.levelPercentage} className="h-1" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="p-4 bg-card border-2 border-primary/30 text-center pixel-corners relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
              <h3 className="text-sm font-bold mb-3 text-foreground relative">👤 Seu Avatar</h3>
              <div className="relative w-24 h-24 mx-auto mb-3 text-6xl flex items-center justify-center border-4 border-primary/40 pixel-corners bg-primary/10 hover:scale-110 transition-transform">
                {user.currentAvatarIcon}
              </div>
              <p className="text-xs text-muted-foreground mb-2 relative">Aventureiro Nível {user.level}</p>
              <Badge variant="secondary" className="text-xs relative">
                <Coins className="w-3 h-3 mr-1" />
                {user.totalCoins} Moedas
              </Badge>
            </Card>

            <Card className="p-4 bg-card border-2 border-border/50 pixel-corners">
              <h3 className="text-sm font-bold mb-3 text-foreground">🎨 Meus Cosméticos</h3>
              <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                {ownedAvatars
                  .map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => handleEquipCosmetic(avatar)}
                      className={`p-3 text-3xl border-2 pixel-corners transition-all hover:scale-110 ${
                        user.currentAvatarName === avatar.iconName
                          ? 'border-primary bg-primary/20 animate-pulse'
                          : 'border-border/30 hover:border-primary/50'
                      }`}
                      title={avatar.title}
                    >
                      {avatar.icon}
                    </button>
                  ))}
              </div>
            </Card>

            <Card className="relative p-4 bg-card border-2 border-secondary/30 pixel-corners overflow-hidden">
              <div
                className="absolute top-0 right-0 w-20 h-20 opacity-10 bg-contain bg-no-repeat"
                style={{ backgroundImage: `url(${cosmeticsImage})` }}
              />
              <h3 className="text-sm font-bold mb-3 text-secondary relative">🏪 Loja de Cosméticos</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto relative">
                {avatars.map((avatar) => {
                  return (
                    <div
                      key={avatar.id}
                      className={`flex items-center justify-between p-2 pixel-corners border transition-all ${
                        avatar.owned
                          ? 'bg-primary/10 border-primary/30'
                          : 'bg-background/50 border-border/30 hover:border-secondary/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{avatar.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-foreground">{avatar.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {avatar.owned ? '✅ Adquirido' : `${avatar.price} moedas`}
                          </p>
                        </div>
                      </div>
                      {!avatar.owned && (
                        <Button
                          size="sm"
                          variant={user.totalCoins >= avatar.price ? "mystic" : "outline"}
                          className="text-xs h-7"
                          onClick={() => handleBuyCosmetic(avatar)}
                          disabled={user.totalCoins < avatar.price}
                        >
                          Comprar
                        </Button>
                      )}
                      {avatar.owned && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7"
                          onClick={() => handleEquipCosmetic(avatar)}
                          disabled={avatar.iconName === user.currentAvatarName}
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
