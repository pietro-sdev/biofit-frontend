"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
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
import { ConfirmDialog } from "@/components/layout/confirm-dialog";

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [userToRemove, setUserToRemove] = useState<any>(null);

  async function fetchUsuarios() {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) return;
      const res = await fetch(`${baseUrl}/users`);
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Erro ao buscar usuários:", errorData);
        toast({ title: "Falha ao buscar usuários" });
        return;
      }
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Erro fetchUsuarios:", error);
      toast({ title: "Erro ao buscar usuários" });
    }
  }

  useEffect(() => {
    fetchUsuarios();
  }, []);

  function formatStatus(status: string): string {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  function calculateRemainingDuration(user: any): string {
    if (!user.durationInMonths || !user.expiresAt) {
      return "Vitalício";
    }
    const now = new Date();
    const expiresAt = new Date(user.expiresAt);
    if (expiresAt < now) {
      return "Expirado";
    }
    const diffMs = expiresAt.getTime() - now.getTime();
    const monthsLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 30));
    return `${monthsLeft} meses restantes`;
  }

  function formatExpirationDate(user: any): string {
    if (!user.expiresAt) {
      return "Vitalício";
    }
    const date = new Date(user.expiresAt);
    return date.toLocaleDateString("pt-BR");
  }

  const filteredUsuarios = usuarios.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.phone.includes(search) ||
    user.status.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
  const paginatedUsuarios = filteredUsuarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  async function handleDeleteUser(userId: string) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) return;
      const res = await fetch(`${baseUrl}/users/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast({ title: "Falha ao deletar usuário" });
        return;
      }
      toast({ title: "Usuário deletado com sucesso" });
      fetchUsuarios();
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      toast({ title: "Erro ao deletar usuário" });
    }
  }

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Usuários</h1>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Buscar por nome, telefone ou status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Pagamento</TableHead>
              <TableHead>Data de Vencimento</TableHead>
              <TableHead>Ações</TableHead>
              <TableHead>Excluir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsuarios.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{formatPhone(user.phone)}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.status.toLowerCase() === "ativo"
                        ? "default"
                        : user.status.toLowerCase() === "inativo"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {formatStatus(user.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.orderDate).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>{formatExpirationDate(user)}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2">
                    Visualizar
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setUserToRemove(user)}
                  >
                    Remover
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {userToRemove && (
        <ConfirmDialog
          title="Confirmar Exclusão"
          description={`Deseja realmente excluir o usuário ${userToRemove.name}?`}
          onConfirm={() => {
            handleDeleteUser(userToRemove.id);
            setUserToRemove(null);
          }}
          onCancel={() => setUserToRemove(null)}
        />
      )}
    </div>
  );
}
