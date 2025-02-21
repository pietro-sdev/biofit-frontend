"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "@/hooks/use-toast";
import { formatPhone } from "@/models/Payment";

export default function ListaRemocao() {
  const [search, setSearch] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  async function fetchRemovals() {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) return;
      const res = await fetch(`${baseUrl}/removals`);
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Erro ao buscar remoções:", errorData);
        toast({ title: "Falha ao buscar remoções" });
        return;
      }
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Erro fetchRemovals:", error);
      toast({ title: "Erro ao buscar remoções" });
    }
  }

  useEffect(() => {
    fetchRemovals();
  }, []);

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "default";
      case "Recusado":
        return "destructive";
      case "Pendente":
        return "outline";
      default:
        return "default";
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) return;
      const res = await fetch(`${baseUrl}/removals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast({ title: "Erro", description: errorData.message, variant: "destructive" });
        return;
      }
      setUsuarios((prev) =>
        prev.map((user) => (user.id === id ? { ...user, status: newStatus } : user))
      );
      toast({ title: `Status atualizado para ${newStatus}!` });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast({ title: "Erro ao atualizar status", variant: "destructive" });
    }
  };

  const handleRemoverAprovados = async () => {
    try {
      setUsuarios((prev) => prev.filter((user) => user.status !== "Aprovado"));
      toast({ title: "Usuários aprovados foram removidos!" });
    } catch (error) {
      console.error("Erro ao remover aprovados:", error);
      toast({ title: "Erro ao remover aprovados", variant: "destructive" });
    }
  };

  const filteredUsuarios = usuarios.filter((user) =>
    (user.userName?.toLowerCase().includes(search.toLowerCase()) ||
      user.userPhone.includes(search)) &&
    (statusFiltro === "todos" || user.status === statusFiltro)
  );

  // Paginação
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
  const paginatedUsuarios = filteredUsuarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6">Lista de Remoção de Usuários</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Filtrar Usuários</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Buscar por nome ou telefone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={statusFiltro} onValueChange={setStatusFiltro}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Aprovado">Aprovado</SelectItem>
              <SelectItem value="Recusado">Recusado</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchRemovals}>Atualizar</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuários Marcados para Remoção</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsuarios.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.userName}</TableCell>
                  
                  <TableCell>{formatPhone(user.userPhone)}</TableCell>
                  <TableCell>{user.motivo}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.status === "Pendente" && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          className="mr-2"
                          onClick={() => handleStatusChange(user.id, "Aprovado")}
                        >
                          Aprovar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, "Recusado")}
                        >
                          Recusar
                        </Button>
                      </>
                    )}
                    {user.status !== "Pendente" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(user.id, "Pendente")}
                      >
                        Desfazer
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-4 flex justify-end">
        <Button variant="destructive" disabled onClick={handleRemoverAprovados}>
          Remover Aprovados Agora
        </Button>
      </div>

      {/* Paginação */}
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className="cursor-pointer"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                className="cursor-pointer"
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              className="cursor-pointer"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
