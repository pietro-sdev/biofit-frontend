"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Users,
  Settings,
  CreditCard,
  ListMinus,
  Bell,
  LogOut,
  UserSquare2Icon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Desktop() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3080";
      await fetch(`${baseUrl}/logout`, { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-r bg-background sm:flex flex-col">
      <nav className="flex flex-col items-center gap-4 px-2 py-5">
        <TooltipProvider>
          <Link
            className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary rounded-full text-primary-foreground"
            href="#"
          >
            <Avatar>
              <AvatarImage
                src="https://avatars.githubusercontent.com/u/199794500?s=400&u=9faf22b8c801474adf852fe5e63655c367e3c774&v=4"
                alt="BlockCode"
              />
              <AvatarFallback>BC</AvatarFallback>
            </Avatar>
            <span className="sr-only">Dashboard Avatar</span>
          </Link>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:text-primary"
                href="/dashboard"
              >
                <Home size={17} />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:text-primary"
                href="/gerenciamento-usuario"
              >
                <Users size={17} />
                <span className="sr-only">Gerenciamento de Usuários</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Gerenciamento de Usuários</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:text-primary"
                href="/config"
              >
                <Settings size={17} />
                <span className="sr-only">Configurações</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Configurações</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:text-primary"
                href="/pagamentos"
              >
                <CreditCard size={17} />
                <span className="sr-only">Pagamentos</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Pagamentos</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:text-primary"
                href="/remocao"
              >
                <ListMinus size={17} />
                <span className="sr-only">Lista de Remoção</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Lista de Remoção</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:text-primary"
                href="/notificacoes"
              >
                <Bell size={17} />
                <span className="sr-only">Notificações</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Notificações</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:text-primary"
                href="/admin"
              >
                <UserSquare2Icon size={17} />
                <span className="sr-only">Adicionar Administrador</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Adicionar Administrador</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
}
