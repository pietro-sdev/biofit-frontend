"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";

const usuarios = [
  { id: "1", nome: "Carlos Silva", telefone: "(11) 99999-9999", email: "carlos@email.com", status: "Ativo", pagamento: "12/02/2025" },
  { id: "2", nome: "Ana Souza", telefone: "(21) 98888-8888", email: "ana@email.com", status: "Inativo", pagamento: "05/02/2025" },
  { id: "3", nome: "Rafael Lima", telefone: "(31) 97777-7777", email: "rafael@email.com", status: "Pendente", pagamento: "08/02/2025" },
  { id: "4", nome: "Juliana Costa", telefone: "(41) 96666-6666", email: "juliana@email.com", status: "Ativo", pagamento: "10/02/2025" },
  { id: "5", nome: "Mariana Alves", telefone: "(51) 95555-5555", email: "mariana@email.com", status: "Inativo", pagamento: "02/02/2025" },
];

export default function ListaUsuarios() {
  const [search, setSearch] = useState("");

  const filteredUsuarios = usuarios.filter((user) =>
    user.nome.toLowerCase().includes(search.toLowerCase()) ||
    user.telefone.includes(search) ||
    user.status.toLowerCase().includes(search.toLowerCase())
  );

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Ativo":
        return "default";
      case "Inativo":
        return "destructive";
      case "Pendente":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Buscar por nome, telefone ou status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsuarios.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.nome}</TableCell>
              <TableCell>{user.telefone}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={getBadgeVariant(user.status)}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>{user.pagamento}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">Visualizar</Button>
                <Button variant="destructive" size="sm">Remover</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
