import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, Users, Settings, CreditCard, ListMinus, Bell, LogOut, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
                                href="#"
                                className="flex h-10 w-10 bg-primary rounded-full text-lg
                                justify-center items-center text-primary-foreground md:text-base gap-2"
                            >
                                <Avatar>
                                    <AvatarImage
                                        src="https://avatars.githubusercontent.com/u/185261089?v=4"
                                        alt="BlockCode"
                                    />
                                    <AvatarFallback>BC</AvatarFallback>
                                </Avatar>
                                <span className="sr-only">Imagem do avatar</span>
                            </Link>

                            <Link
                                href="/dashboard"
                                className="flex items-center text-[15px] gap-3 px-[2.5px]
                                hover:text-primary"
                            >
                                <Home size={17} />
                                Dashboard
                            </Link>

                            <Link
                                href="/gerenciamento-usuario"
                                className="flex items-center text-[15px] gap-3 px-[2.5px]
                                hover:text-primary"
                            >
                                <Users size={17} />
                                Gerenciamento de Usuários
                            </Link>

                            <Link
                                href="/config"
                                className="flex items-center text-[15px] gap-3 px-[2.5px]
                                hover:text-primary"
                            >
                                <Settings size={17} />
                                Configurações
                            </Link>

                            <Link
                                href="/pagamentos"
                                className="flex items-center text-[15px] gap-3 px-[2.5px]
                                hover:text-primary"
                            >
                                <CreditCard size={17} />
                                Pagamentos
                            </Link>

                            <Link
                                href="/remocao"
                                className="flex items-center text-[15px] gap-3 px-[2.5px]
                                hover:text-primary"
                            >
                                <ListMinus size={17} />
                                Lista de Remoção
                            </Link>

                            <Link
                                href="/notificacoes"
                                className="flex items-center text-[15px] gap-3 px-[2.5px]
                                hover:text-primary"
                            >
                                <Bell size={17} />
                                Notificações
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                <h2>Menu</h2>
            </header>
        </div>
    );
}
