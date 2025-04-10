"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Briefcase } from "lucide-react";
import Cookies from "js-cookie"; 

export default function AdminDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState(""); 
  const [password, setPassword] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = Cookies.get("token");  
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar administrador");
        }
        const data = await response.json();
        setAdmin(data);
        setName(data.nome);
        setEmail(data.email);
        setCargo(data.roles);
        setActive(data.ativo);
      } catch (error) {
        console.error("Erro ao buscar administrador: ", error);
      }
    };

    if (id) {
      fetchAdmin();
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

  const handleSave = async () => {
    const updatedUser = {
      nome: name,
      email: email,
      roles: cargo,
      senha: password,  
      ativo: active, 
    };

    try {
      const token = Cookies.get("token");  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar usuário");
      }

      const data = await response.json();
      alert("Usuário atualizado com sucesso!");
      router.push("/usuarios"); 
    } catch (error: any) {
      alert("Erro ao atualizar usuário: " + error.message);
    }
  };

  const handleToggleActive = () => {
    setActive((prevState) => !prevState);
  };

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
          <Label htmlFor="cargo" className="flex items-center gap-2 text-xl mb-2">
            <Briefcase size={20} className="text-gray-600" />
            Cargo
          </Label>
          <Select value={cargo} onValueChange={(value) => setCargo(value)}>
            <SelectTrigger id="cargo">
              <SelectValue placeholder="Selecione o cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Administrador</SelectItem>
              <SelectItem value="CLIENTE">Cliente</SelectItem> 
              <SelectItem value="ESTOQUISTA">Estoquista</SelectItem>
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
