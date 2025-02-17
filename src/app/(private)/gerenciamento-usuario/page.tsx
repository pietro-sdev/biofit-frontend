"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

// Importa a função formatPhone do modelo Payment
import { formatPhone } from "@/models/Payment";

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  // Função para formatar o status: garante que "ativo" fique "Ativo"
  function formatStatus(status: string): string {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  const filteredUsuarios = usuarios.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.phone.includes(search) ||
    user.status.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
  const paginatedUsuarios = filteredUsuarios.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                <TableCell>{new Date(user.orderDate).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2">
                    Visualizar
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm">
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
            <PaginationPrevious onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink onClick={() => setCurrentPage(index + 1)} isActive={currentPage === index + 1}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
