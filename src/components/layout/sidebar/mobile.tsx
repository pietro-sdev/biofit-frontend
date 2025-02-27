import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, Users2 } from "lucide-react";

export function Mobile() {
    return (
        <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <header
                className="sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-background gap-4 
                sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
            >
                <Sheet>
                    <SheetTrigger asChild>
                        <Button size="icon" className="sm:hidden">
                            <Menu className="w-5 h-5" />
                            <span className="sr-only">Abrir e fechar menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side={"left"} className="sm:max-w-x flex-col flex">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link
                                href="/admin"
                                className="flex items-center text-[15px] gap-3 px-[2.5px]
                                hover:text-primary"
                            >
                                <Users2 size={17} />
                                Gerenciamento de Usuários
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                <h2>Menu</h2>
            </header>
        </div>
    );
}
