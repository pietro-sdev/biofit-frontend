"use client";

import Link from "next/link";
import {
  ClipboardList,
  HomeIcon,
  Users2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserStore } from "@/store/userStore"; 
export function Desktop() {

  const role = useUserStore((state) => state.role); 

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-r bg-background sm:flex flex-col">
      <nav className="flex flex-col items-center gap-4 px-2 py-5">
        <TooltipProvider>
          {/* Backoffice */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:text-primary"
                href="/backoffice"
              >
                <HomeIcon size={17} />
                <span className="sr-only">Back-Office</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Back-Office</TooltipContent>
          </Tooltip>

          {role === "ADMIN" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:text-primary"
                  href="/usuarios"
                >
                  <Users2 size={17} />
                  <span className="sr-only">Listar Usuários</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Listar Usuários</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:text-primary"
                href="/produtos"
              >
                <ClipboardList size={17} />
                <span className="sr-only">Listar Produtos</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Listar Produtos</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
}
