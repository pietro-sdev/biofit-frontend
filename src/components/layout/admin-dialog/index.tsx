"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreateAdminDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [cargo, setCargo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) return;
    try {
      const res = await fetch(`${baseUrl}/admins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, cargo }),
      });
      if (!res.ok) {
        toast({ title: "Falha ao cadastrar administrador" });
        return;
      }
      toast({ title: "Administrador cadastrado com sucesso" });
      // Limpa os campos e fecha o modal
      setName("");
      setCargo("");
      setEmail("");
      setPassword("");
      setOpen(false);
    } catch (error) {
      console.error("Erro ao cadastrar administrador:", error);
      toast({ title: "Erro ao cadastrar administrador" });
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>Adicionar Administrador</Button>
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
                  <SelectItem value="Administrador">
                    Administrador
                  </SelectItem>
                  <SelectItem value="Atendente">Atendente</SelectItem>
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
