import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UserCreateRequest } from "@/types/user";
import { toast } from "sonner";
import { Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/services/userService";
import { UseAuth } from "@/contexts/AuthContext";

export const AuthForm = () => {
  const { login } = UseAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (!username || !password) {
        toast.error("Preencha o email/nickname e a senha.");
        return;
      }
    } else {
      if (!name || !nickname || !email || !password || !confirmPassword) {
        toast.error("Preencha todos os campos para cadastro.");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("As senhas não coincidem.");
        return;
      }

      const newUser: UserCreateRequest = {
        name,
        nickname,
        email,
        password
      };

      try {
        const response = await registerUser(newUser);

        if (response.status === 200) {
          toast.success("Conta criada com sucesso!");
        }
      } catch (error: any) {
        if (error?.response?.status === 409) {
          toast.error("Email ou nickname já existem.");
        } else {
          toast.error("Erro ao criar conta. Tente novamente.");
        }
        console.error(error);
      }
    }
    try {
      if (isLogin) {
        await login({username, password });
      } else {
        await login({username: email, password });
      }
      toast.success("Login realizado com sucesso!");
      setTimeout(() => navigate("/dashboard"), 1000);

    } catch (error) {
      toast.error("Não foi possível realizar login.")
      console.error(error);
    }
  };

  return (
    <Card className="p-8 bg-card border-2 border-primary/40 shadow-[0_0_30px_hsl(var(--primary)/0.2)] max-w-md w-full">
      <h2 className="text-2xl font-bold text-center mb-6 mystic-glow">
        {isLogin ? "Cadastro/Login" : "Criar Conta"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isLogin ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email ou Nickname
            </label>
            <Input
              type="text"
              placeholder="email ou usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-input border-border focus:border-primary"
              required
            />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Nome
              </label>
              <Input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-input border-border focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Nickname
              </label>
              <Input
                type="text"
                placeholder="seu_nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="bg-input border-border focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input border-border focus:border-primary"
                required
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Senha
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-input border-border focus:border-primary"
            required
          />
        </div>

        {!isLogin && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Confirmar Senha
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-input border-border focus:border-primary"
              required
            />
          </div>
        )}

        <div className="space-y-3 pt-2">
          <Button type="submit" variant="default" size="lg" className="w-full">
            {isLogin ? "Login" : "Cadastre-se"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Cadastre-se" : "Login"}
          </Button>
        </div>
      </form>

    </Card>
  );
};
