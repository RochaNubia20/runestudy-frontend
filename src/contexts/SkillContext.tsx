import { createContext, useContext, useState, useEffect } from "react";
import { getAllSkillsByUser } from "@/services/skillService";
import type { SkillResponse } from "@/types/skill";
import { UseAuth } from "./AuthContext";

interface SkillContextType {
  skills: SkillResponse[];
  refreshSkills: () => Promise<void>;
}

const SkillContext = createContext<SkillContextType | null>(null);

export const SkillProvider = ({ children }: { children: React.ReactNode }) => {
  const [skills, setSkills] = useState<SkillResponse[]>([]);
  const { user } = UseAuth();

  useEffect(() => {
    refreshSkills();
  }, []);

  const refreshSkills = async () => {
    // debugger;
    try {
      const res = await getAllSkillsByUser(user.id);
      setSkills(res.data);
    } catch (err) {
      console.error("Erro ao carregar skills", err);
    }
  };

  return (
    <SkillContext.Provider value={{ skills, refreshSkills }}>
      {children}
    </SkillContext.Provider>
  );
};

export const UseSkills = () => {
  const ctx = useContext(SkillContext);
  if (!ctx) throw new Error("useSkills precisa estar dentro de <SkillProvider>");
  return ctx;
};
