export default function ListagemProdutos() {
  // Exemplo de dados (substitua por uma chamada API ou estado)
  const produtos = [
    { id: 1, nome: "Produto A", descricao: "Descrição A", preco: 100 },
    { id: 2, nome: "Produto B", descricao: "Descrição B", preco: 200 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Listagem de Produtos</h1>
      <table className="w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2">Nome</th>
            <th className="px-4 py-2">Descrição</th>
            <th className="px-4 py-2">Preço</th>
            <th className="px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id} className="border-b">
              <td className="px-4 py-2">{produto.nome}</td>
              <td className="px-4 py-2">{produto.descricao}</td>
              <td className="px-4 py-2">R$ {produto.preco.toFixed(2)}</td>
              <td className="px-4 py-2">
                <a
                  href={`/editar-produto/${produto.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Editar
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}