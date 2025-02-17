import FormLogin from "./_components/form";

export default function Login() {
  return (
    <div className="flex h-screen">
      {/* Esquerda - Testemunho */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-black text-white p-10">
        <div className="max-w-md text-center">
          <p className="text-lg font-semibold">
          "O sucesso não é o final, o fracasso não é fatal: é a coragem de continuar que conta."
          </p>
          <p className="mt-4 font-bold">Winston Churchill</p>
        </div>
      </div>
      
      {/* Direita - Formulário de Login */}
      <div className="flex justify-center items-center w-full md:w-1/2 p-8">
        <FormLogin/>
      </div>
    </div>
  );
}
