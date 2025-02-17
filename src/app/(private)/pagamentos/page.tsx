"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Payment, formatPhone } from "@/models/Payment";

export default function TelaPagamentos() {
  const [search, setSearch] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [cursoFiltro, setCursoFiltro] = useState("todos");
  const [pagamentos, setPagamentos] = useState<Payment[]>([]);

  async function fetchPagamentos() {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) return;

      const res = await fetch(`${baseUrl}/payments/history`);
      if (!res.ok) {
        const err = await res.json();
        console.error("Erro ao buscar pagamentos:", err);
        toast({ title: "Falha ao buscar pagamentos" });
        return;
      }
      const data: Payment[] = await res.json();
      setPagamentos(data);
    } catch (error) {
      console.error("Erro fetchPagamentos:", error);
      toast({ title: "Erro ao buscar pagamentos" });
    }
  }

  useEffect(() => {
    fetchPagamentos();
  }, []);

  function getStatusLabel(status: string) {
    switch (status) {
      case "APPROVED":
      case "COMPLETED":
        return "Confirmado";
      case "CANCELED":
        return "Cancelado";
      case "REFUNDED":
        return "Reembolsado";
      default:
        return status;
    }
  }

  function getBadgeVariant(labelStatus: string) {
    switch (labelStatus) {
      case "Confirmado":
        return "default";
      case "Cancelado":
        return "destructive";
      case "Reembolsado":
        return "outline";
      default:
        return "default";
    }
  }

  function getMethodLabel(method: string) {
    switch (method) {
      case "CREDIT_CARD":
        return "Cartão de Crédito";
      case "BOLETO":
        return "Boleto Bancário";
      case "PIX":
        return "Pix";
      default:
        return method;
    }
  }

  function formatAmount(amount: number) {
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR");
  }

  const filteredPagamentos = pagamentos.filter((p) => {
    const labelStatus = getStatusLabel(p.status);
    const searchMatch =
      p.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      p.transaction.toLowerCase().includes(search.toLowerCase());
    const statusMatch = statusFiltro === "todos" || labelStatus === statusFiltro;
    const cursoMatch =
      cursoFiltro === "todos" ||
      p.productName.toLowerCase().includes(cursoFiltro.toLowerCase());
    return searchMatch && statusMatch && cursoMatch;
  });

  return (
    <div className="p-6 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Pagamentos</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Filtrar Pagamentos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Buscar por usuário ou transação"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={statusFiltro} onValueChange={setStatusFiltro}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Confirmado">Confirmado</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
              <SelectItem value="Reembolsado">Reembolsado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={cursoFiltro} onValueChange={setCursoFiltro}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Curso A">Curso A</SelectItem>
              <SelectItem value="Curso B">Curso B</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchPagamentos}>Atualizar</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>E-mail</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPagamentos.map((p) => {
                const labelStatus = getStatusLabel(p.status);
                return (
                  <TableRow key={p.id}>
                    <TableCell>{p.buyerEmail}</TableCell>
                    <TableCell>{formatPhone(p.buyerPhone)}</TableCell>
                    <TableCell>{p.productName}</TableCell>
                    <TableCell>{formatAmount(p.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(labelStatus)}>
                        {labelStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(p.orderDate)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
