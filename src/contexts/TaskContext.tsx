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
    try {
      const response = await getAllTasksByUser(user.id);
      setTasks(response.data);
    } catch (error) {
      console.error(error?.response?.data);
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
