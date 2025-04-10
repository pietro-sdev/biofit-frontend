"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircleIcon } from "lucide-react";
import Cookies from "js-cookie";

export function CreateProductDialog() {
  const [open, setOpen] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState<number>(0);
  const [valor, setValor] = useState<number>(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const produto = {
      codigo,
      nome,
      quantidade,
      valor,
    };

    try {
      const token = Cookies.get("token");

      if (!token) {
        throw new Error("Token não encontrado.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(produto),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar produto");
      }

      const data = await response.json();
      alert(data.message);
      setOpen(false);
      // Limpa os campos após o cadastro
      setCodigo("");
      setNome("");
      setQuantidade(0);
      setValor(0);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Erro ao cadastrar produto: " + error.message);
      } else {
        alert("Erro desconhecido ao cadastrar produto.");
      }
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button><PlusCircleIcon /> Adicionar Produto</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md w-full -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
          <Dialog.Title className="text-lg font-bold">
            Cadastrar Produto
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-600">
            Preencha os dados para cadastrar um novo produto.
          </Dialog.Description>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ex: P123"
                required
              />
            </div>
            <div>
              <Label htmlFor="nome">Nome do Produto</Label>
              <Input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome do produto"
                required
              />
            </div>
            <div>
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                placeholder="Quantidade em estoque"
                required
              />
            </div>
            <div>
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(Number(e.target.value))}
                placeholder="Preço do produto"
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
