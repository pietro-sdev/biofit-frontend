"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ValidarAcesso() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [token, setToken] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [groupLink, setGroupLink] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) setToken(tokenFromUrl);
  }, [searchParams]);

  const handleValidation = async () => {
    if (!token.trim()) {
      toast({
        title: "Erro",
        description: "O token é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/token/validate/${token}`
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Token inválido");

      setIsValid(true);
      if (data.groupLink) {
        setGroupLink(data.groupLink);
      } else {
        throw new Error("Nenhum link de grupo retornado pela API.");
      }

      toast({
        title: "Sucesso!",
        description: "Token validado com sucesso!",
        variant: "success",
      });
    } catch (error) {
      setIsValid(false);
      setGroupLink(null);
      toast({
        title: "Erro",
        description: "Erro na validação",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">Validar Acesso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-500 text-center">
            Insira seu token de acesso para entrar no grupo do WhatsApp.
          </p>
          <Input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Cole seu token aqui..."
          />
          <Button onClick={handleValidation} className="w-full" disabled={loading}>
            {loading ? "Validando..." : "Validar Token"}
          </Button>
          {isValid === false && (
            <p className="text-red-500 text-center">Token inválido. Tente novamente.</p>
          )}
          {isValid && groupLink && (
            <div className="text-center">
              <p className="text-green-600 font-semibold">Token válido!</p>
              <a href={groupLink} target="_blank" rel="noopener noreferrer">
                <Button className="mt-4 w-full bg-green-600 hover:bg-green-700">
                  Entrar no Grupo
                </Button>
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
