"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircleIcon } from "lucide-react";
import Cookies from "js-cookie"; 

export function CreateAdminDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [cargo, setCargo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const user = {
      nome: name,
      roles: cargo,
      email: email,
      senha: password,
    };

    try {
      const token = Cookies.get("token");

      if (!token) {
        throw new Error("Token não encontrado.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/cadastro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar usuário");
      }

      const data = await response.json();
      alert(data.message);
      setOpen(false);

    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Erro ao cadastrar usuário: " + error.message);
      } else {
        alert("Erro desconhecido ao cadastrar usuário.");
      }
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button><PlusCircleIcon /> Adicionar Usuário</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md w-full -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
          <Dialog.Title className="text-lg font-bold">
            Cadastrar Administrador
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-600">
            Preencha os dados para cadastrar um novo administrador.
          </Dialog.Description>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium">
                Nome
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="cargo" className="block text-sm font-medium">
                Cargo
              </Label>
              <Select value={cargo} onValueChange={(value) => setCargo(value)}>
                <SelectTrigger id="cargo">
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">
                    Administrador
                  </SelectItem>
                  <SelectItem value="ESTOQUISTA">Estoquista</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Dialog.Close asChild>
                <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
              </Dialog.Close>
              <Button type="submit">Cadastrar</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
