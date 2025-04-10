"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";

export default function BackOfficePage() {
  const role = useUserStore((state) => state.role);

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Back Office</h1>
      </div>

      <div className="gap-4 flex">
        {role === "ADMIN" && (
          <Link href="/usuarios">
            <Button>Listar Usuários</Button>
          </Link>
        )}
        <Link href="/produtos">
          <Button>Listar Produtos</Button>
        </Link>
      </div>
    </div>
  );
}
