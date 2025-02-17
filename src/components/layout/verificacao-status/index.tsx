"use client";
import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type StatusType = "pendente" | "em_andamento" | "sucesso" | "erro";

export default function VerificacaoStatus() {
  const [status, setStatus] = useState<StatusType>("pendente");
  const [ultimaVerificacao, setUltimaVerificacao] = useState<Date | null>(null);

  useEffect(() => {
    fetchLastVerification();
  }, []);

  async function fetchLastVerification() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/automation/last-verification`);
      if (!res.ok) {
        console.error("Erro ao buscar última verificação");
        return;
      }
      const data = await res.json();
      if (data.verifiedAt) {
        setUltimaVerificacao(new Date(data.verifiedAt));
      }
      if (data.status) {
        setStatus(data.status);
      } else {
        setStatus("pendente");
      }
    } catch (err) {
      console.error("Erro no fetchLastVerification:", err);
    }
  }

  function getStatusIcon() {
    if (status === "em_andamento") {
      return {
        icon: <RefreshCw className="animate-spin text-blue-600" />,
        text: "Em Andamento",
        color: "text-blue-600",
      };
    }
    if (status === "sucesso") {
      return {
        icon: <CheckCircle className="text-green-600" />,
        text: "Sucesso",
        color: "text-green-600",
      };
    }
    if (status === "erro") {
      return {
        icon: <XCircle className="text-red-600" />,
        text: "Erro",
        color: "text-red-600",
      };
    }
    return {
      icon: <AlertTriangle className="text-yellow-600" />,
      text: "Pendente",
      color: "text-yellow-600",
    };
  }

  async function handleExecutarAgora() {
    setStatus("em_andamento");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) {
        console.error("NEXT_PUBLIC_API_URL não definida");
        setStatus("erro");
        return;
      }

      const response = await fetch(`${baseUrl}/automation/run`, {
        method: "POST",
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: "Erro desconhecido (resposta não era JSON)" };
        }
        console.error("Erro na automação:", errorData);
        setStatus("erro");
        return;
      }

      const data = await response.json();
      console.log("Automação executada com sucesso:", data);

      setStatus(data.status || "pendente");
      setUltimaVerificacao(new Date());

      fetchLastVerification();
    } catch (err) {
      console.error("Erro ao executar automação:", err);
      setStatus("erro");
    }
  }

  const ultimaVerificacaoTexto = ultimaVerificacao
    ? formatDistanceToNow(ultimaVerificacao, { addSuffix: true, locale: ptBR })
    : "Nunca verificado";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Última Verificação de Membros</CardTitle>
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {getStatusIcon().icon}
          <div>
            <p className={`font-semibold ${getStatusIcon().color}`}>
              {getStatusIcon().text}
            </p>
            <p className="text-sm text-gray-500">
              Última verificação: {ultimaVerificacaoTexto}
            </p>
          </div>
        </div>

        <Button variant="outline" className="flex items-center gap-2" onClick={handleExecutarAgora}>
          <RefreshCw size={16} />
          Executar Agora
        </Button>
      </CardContent>
    </Card>
  );
}
