import { useEffect, useState } from "react";
import runeStones from "@/assets/rune-stones.png";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Mail, Shield, Calendar, Trophy, Target, Coins, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getEmoji } from "@/constants/emojiMap";
import { UseAuth } from "@/contexts/AuthContext";
import { UseAvatars } from "@/contexts/AvatarContext";
import { AvatarResponse } from "@/types/avatar";
import { changePassword, selectAvatar, updateUser } from "@/services/userService";
import { UseTasks } from "@/contexts/TaskContext";
import { UseSkills } from "@/contexts/SkillContext";
import { TaskResponse } from "@/types/task";
import { ChangePasswordRequest, UserUpdateRequest } from "@/types/user";

const Profile = () => {
  const { user, refreshUser, logout } = UseAuth();
  const { tasks } = UseTasks();
  const { skills } = UseSkills();
  const { avatars } = UseAvatars();
  const navigate = useNavigate();

  const [name, setName] = useState(user.name);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ownedAvatars, setOwnedAvatars] = useState<AvatarResponse[]>(() => avatars.filter(a => a.owned));
  const [pendingTasks, setPendingTasks] = useState<TaskResponse[]>(() => tasks.filter(t => t.status !== "completed"));
  const [userAvatar, setUserAvatar] = useState<string>(user.currentAvatarIcon);

  useEffect(() => {
    setOwnedAvatars(avatars.filter(a => a.owned));
  }, [avatars]);

  useEffect(() => {
    setPendingTasks(tasks.filter(t => t.status !== "completed"));
  }, [tasks]);

  // Runas élficas como conquistas (placeholder)
  const achievements = [
    { id: 1, name: "ᚠ Fehu", description: "Primeira Tarefa", unlocked: true, rune: "ᚠ" },
    { id: 2, name: "ᚢ Uruz", description: "7 dias seguidos", unlocked: true, rune: "ᚢ" },
    { id: 3, name: "ᚦ Thurisaz", description: "Mestre Matemática", unlocked: false, rune: "ᚦ" },
    { id: 4, name: "ᚨ Ansuz", description: "100 tarefas", unlocked: false, rune: "ᚨ" },
    { id: 5, name: "ᚱ Raidho", description: "Todas habilidades Lv5", unlocked: false, rune: "ᚱ" },
    { id: 6, name: "ᚲ Kenaz", description: "1000 XP total", unlocked: true, rune: "ᚲ" },
  ];

  const formatDate = (date: Date): string => {
    const dateString = new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    return dateString;
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        toast.error("As senhas não coincidem.");
        return;
      }
      const newPasswordRequest: ChangePasswordRequest = {newPassword};
      try {
        const response = await changePassword(user.id, newPasswordRequest);
        if (response.status === 204) {
          toast.success("A senha foi alterada.");
        }
      } catch (error: any) {
        if (error?.response?.status === 400) {
          toast.error("A senha atual é idêntica a existente.");
        } else {
          toast.error("Erro ao alterar senha. Tente novamente.");
        }
        console.error(error);
      }
    }

    if (name == user.name && !newPassword) {
      toast.info("As informações não foram alteradas.");
    } else {
      const userData: UserUpdateRequest = {name};
      try {
        const response = await updateUser(user.id, userData);
        if (response.status === 204) {
          toast.success("Salvo!");
        }
      } catch (error: any) {
        toast.error("Erro ao atualizar informações. Tente novamente.");
        console.error(error);
      }
    }
  }

  const handleEquipCosmetic = (avatar: AvatarResponse) => {
    if (user.currentAvatarName !== avatar.iconName) {
      user.currentAvatarName = avatar.iconName;
      user.currentAvatarIcon = avatar.icon;
      setUserAvatar(user.currentAvatarIcon);

      selectAvatar(avatar.iconName);
      toast.success("Cosmético equipado!");
    }
  };

  const handleLogout = () => {
    toast.info(user.nickname + " saiu.");
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="mystic-glow">{getEmoji('person')} Perfil</span>
          </h2>
          <p className="text-muted-foreground text-xs">Gerencie sua conta</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-4">
            {/* Avatar Card */}
            <Card className="p-4 bg-card border-2 border-primary/30 text-center pixel-corners">
              <Avatar className="w-20 h-20 mx-auto mb-3 border-4 border-primary/50 pixel-corners">
                <AvatarFallback className="text-5xl bg-primary/20 pixel-corners">
                  {userAvatar}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-bold mb-1 text-foreground">{user.nickname}</h3>
              <p className="text-muted-foreground text-xs mb-3">{user.email}</p>
              <Badge variant="secondary" className="mb-3 text-xs">
                <Trophy className="w-2 h-2 mr-1" />
                Nível {user.level}
              </Badge>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full text-xs" size="sm">
                    Editar Avatar
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-2 border-primary/30">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold mystic-glow">
                      Escolher Avatar
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-4 gap-3">
                    {ownedAvatars.map((avatar) => (
                      <button
                        key={avatar.iconName}
                        onClick={() => handleEquipCosmetic(avatar)}
                        className={`p-3 text-3xl border-2 pixel-corners transition-all ${userAvatar === avatar.iconName
                          ? 'border-primary bg-primary/20'
                          : 'border-border/30 hover:border-primary/50'
                          }`}
                      >
                        {avatar.icon}
                      </button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </Card>

            {/* Stats Card */}
            <Card className="p-4 bg-card border-2 border-border/50 pixel-corners">
              <h4 className="text-sm font-bold mb-3 text-foreground">Estatísticas</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-3 h-3 text-primary" />
                    <span className="text-muted-foreground">XP</span>
                  </div>
                  <span className="font-bold text-foreground">{user.totalXP}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-3 h-3 text-primary" />
                    <span className="text-muted-foreground">Moedas</span>
                  </div>
                  <span className="font-bold text-foreground">{user.totalCoins}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-3 h-3 text-secondary" />
                    <span className="text-muted-foreground">Tarefas</span>
                  </div>
                  <span className="font-bold text-foreground">{pendingTasks.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-secondary" />
                    <span className="text-muted-foreground">Skills</span>
                  </div>
                  <span className="font-bold text-foreground">{skills.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-primary" />
                    <span className="text-muted-foreground">Membro</span>
                  </div>
                  <span className="font-bold text-foreground">{formatDate(user.createdAt)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Settings & Achievements */}
          <div className="md:col-span-2 space-y-4">
            {/* Account Settings */}
            <Card className="p-4 bg-card border-2 border-border/50 pixel-corners">
              <h4 className="text-sm font-bold mb-3 text-foreground">Configurações</h4>
              <form onSubmit={handleUpdateUser} className="space-y-3" autoComplete="off">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block flex items-center gap-2">
                    <User className="w-3 h-3" />
                    Nome
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    Nova Senha
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    className="bg-background text-xs" />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    Confirmar Nova Senha
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-background text-xs" />
                </div>
                <Button type="submit" variant="mystic" className="w-full text-xs" size="sm">
                  Salvar
                </Button>
              </form>
            </Card>

            {/* Rune Achievements */}
            <Card className="relative p-4 bg-card border-2 border-border/50 pixel-corners overflow-hidden">
              <div
                className="absolute inset-0 opacity-5 bg-cover bg-center"
                style={{ backgroundImage: `url(${runeStones})` }}
              />
              <h4 className="text-sm font-bold mb-3 text-foreground relative flex items-center gap-2">
                <span className="mystic-glow">🔮 Runas Místicas Conquistadas</span>
              </h4>
              <div className="grid md:grid-cols-2 gap-3 relative">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`relative p-3 border-2 pixel-corners transition-all hover:scale-105 ${achievement.unlocked
                      ? 'bg-gradient-to-br from-primary/20 to-secondary/10 border-primary/60 shadow-[0_0_15px_hsl(var(--primary)/0.4)]'
                      : 'bg-background/50 border-border/30 opacity-50'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`relative w-14 h-14 flex items-center justify-center text-3xl pixel-corners border-2 transition-all ${achievement.unlocked
                        ? 'bg-primary/30 border-primary/70 animate-pulse-glow shadow-[0_0_20px_hsl(var(--primary)/0.6)]'
                        : 'bg-muted border-muted-foreground/30'
                        }`}>
                        {achievement.unlocked ? (
                          <span className="mystic-glow drop-shadow-[0_0_8px_hsl(var(--primary))]">
                            {achievement.rune}
                          </span>
                        ) : (
                          <span className="text-2xl">🔒</span>
                        )}
                        {achievement.unlocked && (
                          <>
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping"></div>
                            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-secondary rounded-full animate-ping delay-300"></div>
                          </>
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className={`font-bold text-xs mb-1 ${achievement.unlocked ? 'text-foreground mystic-glow' : 'text-muted-foreground'
                          }`}>
                          {achievement.name}
                        </h5>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        {achievement.unlocked && (
                          <span className="inline-block mt-1 text-xs text-primary">✨ Desbloqueada</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Logout */}
            <Card className="p-4 bg-card border-2 border-destructive/30 pixel-corners">
              <h4 className="text-sm font-bold mb-2 text-foreground">Zona de Perigo</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Sair da conta
              </p>
              <Button variant="destructive" className="w-full text-xs" size="sm" onClick={handleLogout}>
                <LogOut className="w-3 h-3 mr-1" />
                Sair
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
