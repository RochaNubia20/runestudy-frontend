import { createContext, useContext, useState, useEffect } from "react";
import { getAllTasksByUser } from "@/services/taskService";
import type { TaskResponse } from "@/types/task";
import { UseAuth } from "./AuthContext";

interface TaskContextType {
  tasks: TaskResponse[];
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const { user } = UseAuth();

  useEffect(() => {
    refreshTasks();
  }, []);

  const refreshTasks = async () => {
    // debugger;
    try {
      const res = await getAllTasksByUser(user.id);
      setTasks(res.data);
    } catch (err) {
      console.error("Erro ao carregar tarefas", err);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, refreshTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const UseTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks precisa estar dentro de <TaskProvider>");
  return ctx;
};
