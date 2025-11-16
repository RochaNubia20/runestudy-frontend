import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AuthForm = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (!identifier || !password) {
        toast.error("Preencha o email/nickname e a senha.");
        return;
      }

      toast.success("Login realizado com sucesso!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
      return;
    }

    if (!nickname || !email || !password || !confirmPassword) {
      toast.error("Preencha todos os campos para cadastro.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    toast.success("Conta criada com sucesso!");
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
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
              placeholder="seu@email.com ou seu_nickname"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="bg-input border-border focus:border-primary"
              required
            />
          </div>
        ) : (
          <>
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
