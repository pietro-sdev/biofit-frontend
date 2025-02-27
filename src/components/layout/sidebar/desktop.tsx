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
  Users2,
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:text-primary"
                href="/admin"
              >
                <Users2 size={17} />
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
