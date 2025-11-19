import { createContext, useContext, useState, useEffect } from "react";
import { getAllAvatars } from "@/services/storeService";
import type { AvatarResponse } from "@/types/avatar";

interface AvatarContextType {
  avatars: AvatarResponse[];
  refreshAvatars: () => Promise<void>;
}

const AvatarContext = createContext<AvatarContextType | null>(null);

export const AvatarProvider = ({ children }: { children: React.ReactNode }) => {
  const [avatars, setAvatars] = useState<AvatarResponse[]>([]);

  useEffect(() => {
    refreshAvatars();
  }, []);

  const refreshAvatars = async () => {
    try {
      const res = await getAllAvatars();
      setAvatars(res.data);
    } catch (err) {
      console.error("Erro ao carregar avatares", err);
    }
  };

  return (
    <AvatarContext.Provider value={{ avatars, refreshAvatars }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const UseAvatars = () => {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error("useAvatars precisa estar dentro de <AvatarProvider>");
  return ctx;
};
