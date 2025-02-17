"use client";

import { useState, useEffect } from "react";
import CardsDash from "@/components/layout/cards-dash";
import { Users, UserX, ListMinus, UserPlus } from "lucide-react";
import dynamic from "next/dynamic";
import VerificacaoStatus from "@/components/layout/verificacao-status";

const Grafico = dynamic(() => import("@/components/layout/grafico-usuarios"), {
  ssr: false,
});

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    fetchUsers();
    fetchPendingRemovals();
  }, []);

  async function fetchUsers() {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) return;

      const res = await fetch(`${baseUrl}/users`);
      if (!res.ok) {
        console.error("Erro ao buscar usuários");
        return;
      }
      const users = await res.json();

      const active = users.filter((user: any) => user.status.toLowerCase() === "ativo").length;
      const inactive = users.filter((user: any) => user.status.toLowerCase() === "inativo").length;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const newUsers = users.filter((user: any) => new Date(user.createdAt) >= sevenDaysAgo).length;

      setActiveCount(active);
      setInactiveCount(inactive);
      setNewCount(newUsers);
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
    }
  }

  async function fetchPendingRemovals() {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) return;
      
      const res = await fetch(`${baseUrl}/removals`);
      if (!res.ok) {
        console.error("Erro ao buscar remoções");
        return;
      }
      const removals = await res.json();
      
      const pending = removals.filter((r: any) => r.status === "Pendente").length;
      setPendingCount(pending);
    } catch (error) {
      console.error("Erro ao buscar remoções", error);
    }
  }

  return (
    <main className="px-4 py-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard de Usuários</h1>

      <div className="mb-6">
        <VerificacaoStatus />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <CardsDash
          icon={<Users size={18} className="text-green-600" />}
          title="Usuários Ativos"
          value={activeCount.toString()}
        />
        <CardsDash
          icon={<UserX size={18} className="text-red-600" />}
          title="Usuários Inativos"
          value={inactiveCount.toString()}
        />
        <CardsDash
          icon={<UserPlus size={18} className="text-blue-600" />}
          title="Novos Usuários"
          value={newCount.toString()}
        />
        <CardsDash
          icon={<ListMinus size={18} className="text-yellow-600" />}
          title="Exclusões Pendentes"
          value={pendingCount.toString()}
        />
      </div>

      <div className="mt-8">{mounted && <Grafico />}</div>
    </main>
  );
}
