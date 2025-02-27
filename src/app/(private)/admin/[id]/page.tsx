"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Calendar, Briefcase } from "lucide-react";

// Dados fictícios para administradores, com cargo "Administrador" ou "Atendente"
const dummyAdmins = [
  { id: "1", name: "Alice", email: "alice@example.com", createdAt: "2023-01-01T12:00:00Z", cargo: "Administrador" },
  { id: "2", name: "Bob", email: "bob@example.com", createdAt: "2023-02-01T12:00:00Z", cargo: "Atendente" },
  { id: "3", name: "Carol", email: "carol@example.com", createdAt: "2023-03-01T12:00:00Z", cargo: "Atendente" },
  { id: "4", name: "Dave", email: "dave@example.com", createdAt: "2023-04-01T12:00:00Z", cargo: "Atendente" },
  { id: "5", name: "Eve", email: "eve@example.com", createdAt: "2023-05-01T12:00:00Z", cargo: "Atendente" },
  { id: "6", name: "Frank", email: "frank@example.com", createdAt: "2023-06-01T12:00:00Z", cargo: "Atendente" },
  { id: "7", name: "Grace", email: "grace@example.com", createdAt: "2023-07-01T12:00:00Z", cargo: "Atendente" },
];

export default function AdminDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);

  // Estados para os campos editáveis
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [password, setPassword] = useState("");
  // Estado para controle de usuário ativo/inativo (true = ativo)
  const [active, setActive] = useState(true);

  useEffect(() => {
    const foundAdmin = dummyAdmins.find((a) => a.id === id);
    if (foundAdmin) {
      setAdmin(foundAdmin);
      setName(foundAdmin.name);
      setEmail(foundAdmin.email);
      setCargo(foundAdmin.cargo);
    } else {
      // Se o administrador não for encontrado, redireciona de volta para a lista
      router.push("/administradores");
    }
  }, [id, router]);

  if (!admin) {
    return (
      <div className="flex items-center justify-center h-screen">
        Carregando...
      </div>
    );
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  }

  function handleSave() {
    // Aqui você pode implementar a lógica para salvar os dados editados
    alert("Dados salvos com sucesso!");
  }

  function handleToggleActive() {
    const newStatus = !active;
    setActive(newStatus);
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Detalhes do Administrador</h1>
      <div className="space-y-6">
        <div>
          <Label htmlFor="name" className="flex items-center gap-2 text-xl mb-2">
            <User size={20} className="text-gray-600" />
            Nome
          </Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="email" className="flex items-center gap-2 text-xl mb-2">
            <Mail size={20} className="text-gray-600" />
            Email
          </Label>
          <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="createdAt" className="flex items-center gap-2 text-xl mb-2">
            <Calendar size={20} className="text-gray-600" />
            Criado em
          </Label>
          <Input id="createdAt" defaultValue={formatDate(admin.createdAt)} disabled />
        </div>
        <div>
          <Label htmlFor="cargo" className="flex items-center gap-2 text-xl mb-2">
            <Briefcase size={20} className="text-gray-600" />
            Cargo
          </Label>
          <Select value={cargo} onValueChange={(value) => setCargo(value)}>
            <SelectTrigger id="cargo">
              <SelectValue placeholder="Selecione o cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Administrador">Administrador</SelectItem>
              <SelectItem value="Atendente">Atendente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="password" className="flex items-center gap-2 text-xl mb-2">
            Alterar senha
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Digite uma nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-6 flex gap-4">
        <Button onClick={handleSave}>Salvar</Button>
        <Button variant="secondary" onClick={() => router.back()}>
          Voltar
        </Button>
        <Button
          variant={active ? "destructive" : "default"}
          className={!active ? "bg-green-500 hover:bg-green-600 text-white" : ""}
          onClick={handleToggleActive}
        >
          {active ? "Inativar usuário" : "Ativar usuário"}
        </Button>
      </div>
    </div>
  );
}
