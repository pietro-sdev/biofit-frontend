export default function CadastroProduto() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Cadastro de Produto</h1>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="nome">
              Nome do Produto
            </label>
            <input
              type="text"
              id="nome"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Digite o nome do produto"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="descricao">
              Descrição
            </label>
            <textarea
              id="descricao"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Digite a descrição do produto"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="preco">
              Preço
            </label>
            <input
              type="number"
              id="preco"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Digite o preço do produto"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Cadastrar Produto
          </button>
        </form>
      </div>
    </div>
  );
}