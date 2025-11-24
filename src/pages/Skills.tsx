import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target, TrendingUp, Award, Book, Plus } from "lucide-react";
import { toast } from "sonner";
import { getEmoji, skillIcons } from "@/constants/emojiMap";
import { SkillRequest } from "@/types/skill";
import { UseSkills } from "@/contexts/SkillContext";
import { UseTasks } from "@/contexts/TaskContext";
import { TaskResponse } from "@/types/task";
import { registerSkill } from "@/services/skillService";

const Skills = () => {
  const { tasks } = UseTasks();
  const { skills, refreshSkills } = UseSkills();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("quest");
  const [completedTasks, setCompletedTasks] = useState<TaskResponse[]>(() => tasks.filter(t => t.status === "completed"));
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setCompletedTasks(tasks.filter(t => t.status === "completed"));
    refreshSkills();
  }, [tasks])

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Digite um nome para a habilidade.");
      return;
    }

    const newSkill: SkillRequest = {
      name,
      icon
    };

    try {
      const response = await registerSkill(newSkill);
      if (response.status === 201) {
        await refreshSkills();
        setIsDialogOpen(false);
        toast.success("Habilidade criada com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao criar habilidade. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="mystic-glow">{getEmoji('quest')} Habilidades</span>
          </h2>
          <p className="text-muted-foreground text-xs">Evolua em cada área</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-card border-2 border-primary/30 pixel-corners">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 flex items-center justify-center pixel-corners">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ativas</p>
                <p className="text-2xl font-bold text-foreground">{skills.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border-2 border-secondary/30 pixel-corners">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary/20 flex items-center justify-center pixel-corners">
                <Book className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tarefas</p>
                <p className="text-2xl font-bold text-foreground">
                  {tasks.length - completedTasks.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border-2 border-primary/30 pixel-corners">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 flex items-center justify-center pixel-corners">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pontos</p>
                <p className="text-2xl font-bold text-foreground">
                  {skills.reduce((acc, skill) => acc + skill.totalXP, 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {skills.map((skill) => (
            <Card
              key={skill.id}
              className="p-4 bg-card border-2 border-border/50 hover:border-primary/50 transition-all pixel-corners"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="text-3xl">{getEmoji(skill.icon)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-foreground">{skill.name}</h3>
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                      <Award className="w-2 h-2" />
                      Lv {skill.level}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {completedTasks.filter(t => t.skillName === skill.name).length === 1
                      ? completedTasks.filter(t => t.skillName === skill.name).length + ' tarefa completa'
                      : completedTasks.filter(t => t.skillName === skill.name).length + ' tarefas completas'}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="text-foreground font-bold">
                    {skill.levelPercentage}%
                  </span>
                </div>
                <Progress value={skill.levelPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary font-bold">-{skill.xpToNextLevel - skill.progressXP}</span> {'->'} Lv {skill.level + 1}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Card className="p-8 bg-card border-2 border-dashed border-primary/30 text-center hover:border-primary/50 transition-all cursor-pointer pixel-corners">
              <Target className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="text-sm font-bold mb-2 text-foreground">Nova Habilidade</h3>
              <p className="text-muted-foreground text-xs mb-3">Crie nova área de conhecimento</p>
              <Button variant="mystic" size="sm">
                <Plus className="w-3 h-3 mr-1" />
                Criar
              </Button>
            </Card>
          </DialogTrigger>
          <DialogContent className="bg-card border-2 border-primary/30">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold mystic-glow">
                Nova Habilidade
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-3" onSubmit={handleCreateSkill}>
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Nome</label>
                <Input
                  placeholder="Ex: Programação"
                  className="bg-background text-xs"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Ícone</label>
                <div className="grid grid-cols-6 gap-2 mb-2">
                  {skillIcons.map((skillIcon) => (
                    <button
                      key={skillIcon}
                      type="button"
                      onClick={() => setIcon(skillIcon)}
                      className={`p-2 text-2xl border-2 pixel-corners transition-all ${icon === skillIcon
                        ? 'border-primary bg-primary/20'
                        : 'border-border/30 hover:border-primary/50'
                        }`}
                    >
                      {getEmoji(skillIcon)}
                    </button>
                  ))}
                </div>
                <Input
                  placeholder="Ou digite emoji"
                  className="bg-background text-xs text-center"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  maxLength={2}
                />
              </div>
              <Button type="submit" variant="mystic" className="w-full text-xs" size="sm">
                Criar Habilidade
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Skills;
