"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";

const dummyAdmins = [
  {
    id: "1",
    name: "Alice",
    email: "alice@example.com",
    createdAt: "2023-01-01T12:00:00Z",
    cargo: "Administrador",
    active: true,
  },
  {
    id: "2",
    name: "Bob",
    email: "bob@example.com",
    createdAt: "2023-02-01T12:00:00Z",
    cargo: "Atendente",
    active: false,
  },
  {
    id: "3",
    name: "Carol",
    email: "carol@example.com",
    createdAt: "2023-03-01T12:00:00Z",
    cargo: "Atendente",
    active: true,
  },
  {
    id: "4",
    name: "Dave",
    email: "dave@example.com",
    createdAt: "2023-04-01T12:00:00Z",
    cargo: "Atendente",
    active: true,
  },
  {
    id: "5",
    name: "Eve",
    email: "eve@example.com",
    createdAt: "2023-05-01T12:00:00Z",
    cargo: "Atendente",
    active: false,
  },
  {
    id: "6",
    name: "Frank",
    email: "frank@example.com",
    createdAt: "2023-06-01T12:00:00Z",
    cargo: "Atendente",
    active: true,
  },
  {
    id: "7",
    name: "Grace",
    email: "grace@example.com",
    createdAt: "2023-07-01T12:00:00Z",
    cargo: "Atendente",
    active: true,
  },
];

export default function AdministradoresPage() {
  const [admins, setAdmins] = useState<any[]>(dummyAdmins);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [adminToRemove, setAdminToRemove] = useState<any>(null);
  const router = useRouter();

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
    setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== adminId));
    toast({ title: "Administrador deletado com sucesso", variant: "success" });
  }

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Gerenciamento de Usuários</h1>
        <CreateAdminDialog />
      </div>
      <Input
        placeholder="Buscar por email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-1/3 mb-4"
      />
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Visualizar</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Excluir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAdmins.map((admin) => (
              <TableRow
                key={admin.id}
                onClick={() => router.push(`/admin/${admin.id}`)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell>{admin.email}</TableCell>
                <TableCell>{formatDate(admin.createdAt)}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/admin/${admin.id}`);
                    }}
                  >
                    Visualizar
                  </Button>
                </TableCell>
                <TableCell>{admin.cargo}</TableCell>
                <TableCell>
                  <Badge variant={admin.active ? "secondary" : "destructive"}>
                    {admin.active ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAdminToRemove(admin);
                    }}
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
