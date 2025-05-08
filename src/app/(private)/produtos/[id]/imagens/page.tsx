'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import Cookies from 'js-cookie';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Imagem {
id: string;
caminho: string; 
nome: string;
diretorio: string;
principal: boolean;
}
  

export default function ImagensPage() {
  const { id } = useParams();
  const router = useRouter();
  const [imagens, setImagens] = useState<Imagem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [arquivo, setArquivo] = useState<File | null>(null);
  const [nome, setNome] = useState('');
  const [diretorio, setDiretorio] = useState('');
  const [principal, setPrincipal] = useState('nao');

  const token = Cookies.get('token');

  useEffect(() => {
    fetchImagens();
  }, []);

  const fetchImagens = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos/${id}/imagens`);
      const data = await res.json();
      setImagens(Array.isArray(data) ? data : []);
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as imagens.',
        variant: 'destructive',
      });
      setImagens([]);
    }
  };

  const handleUpload = async () => {
    if (!arquivo) {
      toast({
        title: 'Erro',
        description: 'Selecione um arquivo de imagem.',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('imagem', arquivo);
    formData.append('nome', nome);
    formData.append('diretorio', diretorio);
    formData.append('principal', principal === 'sim' ? 'true' : 'false');

    setIsUploading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos/${id}/imagens`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error();

      toast({
        title: 'Sucesso',
        description: 'Imagem salva com sucesso.',
      });

      setArquivo(null);
      setNome('');
      setDiretorio('');
      setPrincipal('nao');
      await fetchImagens();
    } catch {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar imagem.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemover = async (imagemId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/produtos/imagens/${imagemId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error();

      toast({
        title: 'Removida',
        description: 'Imagem removida com sucesso.',
      });

      await fetchImagens();
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover a imagem.',
        variant: 'destructive',
      });
    }
  };

  const salvarEIncluirMais = async () => {
    await handleUpload();
  };

  const salvarEFInalizar = async () => {
    await handleUpload();
    router.push('/produtos');
  };

  const naoSalvarEFInalizar = () => {
    router.push('/produtos');
  };

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">Incluir Imagem do Produto</h1>

      <div className="space-y-4 mb-6">
        <div>
          <Label>Arquivo</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
            disabled={isUploading}
          />
        </div>
        <div>
          <Label>Nome do Arquivo</Label>
          <Input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="nome_da_imagem.jpg"
          />
        </div>
        <div>
          <Label>Diretório de origem</Label>
          <Input
            value={diretorio}
            onChange={(e) => setDiretorio(e.target.value)}
            placeholder="Ex: /desktop/produtos"
          />
        </div>
        <div>
          <Label>Imagem Principal?</Label>
          <RadioGroup value={principal} onValueChange={setPrincipal} className="flex gap-4 mt-2">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="sim" id="principal-sim" />
              <Label htmlFor="principal-sim">Sim</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="nao" id="principal-nao" />
              <Label htmlFor="principal-nao">Não</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={salvarEIncluirMais} disabled={isUploading}>
            Salvar e incluir +1 imagem
          </Button>
          <Button onClick={salvarEFInalizar} variant="default" disabled={isUploading}>
            Salvar e finalizar
          </Button>
          <Button onClick={naoSalvarEFInalizar} variant="outline">
            Não salvar e finalizar
          </Button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Imagens cadastradas</h2>
      {imagens.length === 0 ? (
        <p className="text-gray-500">Nenhuma imagem cadastrada.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {imagens.map((img) => (
            <div
              key={img.id}
              className="border rounded p-2 flex flex-col items-center shadow-sm relative"
            >
              {img.principal && (
                <span className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                  Principal
                </span>
              )}
              <img
                src={img.caminho}
                alt="Imagem do produto"
                className="w-full h-32 object-cover rounded mb-2"
              />
              <p className="text-sm text-center break-words mb-2">{img.nome}</p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemover(img.id)}
              >
                Remover
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
