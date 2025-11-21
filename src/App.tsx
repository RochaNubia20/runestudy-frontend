import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Skills from "./pages/Skills";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AppLayout } from "./components/AppLayout";
import { AvatarProvider } from "./contexts/AvatarContext";
import { SkillProvider } from "./contexts/SkillContext";
import { TaskProvider } from "./contexts/TaskContext";
import { UseAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  const { user, loading } = UseAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={loading ? (<div>Carregando...</div>) : user ?
                (<AvatarProvider>
                  <SkillProvider>
                    <TaskProvider>
                      <Dashboard />
                    </TaskProvider>
                  </SkillProvider>
                </AvatarProvider>) : <Navigate to="/" />
              } />
              <Route path="/tasks" element={loading ? (<div>Carregando...</div>) : user ?
                (<SkillProvider>
                  <TaskProvider>
                    <Tasks />
                  </TaskProvider>
                </SkillProvider>) : <Navigate to="/" />
              } />
              <Route path="/skills" element={loading ? (<div>Carregando...</div>) : user ?
                (<SkillProvider>
                  <TaskProvider>
                    <Skills />
                  </TaskProvider>
                </SkillProvider>) : <Navigate to="/" />
              } />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
};

export default App;
