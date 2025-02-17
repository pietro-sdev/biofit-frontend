"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function Configuracoes() {
  const [periodoVerificacao, setPeriodoVerificacao] = useState("10");
  const [customPeriodo, setCustomPeriodo] = useState("");
  const [metodoEnvio, setMetodoEnvio] = useState("whatsapp");
  const [remocaoAutomatica, setRemocaoAutomatica] = useState(true);
  const [aprovacaoManual, setAprovacaoManual] = useState(false);

  const salvarConfiguracoes = () => {
    toast({
      title: "Configurações salvas com sucesso!",
      description: "As alterações foram aplicadas com êxito.",
    });
  };

  return (
    <div className="p-6 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6">Configurações da Automação</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Remoção Automática</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <span className="text-muted-foreground text-md">Ativar remoção automática?</span>
          <Switch checked={remocaoAutomatica} onCheckedChange={setRemocaoAutomatica} />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Aprovação Manual Antes da Remoção</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <span className="text-muted-foreground text-md">Exigir aprovação manual antes de remover usuários?</span>
          <Switch checked={aprovacaoManual} onCheckedChange={setAprovacaoManual} />
        </CardContent>
      </Card>

      <Button className="w-full" onClick={salvarConfiguracoes}>
        Salvar Configurações
      </Button>
    </div>
  );
}
