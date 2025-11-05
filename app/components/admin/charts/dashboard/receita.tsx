"use client";

import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type ReceitaMensal = { mes: string; receita: string }[];

export default function ReceitaChart({ data }: { data: ReceitaMensal }) {
  
  const chartData = data.map((item) => ({
    name: new Date(item.mes).toLocaleString("pt-BR", { month: "short" }),
    receita: parseFloat(item.receita),
  }));

  return (
    <div className="w-full h-44">
        {
            data.length === 0 ? (
                <p className="text-center text-brown-tertiary flex items-center justify-center h-full">Nenhum dado disponível</p>
            ) :       
            <ResponsiveContainer width="100%" height="100%" minHeight={0} minWidth={0}>
                <AreaChart
                data={chartData}
                margin={{ top: 10, right: 8, left: 8, bottom: 0 }}
                >
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300" />
                <XAxis dataKey="name" className="text-[10px]" interval={0}/>
                <Tooltip
                    contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    }}
                />
                <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="#BB8B40"
                    fill="#FFF8E4"
                />
                </AreaChart>
            </ResponsiveContainer>
        }
    </div>
  );
}
