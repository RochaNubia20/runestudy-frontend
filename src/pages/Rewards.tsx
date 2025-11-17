import { useState } from "react";
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

interface Reward {
  id: number;
  title: string;
  description: string;
  cost: number;
  claimed: boolean;
  likeLevel: number;
}

const Rewards = () => {
  const [userCoins, setUserCoins] = useState(250);
  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: 1,
      title: "Assistir série",
      description: "30min de série favorita",
      cost: 50,
      claimed: false,
      likeLevel: 3,
    },
    {
      id: 2,
      title: "Jogar videogame",
      description: "1 hora de jogo",
      cost: 100,
      claimed: false,
      likeLevel: 4,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newReward, setNewReward] = useState({
    title: "",
    description: "",
    likeLevel: 3
  });

  const calculateCost = (likeLevel: number): number => {
    const costs = [20, 40, 60, 80, 120, 200];
    return costs[likeLevel];
  };

  const handleClaim = (rewardId: number, cost: number) => {
    if (userCoins >= cost) {
      setUserCoins(userCoins - cost);
      setRewards(rewards.map(reward => 
        reward.id === rewardId ? { ...reward, claimed: true } : reward
      ));
      toast.success(`Recompensa resgatada! -${cost} moedas ${getEmoji('celebration')}`);
    } else {
      toast.error("Moedas insuficientes!");
    }
  };

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReward.title.trim()) {
      toast.error("Digite um título!");
      return;
    }

    const reward: Reward = {
      id: Date.now(),
      title: newReward.title,
      description: newReward.description,
      cost: calculateCost(newReward.likeLevel),
      claimed: false,
      likeLevel: newReward.likeLevel,
    };

    setRewards([...rewards, reward]);
    setNewReward({ title: "", description: "", likeLevel: 3 });
    setIsDialogOpen(false);
    toast.success("Recompensa criada!");
  };

  const availableRewards = rewards.filter(r => !r.claimed);
  const claimedRewards = rewards.filter(r => r.claimed);

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
                <span className="font-bold text-lg mystic-glow">{userCoins}</span>
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
                    value={newReward.title}
                    onChange={(e) => setNewReward({...newReward, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Descrição</label>
                  <Textarea 
                    placeholder="Descreva..." 
                    className="bg-background text-xs" 
                    rows={2}
                    value={newReward.description}
                    onChange={(e) => setNewReward({...newReward, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-2 block">
                    O quanto você gosta? (0-5)
                  </label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[newReward.likeLevel]}
                      onValueChange={(value) => setNewReward({...newReward, likeLevel: value[0]})}
                      max={5}
                      min={0}
                      step={1}
                      className="flex-1"
                    />
                    <Badge variant="secondary" className="text-xs w-8 justify-center">
                      {newReward.likeLevel}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Custo calculado: <span className="text-primary font-bold">{calculateCost(newReward.likeLevel)} moedas</span>
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

        {/* Available Rewards */}
        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-primary" />
            Disponíveis ({availableRewards.length})
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableRewards.map((reward) => {
              const canAfford = userCoins >= reward.cost;
              
              return (
                <Card 
                  key={reward.id} 
                  className={`p-4 bg-card border-2 transition-all pixel-corners ${
                    canAfford 
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
                      <span className="text-lg font-bold text-foreground">{reward.cost}</span>
                    </div>
                    <Button 
                      variant={canAfford ? "mystic" : "outline"}
                      disabled={!canAfford}
                      onClick={() => handleClaim(reward.id, reward.cost)}
                      size="sm"
                      className="text-xs"
                    >
                      {canAfford ? "Resgatar" : "$$"}
                    </Button>
                  </div>
                </Card>
              );
            })}
            
            {availableRewards.length === 0 && (
              <Card className="col-span-full p-8 bg-card border-2 border-dashed border-border/50 text-center pixel-corners">
                <Gift className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-xs">Nenhuma recompensa. Crie!</p>
              </Card>
            )}
          </div>
        </div>

        {/* Claimed Rewards */}
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
