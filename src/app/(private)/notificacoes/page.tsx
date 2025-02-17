"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

type Notification = {
  id: string;
  type: string;   
  message: string;
  status: string;  
  createdAt: string; 
};

export default function Notificacoes() {
  const [search, setSearch] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [notificacoesLista, setNotificacoesLista] = useState<Notification[]>([]);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  async function fetchNotificacoes() {
    if (!baseUrl) return;
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (tipoFiltro !== "todos") params.set("type", tipoFiltro);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications?${params.toString()}`);
      if (!res.ok) {
        const err = await res.json();
        console.error("Erro ao buscar notificações:", err);
        return;
      }
      const data = await res.json();
      setNotificacoesLista(data);
    } catch (error) {
      console.error("Erro fetchNotificacoes:", error);
    }
  }

  useEffect(() => {
    fetchNotificacoes();
  }, [search, tipoFiltro]);

  // Determina a cor do badge de acordo com o tipo
  const getBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case "Pagamento":
        return "default";
      case "Erro":
        return "destructive";
      case "Entrada":
        return "outline";
      case "Remoção":
        return "secondary";
      default:
        return "default";
    }
  };

  const marcarComoLido = async (id: string) => {
    if (!baseUrl) return;
    try {
      const res = await fetch(`${baseUrl}/notifications/${id}/mark-read`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const err = await res.json();
        console.error("Erro ao marcar notificação como lida:", err);
        toast({ title: "Falha ao marcar como lida" });
        return;
      }
      toast({ 
        title: "Notificação marcada como lida!", 
        variant:"success"
      });
      // Recarregar a lista
      fetchNotificacoes();
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
      toast({ 
        title: "Erro ao marcar como lida", 
        variant: "destructive"
      });
    }
  };

  const limparNotificacoes = async () => {
    if (!baseUrl) return;
    try {
      const res = await fetch(`${baseUrl}/notifications`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        console.error("Erro ao limpar notificações:", err);
        return;
      }
      toast({ 
        title: "Todas as notificações foram removidas!",
        variant: "success" 
      });
      // Esvaziar a lista local
      setNotificacoesLista([]);
    } catch (error) {
      console.error("Erro ao limpar notificacoes:", error);
    }
  };

  // Filtrar client-side adicional se quiser.
  // Mas aqui estamos usando query params no backend.

  return (
    <div className="p-6 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notificações do Sistema</h1>

      {/* Filtros */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Filtrar Notificações</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Buscar por mensagem"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Pagamento">Pagamentos</SelectItem>
              <SelectItem value="Entrada">Entradas</SelectItem>
              <SelectItem value="Remoção">Remoções</SelectItem>
              <SelectItem value="Erro">Erros</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchNotificacoes}>Atualizar</Button>
        </CardContent>
      </Card>

      {/* Tabela de Notificações */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Mensagem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notificacoesLista.map((notif) => (
                <TableRow key={notif.id}>
                  <TableCell>{new Date(notif.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(notif.type)}>
                      {notif.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{notif.message}</TableCell>
                  <TableCell>{notif.status}</TableCell>
                  <TableCell>
                    {notif.status === "Não lido" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => marcarComoLido(notif.id)}
                      >
                        Marcar como Lido
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Botão para Limpar Notificações */}
      <div className="mt-4 flex justify-end">
        <Button variant="destructive" onClick={limparNotificacoes}>
          Limpar Todas
        </Button>
      </div>
    </div>
  );
}
