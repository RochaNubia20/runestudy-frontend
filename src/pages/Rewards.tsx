import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Coins, Gift, Plus, ShoppingBag, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { getEmoji } from "@/constants/emojiMap";
import { UseAuth } from "@/contexts/AuthContext";
import { UseRewards } from "@/contexts/RewardContext";
import { RewardRequest, RewardResponse } from "@/types/reward";
import { registerReward } from "@/services/rewardService";
import { buyReward } from "@/services/storeService";

const Rewards = () => {
  const { user, refreshUser } = UseAuth();
  const { rewards, refreshRewards } = UseRewards();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [likeLevel, setLikeLevel] = useState(1);
  const [availableRewards, setAvailableRewards] = useState<RewardResponse[]>(() => rewards.filter(r => r.status !== "claimed"));
  const [claimedRewards, setClaimedRewards] = useState<RewardResponse[]>(() => rewards.filter(r => r.status === "claimed"));
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setAvailableRewards(rewards.filter(r => r.status !== "claimed"));
    setClaimedRewards(rewards.filter(r => r.status === "claimed"));
    refreshRewards();
    refreshUser();
  }, [rewards])

  const calculateCost = (likeLevel: number): number => {
    switch (likeLevel) {
      case 2:
        return 50;

      case 3:
        return 75;

      case 4:
        return 100;

      case 5:
        return 150;

      default:
        return 30;
    }
  };

  const handleClaim = async (rewardId: number) => {
    const reward = rewards.find(r => r.id === rewardId);

    if (user.totalCoins >= reward.price) {
      await buyReward(rewardId);
      await refreshRewards();

      toast.success(`Recompensa resgatada! -${reward.price} moedas ${getEmoji('celebration')}`);
    } else {
      toast.error("Moedas insuficientes!");
    }
  };

  const handleCreateReward = async (e: React.FormEvent) => {
    e.preventDefault();
    debugger;
    if (!title || !likeLevel) {
      toast.error("Preencha todos os campos.");
      return;
    }

    const newReward: RewardRequest = {
      title,
      description,
      likeLevel
    };

    try {
      const response = await registerReward(newReward);

      if (response.status === 201) {
        await refreshRewards();
        setIsDialogOpen(false);
        toast.success("Recompensa criada com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao criar recompensa. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="mystic-glow">{getEmoji('celebration')} Recompensas</span>
            </h2>
            <p className="text-muted-foreground text-xs">Troque moedas por prêmios</p>
          </div>

          <div className="flex items-center gap-3">
            <Card className="p-3 pixel-corners border-2 border-primary/40 bg-primary/10">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                <span className="font-bold text-lg mystic-glow">{user.totalCoins}</span>
              </div>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="mystic" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Nova
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-2 border-primary/30">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold mystic-glow">
                    Criar Recompensa
                  </DialogTitle>
                </DialogHeader>
                <form className="space-y-3" onSubmit={handleCreateReward}>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Título</label>
                    <Input
                      placeholder="Ex: Assistir filme"
                      className="bg-background text-xs"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Descrição</label>
                    <Textarea
                      placeholder="Descreva..."
                      className="bg-background text-xs"
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-2 block">
                      O quanto você gosta? (1-5)
                    </label>
                    <div className="flex items-center gap-3">
                      <Slider
                        value={[likeLevel]}
                        onValueChange={(value) => setLikeLevel(value[0])}
                        max={5}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <Badge variant="secondary" className="text-xs w-8 justify-center">
                        {likeLevel}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Custo calculado: <span className="text-primary font-bold">{calculateCost(likeLevel)} moedas</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Quanto mais gostar, maior o custo!
                    </p>
                  </div>
                  <Button type="submit" variant="mystic" className="w-full text-xs" size="sm">
                    Criar Recompensa
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-primary" />
            Disponíveis ({availableRewards.length})
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableRewards.map((reward) => (
              <Card
                key={reward.id}
                className={`p-4 bg-card border-2 transition-all pixel-corners ${reward.status !== "expensive"
                    ? 'border-primary/30 hover:border-primary/50'
                    : 'border-border/30 opacity-60'
                  }`}
              >
                <div className="flex items-start gap-2 mb-3">
                  <div className="w-10 h-10 bg-primary/20 flex items-center justify-center pixel-corners">
                    <Gift className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-foreground mb-1">{reward.title}</h4>
                    <p className="text-xs text-muted-foreground">{reward.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-primary" />
                    <span className="text-lg font-bold text-foreground">{reward.price}</span>
                  </div>
                  <Button
                    variant={reward.status !== "expensive" ? "mystic" : "outline"}
                    disabled={reward.status === "expensive"}
                    onClick={() => handleClaim(reward.id)}
                    size="sm"
                    className="text-xs"
                  >
                    {reward.status !== "expensive" ? "Resgatar" : "$$"}
                  </Button>
                </div>
              </Card>
            ))}

            {availableRewards.length === 0 && (
              <Card className="col-span-full p-8 bg-card border-2 border-dashed border-border/50 text-center pixel-corners">
                <Gift className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-xs">Nenhuma recompensa. Crie!</p>
              </Card>
            )}
          </div>
        </div>

        {claimedRewards.length > 0 && (
          <div>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-secondary" />
              Resgatadas ({claimedRewards.length})
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {claimedRewards.map((reward) => (
                <Card
                  key={reward.id}
                  className="p-4 bg-card/50 border-2 border-secondary/20 pixel-corners"
                >
                  <div className="flex items-start gap-2 mb-3 opacity-60">
                    <div className="w-10 h-10 bg-secondary/20 flex items-center justify-center pixel-corners">
                      <Gift className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-foreground mb-1">{reward.title}</h4>
                      <p className="text-xs text-muted-foreground">{reward.description}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50">
                    <Badge variant="secondary" className="w-full justify-center text-xs">
                      <Sparkles className="w-2 h-2 mr-1" />
                      Resgatada
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;
