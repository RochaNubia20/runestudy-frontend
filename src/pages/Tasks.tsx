import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Lock, Unlock, Trash2, CheckCircle, Circle } from "lucide-react";
import { toast } from "sonner";
import { CelebrationAnimation } from "@/components/CelebrationAnimation";
import { getEmoji } from "@/constants/emojiMap";
import { UseTasks } from "@/contexts/TaskContext";
import { TaskCreateRequest, TaskResponse } from "@/types/task";
import { blockTask, completeTask, deleteTask, registerTask } from "@/services/taskService";
import { UseSkills } from "@/contexts/SkillContext";

const Tasks = () => {
  const { tasks, refreshTasks } = UseTasks();
  const { skills, refreshSkills } = UseSkills();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [skillName, setSkillName] = useState("");
  const [pendingTasks, setPendingTasks] = useState<TaskResponse[]>(() => tasks.filter(t => t.status !== "completed"));
  const [completedTasks, setCompletedTasks] = useState<TaskResponse[]>(() => tasks.filter(t => t.status === "completed"));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [celebration, setCelebration] = useState<{ type: "task" | "skill-level" | "player-level"; message?: string } | null>(null);

  useEffect(() => {
    setPendingTasks(tasks.filter(t => t.status !== "completed"));
    setCompletedTasks(tasks.filter(t => t.status === "completed"));
  }, [tasks])


  const handleComplete = async (taskId: number) => {
    await completeTask(taskId);
    await refreshTasks();

    const task = tasks.find(t => t.id === taskId);

    setCelebration({ type: "task", message: `+${task.taskXP || 0} XP` });
  };

  const handleToggleLock = async (taskId: number) => {
    await blockTask(taskId);
    await refreshTasks();

    const task = tasks.find(t => t.id === taskId);

    toast.info(task.status === "blocked" ? "Tarefa bloqueada." : "Tarefa desbloqueada.");
  };

  const handleDelete = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      await refreshTasks();
      toast.success("Tarefa excluída!");
    } catch (error) {
      toast.error("Não foi possível excluir tarefa.")
      console.error(error?.response?.data);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !difficulty || !skillName ) {
      toast.error("Preencha todos os campos.");
      return;
    }

    const newTask: TaskCreateRequest = {
      title,
      description,
      difficulty,
      skillName
    }

    try {
      const response = await registerTask(newTask);

      if (response.status === 201) {
        await refreshTasks();
        setIsDialogOpen(false);
        toast.success("Tarefa criada com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao criar tarefa. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <>
      {celebration && (
        <CelebrationAnimation
          type={celebration.type}
          message={celebration.message}
          onComplete={() => setCelebration(null)}
        />
      )}

      <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="mystic-glow">{getEmoji('book')} Tarefas</span>
            </h2>
            <p className="text-muted-foreground text-xs">Organize estudos e ganhe XP</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="mystic" size="sm" onClick={() => setEditingTask(null)}>
                <Plus className="w-4 h-4 mr-1" />
                Nova
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-2 border-primary/30">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold mystic-glow">
                  Nova Tarefa
                </DialogTitle>
              </DialogHeader>
              <form className="space-y-3" onSubmit={handleCreateTask}>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Título</label>
                  <Input
                    placeholder="Ex: Estudar Cálculo I"
                    className="bg-background text-xs"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Descrição</label>
                  <Textarea
                    placeholder="Descreva sua tarefa..."
                    className="bg-background text-xs"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Habilidade</label>
                  <Select value={skillName} onValueChange={(value) => setSkillName(value)}>
                    <SelectTrigger className="bg-background text-xs">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {skills.map(skill => <SelectItem key={skill.id} value={skill.name}>{skill.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Dificuldade</label>
                  <Select value={difficulty} onValueChange={(value) => setDifficulty(value)}>
                    <SelectTrigger className="bg-background text-xs">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Fácil (+20 XP)</SelectItem>
                      <SelectItem value="medium">Médio (+30 XP)</SelectItem>
                      <SelectItem value="hard">Difícil (+50 XP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" variant="mystic" className="w-full text-xs" size="sm">
                  Criar Tarefa
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pending Tasks */}
        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <Circle className="w-4 h-4 text-secondary" />
            Pendentes ({pendingTasks.length})
          </h3>
          <div className="grid gap-3">
            {pendingTasks.map((task) => (
              <Card key={task.id} className="p-4 bg-card border-2 border-border/50 hover:border-primary/30 transition-all pixel-corners">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-bold text-foreground">{task.title}</h4>
                      {task.status === "blocked" && (
                        <Badge variant="outline" className="border-primary/50 text-xs">
                          <Lock className="w-2 h-2 mr-1" />
                          Bloq
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {task.taskXP === 20 && "Fácil"}
                        {task.taskXP === 30 && "Médio"}
                        {task.taskXP === 50 && "Difícil"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs mb-2">{task.description || null }</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-primary font-bold">{getEmoji('quest')} {task.skillName}</span>
                      <span className="text-secondary font-bold">⚡ +{task.taskXP} XP</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleToggleLock(task.id)}
                    >
                      {task.status === "blocked" ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    </Button>
                    <Button
                      variant="mystic"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleComplete(task.id)}
                    >
                      <CheckCircle className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDelete(task.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {pendingTasks.length === 0 && (
              <Card className="p-8 bg-card border-2 border-dashed border-border/50 text-center pixel-corners">
                <p className="text-muted-foreground text-xs">Nenhuma tarefa pendente</p>
              </Card>
            )}
          </div>
        </div>

        {/* Completed Tasks */}
        <div>
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            Concluídas ({completedTasks.length})
          </h3>
          <div className="grid gap-3">
            {completedTasks.map((task) => (
              <Card key={task.id} className="p-4 bg-card/50 border-2 border-primary/20 pixel-corners">
                <div className="flex items-start justify-between gap-3 opacity-60">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-bold text-foreground line-through">{task.title}</h4>
                      <Badge variant="outline" className="border-primary text-xs">
                        <CheckCircle className="w-2 h-2 mr-1" />
                        OK
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs mb-2">{task.description}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-primary font-bold">{getEmoji('quest')} {task.skillName}</span>
                      <span className="text-secondary font-bold">⚡ +{task.taskXP} XP</span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Tasks;
