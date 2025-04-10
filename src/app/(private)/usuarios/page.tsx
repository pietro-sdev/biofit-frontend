"use client";

import { useState, useEffect } from "react";
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

export default function AdministradoresPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [adminToRemove, setAdminToRemove] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`);
        if (!response.ok) {
          throw new Error("Erro ao buscar administradores");
        }
        const data = await response.json();
        setAdmins(data);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os administradores.",
          variant: "destructive",
        });
      }
    };

    fetchAdmins();
  }, []);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  }

  const filteredAdmins = admins.filter((admin) =>
    admin.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatRole = (role: string) => {
    switch (role) {
      case "CLIENTE":
        return "Cliente";
      case "ESTOQUISTA":
        return "Estoquista";
      case "ADMIN":
        return "Administrador";
      default:
        return role;
    }
  };

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
              <TableHead>Visualizar</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAdmins.map((admin) => (
              <TableRow
                key={admin.id}
                onClick={() => router.push(`/usuarios/${admin.id}`)} 
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/usuarios/${admin.id}`); 
                    }}
                  >
                    Visualizar
                  </Button>
                </TableCell>
                <TableCell>{formatRole(admin.roles)}</TableCell>
                <TableCell>
                  <Badge variant={admin.ativo ? "secondary" : "destructive"}>
                    {admin.ativo ? "Ativo" : "Inativo"}
                  </Badge>
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

    </div>
  );
}
