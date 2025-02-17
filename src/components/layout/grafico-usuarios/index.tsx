"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatsData {
  mes: string;
  newUsers: number;
  removedUsers: number;
}

export default function Grafico() {
  const [chartData, setChartData] = useState<StatsData[]>([]);

  useEffect(() => {
    fetchChartData();
  }, []);

  async function fetchChartData() {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) return;

      const res = await fetch(`${baseUrl}/stats/users-graph?months=6`);
      if (!res.ok) {
        console.error("Erro ao buscar estatísticas");
        return;
      }

      const data: StatsData[] = await res.json();
      // data deve ser algo como:
      // [
      //   { mes: "Jan 2023", newUsers: 70, removedUsers: 20 },
      //   { mes: "Feb 2023", newUsers: 80, removedUsers: 15 },
      //   ...
      // ]
      setChartData(data);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Evolução de Usuários</CardTitle>
        <CardDescription className="text-sm">
          Novos usuários e remoções - Últimos 6 meses
        </CardDescription>
      </CardHeader>

      <CardContent className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="mes"
              tickFormatter={(value) => value.slice(0, 3)} // Exemplo: "Jan 2023" -> "Jan"
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip wrapperStyle={{ fontSize: "12px" }} />
            <Legend wrapperStyle={{ fontSize: "12px", fontWeight: "500" }} />
            <Bar
              dataKey="newUsers"
              fill="#4CAF50"
              radius={[4, 4, 0, 0]}
              name="Novos Usuários"
            />
            <Bar
              dataKey="removedUsers"
              fill="#F44336"
              radius={[4, 4, 0, 0]}
              name="Removidos"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Mostrando novos usuários e remoções dos últimos 6 meses
        </div>
      </CardFooter>
    </Card>
  );
}
