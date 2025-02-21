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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/layout/confirm-dialog";
import { CreateAdminDialog } from "@/components/layout/admin-dialog";

export default function AdministradoresPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [adminToRemove, setAdminToRemove] = useState<any>(null);

  async function fetchAdmins() {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) return;
      const res = await fetch(`${baseUrl}/admins-list`);
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Erro ao buscar administradores:", errorData);
        toast({ title: "Falha ao buscar administradores" });
        return;
      }
      const data = await res.json();
      setAdmins(data);
    } catch (error) {
      console.error("Erro fetchAdmins:", error);
      toast({ title: "Erro ao buscar administradores" });
    }
  }

  useEffect(() => {
    fetchAdmins();
  }, []);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  }

  const filteredAdmins = admins.filter((admin) =>
    admin.name.toLowerCase().includes(search.toLowerCase()) ||
    admin.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  async function handleDeleteAdmin(adminId: string) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) return;
      const res = await fetch(`${baseUrl}/admins/${adminId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast({ title: "Falha ao deletar administrador", variant:"destructive" });
        return;
      }
      toast({ title: "Administrador deletado com sucesso", variant:"success"});
      fetchAdmins();
    } catch (error) {
      console.error("Erro ao deletar administrador:", error);
      toast({ title: "Erro ao deletar administrador" });
    }
  }

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Gerenciamento de Administradores</h1>
        <CreateAdminDialog />
      </div>
      <Input
        placeholder="Buscar por nome ou email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-1/3 mb-4"
      />
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Visualizar</TableHead>
              <TableHead>Excluir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAdmins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{formatDate(admin.createdAt)}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2">
                    Visualizar
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setAdminToRemove(admin)}
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
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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

      {adminToRemove && (
        <ConfirmDialog
          title="Confirmar Exclusão"
          description={`Deseja realmente excluir o administrador ${adminToRemove.name}?`}
          onConfirm={() => {
            handleDeleteAdmin(adminToRemove.id);
            setAdminToRemove(null);
          }}
          onCancel={() => setAdminToRemove(null)}
        />
      )}
    </div>
  );
}
