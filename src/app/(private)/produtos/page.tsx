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
import { Badge } from "@/components/ui/badge";
import { CreateProductDialog } from "@/components/layout/product-dialog";
import { formatToBRL } from "@/utils/formatCurrency";
import Cookies from "js-cookie";
import { useUserStore } from "@/store/userStore";


export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [produtoToRemove, setProdutoToRemove] = useState<any>(null);
  const router = useRouter();
  const token = Cookies.get("token"); 
  const role = useUserStore((state) => state.role);


  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos`);
      if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
      }
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      });
    }
  };

  const handleReativar = async (id: string) => {
    const token = Cookies.get("token");
    if (!token) return;
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos/${id}/alternar-status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
  
      if (!response.ok) throw new Error();
  
      toast({
        title: "Sucesso",
        description: "Produto reativado com sucesso.",
      });
  
      fetchProdutos();
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao reativar produto.",
        variant: "destructive",
      });
    }
  };
  

  const handleInativar = async () => {
    const token = Cookies.get("token");
    if (!produtoToRemove || !token) return;
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/produtos/${produtoToRemove.id}/alternar-status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) throw new Error();
  
      toast({
        title: "Produto inativado",
        description: `Produto "${produtoToRemove.nome}" foi inativado.`,
      });
  
      setProdutoToRemove(null);
      fetchProdutos();
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao inativar o produto.",
        variant: "destructive",
      });
    }
  };
  

  const filteredProdutos = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProdutos.length / itemsPerPage);
  const paginatedProdutos = filteredProdutos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatStatus = (status: boolean) => (status ? "Ativo" : "Desativado");

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Gerenciamento de Produtos</h1>
        {role === "ADMIN" && (
        <CreateProductDialog />
      )}
      </div>
      <Input
        placeholder="Buscar por nome do produto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-1/3 mb-4"
      />
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              {role === "ADMIN" && (
              <TableHead>Visualizar</TableHead>
            )}
            {role === "ADMIN" && (
              <TableHead>Alterar</TableHead>
            )}
            {role === "ADMIN" && (
              <TableHead>Ação</TableHead>
            )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProdutos.map((produto) => (
              <TableRow
                key={produto.id}
                onClick={() => router.push(`/produtos/${produto.id}`)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell>{produto.codigo}</TableCell>
                <TableCell>{produto.nome}</TableCell>
                <TableCell>{produto.quantidade}</TableCell>
                <TableCell>{formatToBRL(produto.valor)}</TableCell>
                <TableCell>
                  <Badge variant={produto.ativo ? "secondary" : "destructive"}>
                    {formatStatus(produto.ativo)}
                  </Badge>
                </TableCell>
                {role === "ADMIN" && (
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/produtos/${produto.id}`);
                    }}
                  >
                    Visualizar
                  </Button>
                </TableCell>
                 )}
                 {role === "ADMIN" && (
                <TableCell>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/produtos/${produto.id}/editar`);
                    }}
                  >
                    Alterar
                  </Button>
                </TableCell>
                )}
                {role === "ADMIN" && (
                <TableCell>
                  {produto.ativo ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProdutoToRemove(produto);
                      }}
                    >
                      Inativar
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReativar(produto.id);
                      }}
                    >
                      Reativar
                    </Button>
                  )}
                </TableCell>
                 )}
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

      {produtoToRemove && (
      <ConfirmDialog
        title="Deseja inativar este produto?"
        description={`Tem certeza que deseja inativar o produto "${produtoToRemove.nome}"?`}
        onConfirm={handleInativar}
        onCancel={() => setProdutoToRemove(null)}
      />
    )}
    </div>
  );
}
