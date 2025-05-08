"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircleIcon } from "lucide-react";
import Cookies from "js-cookie";
import { maskBRLInput, parseBRLToNumber } from "@/utils/formatCurrency";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface CreateProductDialogProps {
  onCreateSuccess?: () => void;
}

export function CreateProductDialog({ onCreateSuccess }: CreateProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState<number>(0);
  const [valorMasked, setValorMasked] = useState<string>("");
  const [avaliacao, setAvaliacao] = useState<number>(0);
  const [descricao, setDescricao] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const produto = {
      codigo,
      nome,
      quantidade,
      valor: parseBRLToNumber(valorMasked),
      avaliacao,
      descricao,
    };

    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Token não encontrado.");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(produto),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao cadastrar produto");
      }

      toast({
        title: "Sucesso",
        description: "Produto cadastrado com sucesso!",
        variant: "success",
      });

      router.push(`/produtos/${data.id}/imagens`);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro desconhecido ao cadastrar produto.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Adicionar Produto
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[90vh] overflow-y-auto max-w-md w-full -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
          <Dialog.Title className="text-lg font-bold">Cadastrar Produto</Dialog.Title>
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
                maxLength={50}
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
                maxLength={200}
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
                type="text"
                inputMode="numeric"
                value={valorMasked}
                onChange={(e) => setValorMasked(maskBRLInput(e.target.value))}
                placeholder="R$ 0,00"
                required
              />
            </div>
            <div>
              <Label htmlFor="avaliacao">Avaliação (0.5 a 5)</Label>
              <Input
                id="avaliacao"
                type="number"
                min={0.5}
                max={5}
                step={0.5}
                value={avaliacao}
                onChange={(e) => setAvaliacao(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                maxLength={2000}
                placeholder="Descrição detalhada do produto"
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
