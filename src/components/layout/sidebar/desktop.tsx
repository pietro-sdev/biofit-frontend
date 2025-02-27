import Link from "next/link";
import {
  Users2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export function Desktop() {
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
