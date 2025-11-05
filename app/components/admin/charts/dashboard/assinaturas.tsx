"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type AssinaturasPorPlano = { plano_id: string; total: string }[];

export default function AssinaturasChart({ data }: { data: AssinaturasPorPlano }) {

  const formatted = data.map((item) => ({
    name: item.plano_id === "PLANO_MENSAL" ? "Plano Mensal" : "Plano Anual",
    value: parseInt(item.total),
    color: item.plano_id === "PLANO_MENSAL" ? "#FCD466" : "#B57A2F",
  }));

  const semDados = data.length === 0;

  return (
    <div className="w-full h-44 flex items-center justify-center">
      {semDados ? (
        <p className="text-center text-brown-tertiary flex items-center justify-center h-full w-full">
          Nenhum dado disponível
        </p>
      ) : (
        <div className="w-full flex items-center justify-between gap-6 h-full">
          
          <div className="flex flex-col gap-3 pl-4">
            {formatted.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span
                  className="w-4 h-4 xl:w-5 xl:h-5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-brown-tertiary text-sm xl:text-base font-medium">
                  {entry.name}
                </span>
              </div>
            ))}
          </div>

          <div className="flex-1 h-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={0} minWidth={0}>
              <PieChart>
                <Pie
                  data={formatted}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius="100%"
                  startAngle={90}
                  endAngle={450}
                >
                  {formatted.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [`${value}`, name]}
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}
    </div>
  );
}
