"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeClosedIcon } from "lucide-react";

export default function FormLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/admin");
      setLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center leading-snug">Faça seu login!</h2>
        <p className="text-gray-500 text-center">
          Faça login para gerenciar seus usuários e ficar conectado com usuários validados e trapaceiros.
        </p>

        <div>
          <Label>E-mail</Label>
          <Input
            type="email"
            name="email"
            placeholder="Digite seu e-mail aqui..."
          />
        </div>

        <div className="relative">
          <Label>Senha</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Digite sua senha aqui..."
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
