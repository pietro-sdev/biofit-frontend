"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeClosedIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type LoginRequest = {
  email: string;
  senha: string;
};

type LoginResponse = {
  token: string;
  email: string;
  role: string;
};

export default function FormLogin() {
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    senha: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast(); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas!");
      }

      const data: LoginResponse = await response.json();

      Cookies.set("token", data.token, { expires: 7 });
      Cookies.set("role", data.role, { expires: 7 });
      Cookies.set("email", data.email, { expires: 7 });

      toast({
        title: "Login realizado!",
        description: "Redirecionando para o painel...",
        variant: "success",
      });

      setTimeout(() => {
        window.location.href = "/backoffice";
      }, 1000);
    } catch (err) {
      toast({
        title: "Erro no login",
        description: "E-mail ou senha incorretos!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center leading-snug">Faça seu login!</h2>
        <p className="text-gray-500 text-center">
          Acesse seu painel administrativo do sistema Biofit.
        </p>

        <div>
          <Label>E-mail</Label>
          <Input
            type="email"
            name="email"
            placeholder="Digite seu e-mail"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label>Senha</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="senha"
              placeholder="Digite sua senha"
              value={formData.senha}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={20} /> : <EyeClosedIcon size={20} />}
            </button>
          </div>
        </div>

        <Button className="w-full" onClick={handleLogin} disabled={loading}>
          {loading ? "Aguarde..." : "Login"}
        </Button>
      </CardContent>
    </Card>
  );
}
